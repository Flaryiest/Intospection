import { fetchArtifactsFromNotion } from './notion.js'

interface Env {
    ARTIFACTS_KV: KVNamespace
    NOTION_API_KEY: string
    NOTION_DATABASE_ID: string
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

        if (url.pathname === '/sync' && request.method === 'POST') {
            await syncArtifacts(env)
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
        ctx.waitUntil(syncArtifacts(env))
    },
}

async function syncArtifacts(env: Env): Promise<void> {
    console.log('Starting Notion sync...')
    const artifacts = await fetchArtifactsFromNotion(
        env.NOTION_API_KEY,
        env.NOTION_DATABASE_ID
    )
    await env.ARTIFACTS_KV.put('artifacts', JSON.stringify(artifacts))
    console.log(`Synced ${artifacts.length} artifacts to KV`)
}
