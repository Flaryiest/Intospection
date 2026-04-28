import type { Artifact, Article, ArticleSummary } from '@data/types'
import { createCachedLoader, type CachedLoader } from './cached-loader'

const WORKER_URL = import.meta.env.PROD
    ? 'https://intospection-artifacts.ericmzuo1.workers.dev'
    : null

function articleSummary({
    id,
    title,
    slug,
    description,
    publishedAt,
    tags,
}: Article): ArticleSummary {
    return { id, title, slug, description, publishedAt, tags }
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as T
}

const artifactsLoader = createCachedLoader<Artifact[]>(async () => {
    if (!WORKER_URL) {
        const mod = await import('@data/artifacts.json')
        return mod.default as Artifact[]
    }

    return fetchJson<Artifact[]>(`${WORKER_URL}/artifacts`)
})

const localArticlesLoader = createCachedLoader<Article[]>(async () => {
    const mod = await import('@data/articles.json')
    return mod.default as Article[]
})

const articlesLoader = createCachedLoader<ArticleSummary[]>(async () => {
    if (!WORKER_URL) {
        const articles = await localArticlesLoader.load()
        return articles.map(articleSummary)
    }

    return fetchJson<ArticleSummary[]>(`${WORKER_URL}/articles`)
})

const articleLoaders = new Map<string, CachedLoader<Article | null>>()

function getArticleLoader(slug: string): CachedLoader<Article | null> {
    let loader = articleLoaders.get(slug)
    if (loader) return loader

    loader = createCachedLoader<Article | null>(async () => {
        if (!WORKER_URL) {
            const articles = await localArticlesLoader.load()
            return articles.find((article) => article.slug === slug) ?? null
        }

        const response = await fetch(
            `${WORKER_URL}/articles/${encodeURIComponent(slug)}`
        )
        if (response.status === 404) return null
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return (await response.json()) as Article
    })
    articleLoaders.set(slug, loader)
    return loader
}

export function preloadContent() {
    artifactsLoader.preload()
    articlesLoader.preload()
}

export function readArtifacts() {
    return artifactsLoader.read()
}

export function loadArtifacts() {
    return artifactsLoader.load()
}

export function readArticles() {
    return articlesLoader.read()
}

export function loadArticles() {
    return articlesLoader.load()
}

export function hasArticle(slug: string) {
    return getArticleLoader(slug).hasValue()
}

export function readArticle(slug: string) {
    return getArticleLoader(slug).read()
}

export function loadArticle(slug: string) {
    return getArticleLoader(slug).load()
}
