import type { Artifact } from '@data/types'
import { formatDate } from '@utils/format-date'
import ScoreRing from './score-ring'
import styles from './artifact-item.module.css'

interface ArtifactItemProps {
    artifact: Artifact
    isActive: boolean
    onSelect: (artifact: Artifact) => void
}

export default function ArtifactItem({
    artifact,
    isActive,
    onSelect,
}: ArtifactItemProps) {
    const date = artifact.createdAt ? formatDate(artifact.createdAt) : null
    return (
        <tr
            className={`${styles.row}${isActive ? ` ${styles.active}` : ''}`}
            onClick={() => onSelect(artifact)}
        >
            <td>
                <div className={styles.info}>
                    <span className={styles.title}>{artifact.title}</span>
                    {date && <span className={styles.mobileDate}>{date}</span>}
                    {artifact.tags.length > 0 && (
                        <div className={styles.tags}>
                            {artifact.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </td>
            <td className={styles.date}>{date ?? '–'}</td>
            <td className={styles.scoreCell}>
                {artifact.internalization !== null ? (
                    <ScoreRing
                        value={artifact.internalization}
                        color="green"
                        label=""
                    />
                ) : (
                    <span className={styles.emptyScore}>–</span>
                )}
            </td>
        </tr>
    )
}
