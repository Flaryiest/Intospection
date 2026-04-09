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

export interface ArticleSummary {
    id: string
    title: string
    slug: string
    description: string | null
    publishedAt: string | null
    tags: string[]
}

export interface Article extends ArticleSummary {
    contentHtml: string
}
