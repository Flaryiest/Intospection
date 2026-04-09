import { useState, useEffect } from 'react'
import type { Article } from '@data/types'

const WORKER_URL = import.meta.env.PROD
    ? 'https://intospection-artifacts.ericmzuo1.workers.dev'
    : null

export function useArticle(slug: string | undefined) {
    const [article, setArticle] = useState<Article | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!slug) {
            setIsLoading(false)
            return
        }

        if (!WORKER_URL) {
            import('@data/articles.json').then((mod) => {
                const found = (mod.default as Article[]).find(
                    (a) => a.slug === slug
                )
                setArticle(found ?? null)
                setIsLoading(false)
            })
            return
        }

        fetch(`${WORKER_URL}/articles/${encodeURIComponent(slug)}`)
            .then((res) => {
                if (res.status === 404) return null
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => setArticle(data as Article | null))
            .catch((err) =>
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load article'
                )
            )
            .finally(() => setIsLoading(false))
    }, [slug])

    return { article, isLoading, error }
}
