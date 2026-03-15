import type { Artifact } from '@data/types'
import styles from './artifact-item.module.css'

interface ArtifactItemProps {
    artifact: Artifact
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function ArtifactItem({ artifact }: ArtifactItemProps) {
    return (
        <div className={styles.item}>
            <div className={styles.header}>
                {artifact.url ? (
                    <a
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.title}
                    >
                        {artifact.title}
                    </a>
                ) : (
                    <span className={styles.title}>{artifact.title}</span>
                )}
            </div>
            <div className={styles.meta}>
                {artifact.enjoyment !== null && (
                    <span className={styles.score}>
                        Enjoyment: {artifact.enjoyment}/10
                    </span>
                )}
                {artifact.importance !== null && (
                    <span className={styles.score}>
                        Importance: {artifact.importance}/10
                    </span>
                )}
                {artifact.createdAt && (
                    <span className={styles.date}>
                        {formatDate(artifact.createdAt)}
                    </span>
                )}
            </div>
            {artifact.tags.length > 0 && (
                <div className={styles.tags}>
                    {artifact.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {artifact.notes && (
                <p className={styles.notes}>{artifact.notes}</p>
            )}
        </div>
    )
}
