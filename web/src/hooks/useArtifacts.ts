import { useState, useEffect } from 'react'
import type { Artifact } from '@data/types'
import { loadArtifacts, readArtifacts } from './content-cache'

export function useArtifacts() {
    const cachedArtifacts = readArtifacts()
    const [artifacts, setArtifacts] = useState<Artifact[]>(
        cachedArtifacts ?? []
    )
    const [isPending, setIsPending] = useState(cachedArtifacts === undefined)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        loadArtifacts()
            .then((data) => {
                if (!cancelled) {
                    setArtifacts(data)
                    setError(null)
                }
            })
            .catch(
                (err) =>
                    !cancelled &&
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to load artifacts'
                    )
            )
            .finally(() => {
                if (!cancelled) setIsPending(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    return { artifacts, isPending, isLoading: isPending, error }
}
