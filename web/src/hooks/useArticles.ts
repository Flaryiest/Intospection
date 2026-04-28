import { useState, useEffect } from 'react'
import type { ArticleSummary } from '@data/types'
import { loadArticles, readArticles } from './content-cache'

export function useArticles() {
    const cachedArticles = readArticles()
    const [articles, setArticles] = useState<ArticleSummary[]>(
        cachedArticles ?? []
    )
    const [isPending, setIsPending] = useState(cachedArticles === undefined)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        loadArticles()
            .then((data) => {
                if (!cancelled) {
                    setArticles(data)
                    setError(null)
                }
            })
            .catch(
                (err) =>
                    !cancelled &&
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to load articles'
                    )
            )
            .finally(() => {
                if (!cancelled) setIsPending(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    return { articles, isPending, isLoading: isPending, error }
}
