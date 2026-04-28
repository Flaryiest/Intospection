import { Link, useParams } from 'react-router-dom'
import { useArticle } from '@hooks/useArticle'
import styles from './writing.module.css'

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>()
    const { article, isLoading, error } = useArticle(slug)

    if (isLoading) {
        return (
            <div className={styles.container}>
                <p className={`${styles.emptyText} ${styles.delayedLoading}`}>
                    Loading...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.emptyText}>Failed to load article.</p>
            </div>
        )
    }

    if (!article) {
        return (
            <div className={styles.container}>
                <Link to="/writing" className={styles.backLink}>
                    ← Back to Writing
                </Link>
                <p className={styles.emptyText}>Article not found.</p>
            </div>
        )
    }

    return (
        <div className={styles.articleContainer}>
            <Link to="/writing" className={styles.backLink}>
                ← Back to Writing
            </Link>

            <header className={styles.articleHeader}>
                <h1 className={styles.articlePageTitle}>{article.title}</h1>
                <div className={styles.articleMeta}>
                    {article.publishedAt && (
                        <span className={styles.articleDate}>
                            {formatDate(article.publishedAt)}
                        </span>
                    )}
                    {article.tags.length > 0 && (
                        <div className={styles.articleTags}>
                            {article.tags.map((tag) => (
                                <span key={tag} className={styles.articleTag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div
                className={styles.prose}
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
        </div>
    )
}
