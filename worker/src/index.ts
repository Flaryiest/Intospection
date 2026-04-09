import { fetchArtifactsFromNotion } from './notion.js'
import { fetchArticlesFromNotion } from './notion-articles.js'
import type { ArticleSummary } from './types.js'

interface Env {
    ARTIFACTS_KV: KVNamespace
    WRITING_KV: KVNamespace
    NOTION_API_KEY: string
    NOTION_DATABASE_ID: string
    NOTION_WRITING_DATABASE_ID: string
}

const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://ericzuo.ca',
    'https://www.ericzuo.ca',
]

function corsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('Origin') ?? ''
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ''
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(request),
            })
        }

        if (url.pathname === '/artifacts' && request.method === 'GET') {
            const data = await env.ARTIFACTS_KV.get('artifacts')
            return new Response(data ?? '[]', {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(request),
                },
            })
        }

        if (url.pathname === '/articles' && request.method === 'GET') {
            const data = await env.WRITING_KV.get('articles')
            return new Response(data ?? '[]', {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(request),
                },
            })
        }

        const articleMatch = url.pathname.match(/^\/articles\/(.+)$/)
        if (articleMatch && request.method === 'GET') {
            const slug = decodeURIComponent(articleMatch[1])
            const data = await env.WRITING_KV.get(`article:${slug}`)
            if (!data) {
                return new Response('Not Found', {
                    status: 404,
                    headers: corsHeaders(request),
                })
            }
            return new Response(data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders(request),
                },
            })
        }

        if (url.pathname === '/sync' && request.method === 'POST') {
            await Promise.all([syncArtifacts(env), syncArticles(env)])
            return new Response(JSON.stringify({ ok: true }), {
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response('Not Found', { status: 404 })
    },

    async scheduled(
        _event: ScheduledEvent,
        env: Env,
        ctx: ExecutionContext
    ): Promise<void> {
        ctx.waitUntil(
            Promise.all([syncArtifacts(env), syncArticles(env)])
        )
    },
}

async function syncArtifacts(env: Env): Promise<void> {
    console.log('Starting artifact sync...')
    const artifacts = await fetchArtifactsFromNotion(
        env.NOTION_API_KEY,
        env.NOTION_DATABASE_ID
    )
    await env.ARTIFACTS_KV.put('artifacts', JSON.stringify(artifacts))
    console.log(`Synced ${artifacts.length} artifacts to KV`)
}

async function syncArticles(env: Env): Promise<void> {
    console.log('Starting article sync...')
    const articles = await fetchArticlesFromNotion(
        env.NOTION_API_KEY,
        env.NOTION_WRITING_DATABASE_ID
    )

    const summaries: ArticleSummary[] = articles.map(
        ({ contentHtml: _, ...summary }) => summary
    )
    await env.WRITING_KV.put('articles', JSON.stringify(summaries))

    await Promise.all(
        articles.map((article) =>
            env.WRITING_KV.put(
                `article:${article.slug}`,
                JSON.stringify(article)
            )
        )
    )

    console.log(`Synced ${articles.length} articles to KV`)
}
