import { useState, useEffect } from 'react'
import type { ArticleSummary } from '@data/types'

const WORKER_URL = import.meta.env.PROD
    ? 'https://intospection-artifacts.ericmzuo1.workers.dev'
    : null

export function useArticles() {
    const [articles, setArticles] = useState<ArticleSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!WORKER_URL) {
            import('@data/articles.json').then((mod) => {
                setArticles(
                    (mod.default as ArticleSummary[]).map(
                        ({ id, title, slug, description, publishedAt, tags }) => ({
                            id,
                            title,
                            slug,
                            description,
                            publishedAt,
                            tags,
                        })
                    )
                )
                setIsLoading(false)
            })
            return
        }

        fetch(`${WORKER_URL}/articles`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => setArticles(data as ArticleSummary[]))
            .catch((err) =>
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load articles'
                )
            )
            .finally(() => setIsLoading(false))
    }, [])

    return { articles, isLoading, error }
}
