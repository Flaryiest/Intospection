import { useState, useEffect } from 'react'
import type { Article } from '@data/types'
import { hasArticle, loadArticle, readArticle } from './content-cache'

interface ArticleState {
    slug: string | undefined
    article: Article | null
    isPending: boolean
    error: string | null
}

export function useArticle(slug: string | undefined) {
    const hasCachedArticle = slug ? hasArticle(slug) : true
    const cachedArticle =
        slug && hasCachedArticle ? (readArticle(slug) ?? null) : null
    const [state, setState] = useState<ArticleState>({
        slug,
        article: cachedArticle,
        isPending: Boolean(slug && !hasCachedArticle),
        error: null,
    })
    const stateMatchesSlug = state.slug === slug
    const article = stateMatchesSlug ? state.article : cachedArticle
    const isPending = stateMatchesSlug
        ? state.isPending
        : Boolean(slug && !hasCachedArticle)
    const error = stateMatchesSlug ? state.error : null

    useEffect(() => {
        let cancelled = false

        if (!slug) return

        loadArticle(slug)
            .then((data) => {
                if (!cancelled) {
                    setState({
                        slug,
                        article: data,
                        isPending: false,
                        error: null,
                    })
                }
            })
            .catch(
                (err) =>
                    !cancelled &&
                    setState({
                        slug,
                        article: null,
                        isPending: false,
                        error:
                            err instanceof Error
                                ? err.message
                                : 'Failed to load article',
                    })
            )

        return () => {
            cancelled = true
        }
    }, [slug])

    return { article, isPending, isLoading: isPending, error }
}
