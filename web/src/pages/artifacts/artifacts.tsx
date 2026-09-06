import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Artifact } from '@data/types'
import { useArtifacts } from '@hooks/useArtifacts'
import { formatDate } from '@utils/format-date'
import TagFilter from '@components/tag-filter/tag-filter'
import ScoreRing from './artifact-item/score-ring'
import ArtifactItem from './artifact-item/artifact-item'
import styles from './artifacts.module.css'

type SortField = 'internalization'
type SortDir = 'asc' | 'desc'
type SortState = { field: SortField; dir: SortDir } | null

export default function Artifacts() {
    const { artifacts, isLoading, error } = useArtifacts()
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const [selected, setSelected] = useState<Artifact | null>(null)
    const [sort, setSort] = useState<SortState>(null)

    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        artifacts.forEach((a) => a.tags.forEach((t) => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [artifacts])

    const filtered = useMemo(() => {
        if (!activeTag) return artifacts
        return artifacts.filter((a) => a.tags.includes(activeTag))
    }, [artifacts, activeTag])

    const sorted = useMemo(() => {
        if (!sort) return filtered
        return [...filtered].sort((a, b) => {
            const av = a[sort.field] ?? -1
            const bv = b[sort.field] ?? -1
            return sort.dir === 'desc' ? bv - av : av - bv
        })
    }, [filtered, sort])

    const toggleSort = useCallback((field: SortField) => {
        setSort((prev) => {
            if (!prev || prev.field !== field) return { field, dir: 'desc' }
            if (prev.dir === 'desc') return { field, dir: 'asc' }
            return null
        })
    }, [])

    const closeSidebar = useCallback(() => setSelected(null), [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSidebar()
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [closeSidebar])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Artifacts</h1>
            <p className={styles.subtitle}>
                Things I've read, watched, and explored.
            </p>
            {isLoading ? (
                <p className={`${styles.subtitle} ${styles.delayedLoading}`}>
                    Loading artifacts...
                </p>
            ) : error ? (
                <p className={styles.subtitle}>Failed to load artifacts.</p>
            ) : (
                <>
                    <TagFilter
                        tags={allTags}
                        activeTag={activeTag}
                        onTagSelect={setActiveTag}
                    />
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.colTitle}>Title</th>
                                    <th className={styles.colDate}>Date</th>
                                    <th
                                        className={`${styles.colInternalization} ${styles.sortable}`}
                                        onClick={() =>
                                            toggleSort('internalization')
                                        }
                                    >
                                        <span className={styles.labelFull}>
                                            Internalization
                                        </span>
                                        <span className={styles.labelShort}>
                                            Score
                                        </span>
                                        <span
                                            className={`${styles.sortArrow}${sort?.field === 'internalization' ? ` ${styles.sortArrowVisible}` : ''}`}
                                        >
                                            {sort?.field ===
                                                'internalization' &&
                                            sort.dir === 'asc'
                                                ? '▲'
                                                : '▼'}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((artifact) => (
                                    <ArtifactItem
                                        key={artifact.id}
                                        artifact={artifact}
                                        isActive={selected?.id === artifact.id}
                                        onSelect={setSelected}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!isLoading && !error && artifacts.length > 0 && (
                        <p className={styles.count}>
                            {filtered.length} artifact
                            {filtered.length !== 1 ? 's' : ''}
                            {activeTag ? ` tagged "${activeTag}"` : ''}
                        </p>
                    )}
                </>
            )}

            {selected && (
                <>
                    <div className={styles.overlay} onClick={closeSidebar} />
                    <div className={styles.sidebar}>
                        <button
                            className={styles.sidebarClose}
                            onClick={closeSidebar}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className={styles.sidebarTitle}>
                            {selected.title}
                        </h2>
                        {selected.url && (
                            <a
                                href={selected.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.sidebarLink}
                            >
                                {selected.url}
                            </a>
                        )}
                        {selected.createdAt && (
                            <p className={styles.sidebarDate}>
                                {formatDate(selected.createdAt)}
                            </p>
                        )}
                        <div className={styles.sidebarScores}>
                            {selected.internalization !== null && (
                                <ScoreRing
                                    value={selected.internalization}
                                    color="green"
                                    label="Internalization"
                                />
                            )}
                        </div>
                        {selected.tags.length > 0 && (
                            <div className={styles.sidebarTags}>
                                {selected.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={styles.sidebarTag}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {selected.notes && (
                            <>
                                <p className={styles.sidebarNotesLabel}>
                                    Notes
                                </p>
                                <p className={styles.sidebarNotes}>
                                    {selected.notes}
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
