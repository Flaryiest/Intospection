export interface Artifact {
    id: string
    title: string
    enjoyment: number | null
    importance: number | null
    status: string | null
    url: string | null
    createdAt: string | null
    notes: string | null
    tags: string[]
}
