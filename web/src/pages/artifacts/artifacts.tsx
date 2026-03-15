import { useState, useMemo } from 'react'
import artifactsData from '@data/artifacts.json'
import type { Artifact } from '@data/types'
import TagFilter from '@components/tag-filter/tag-filter'
import ArtifactItem from './artifact-item/artifact-item'
import styles from './artifacts.module.css'

const artifacts = artifactsData as Artifact[]

export default function Artifacts() {
    const [activeTag, setActiveTag] = useState<string | null>(null)

    const allTags = useMemo(() => {
        const tagSet = new Set<string>()
        artifacts.forEach((a) => a.tags.forEach((t) => tagSet.add(t)))
        return Array.from(tagSet).sort()
    }, [])

    const filtered = useMemo(() => {
        if (!activeTag) return artifacts
        return artifacts.filter((a) => a.tags.includes(activeTag))
    }, [activeTag])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Artifacts</h1>
            <p className={styles.subtitle}>
                Things I've read, watched, and explored.
            </p>
            <TagFilter
                tags={allTags}
                activeTag={activeTag}
                onTagSelect={setActiveTag}
            />
            <div className={styles.list}>
                {filtered.map((artifact) => (
                    <ArtifactItem key={artifact.id} artifact={artifact} />
                ))}
            </div>
            {artifacts.length > 0 && (
                <p className={styles.count}>
                    {filtered.length} artifact
                    {filtered.length !== 1 ? 's' : ''}
                    {activeTag ? ` tagged "${activeTag}"` : ''}
                </p>
            )}
        </div>
    )
}
