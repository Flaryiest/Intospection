import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '@hooks/useArticles'
import styles from './writing.module.css'

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function Writing() {
    const { articles, isLoading, error } = useArticles()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'success' | 'error'
    >('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email.trim()) return

        setStatus('loading')
        const apiBase = import.meta.env.PROD
            ? 'https://intospection-production.up.railway.app'
            : 'http://localhost:3001'
        try {
            const res = await fetch(`${apiBase}/api/mailing-list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Something went wrong')
            }
            setStatus('success')
            setEmail('')
        } catch (err) {
            setStatus('error')
            setErrorMsg(
                err instanceof Error ? err.message : 'Something went wrong'
            )
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Writing</h1>
            <p className={styles.subtitle}>
                Thoughts on software, life, and everything in between.
            </p>

            <div className={styles.subscribe}>
                <p className={styles.subscribeText}>
                    If you'd like to know when I publish something new, leave
                    your email below.
                </p>
                {status === 'success' ? (
                    <p className={styles.successMsg}>
                        You're on the list — thank you!
                    </p>
                ) : (
                    <form
                        className={styles.subscribeForm}
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.emailInput}
                            required
                        />
                        <button
                            type="submit"
                            className={styles.subscribeBtn}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading'
                                ? 'Subscribing...'
                                : 'Subscribe'}
                        </button>
                    </form>
                )}
                {status === 'error' && (
                    <p className={styles.errorMsg}>{errorMsg}</p>
                )}
            </div>

            <div className={styles.divider}></div>

            {isLoading ? (
                <p className={styles.emptyText}>Loading articles...</p>
            ) : error ? (
                <p className={styles.emptyText}>Failed to load articles.</p>
            ) : articles.length === 0 ? (
                <div className={styles.empty}>
                    <p className={styles.emptyText}>
                        Nothing here yet — check back later.
                    </p>
                </div>
            ) : (
                <div className={styles.articleList}>
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/writing/${article.slug}`}
                            className={styles.articleCard}
                        >
                            <h2 className={styles.articleTitle}>
                                {article.title}
                            </h2>
                            <div className={styles.articleMeta}>
                                {article.publishedAt && (
                                    <span className={styles.articleDate}>
                                        {formatDate(article.publishedAt)}
                                    </span>
                                )}
                                {article.tags.length > 0 && (
                                    <div className={styles.articleTags}>
                                        {article.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={styles.articleTag}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {article.description && (
                                <p className={styles.articleDescription}>
                                    {article.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
