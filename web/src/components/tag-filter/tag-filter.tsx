import styles from './tag-filter.module.css'

interface TagFilterProps {
    tags: string[]
    activeTag: string | null
    onTagSelect: (tag: string | null) => void
}

export default function TagFilter({
    tags,
    activeTag,
    onTagSelect,
}: TagFilterProps) {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.tag} ${activeTag === null ? styles.active : ''}`}
                onClick={() => onTagSelect(null)}
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`${styles.tag} ${activeTag === tag ? styles.active : ''}`}
                    onClick={() => onTagSelect(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    )
}
