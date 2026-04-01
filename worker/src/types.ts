export interface Artifact {
    id: string
    title: string
    internalization: number | null
    status: string | null
    url: string | null
    createdAt: string | null
    notes: string | null
    tags: string[]
}
