import { useState, useEffect } from 'react'
import type { Artifact } from '@data/types'

const WORKER_URL = import.meta.env.PROD
    ? 'https://intospection-artifacts.ericmzuo1.workers.dev'
    : null

export function useArtifacts() {
    const [artifacts, setArtifacts] = useState<Artifact[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!WORKER_URL) {
            import('@data/artifacts.json').then((mod) => {
                setArtifacts(mod.default as Artifact[])
                setIsLoading(false)
            })
            return
        }

        fetch(`${WORKER_URL}/artifacts`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => setArtifacts(data as Artifact[]))
            .catch((err) =>
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load artifacts'
                )
            )
            .finally(() => setIsLoading(false))
    }, [])

    return { artifacts, isLoading, error }
}
