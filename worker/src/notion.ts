import type { Artifact } from './types.js'

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

interface NotionRichText {
    plain_text: string
}

interface NotionProperty {
    type: string
    title?: NotionRichText[]
    number?: number | null
    status?: { name: string } | null
    select?: { name: string } | null
    url?: string | null
    date?: { start: string } | null
    created_time?: string
    rich_text?: NotionRichText[]
    multi_select?: { name: string }[]
}

interface NotionPage {
    id: string
    properties: Record<string, NotionProperty>
}

interface NotionQueryResponse {
    results: NotionPage[]
    has_more: boolean
    next_cursor: string | null
}

function extractPlainText(richText: NotionRichText[]): string | null {
    if (!richText || richText.length === 0) return null
    return richText.map((t) => t.plain_text).join('')
}

function extractPageProperties(page: NotionPage): Artifact {
    const props = page.properties

    const titleProp = props['Topic']
    const title =
        titleProp?.type === 'title'
            ? extractPlainText(titleProp.title ?? []) ?? ''
            : ''

    const internalizationProp = props['Internalization']
    const internalization =
        internalizationProp?.type === 'number'
            ? internalizationProp.number ?? null
            : null

    const statusProp = props['Status']
    const status =
        statusProp?.type === 'status'
            ? (statusProp.status?.name ?? null)
            : statusProp?.type === 'select'
              ? (statusProp.select?.name ?? null)
              : null

    const originProp = props['Origin']
    const url = originProp?.type === 'url' ? originProp.url ?? null : null

    const createdProp = props['Created']
    const createdAt =
        createdProp?.type === 'date'
            ? (createdProp.date?.start ?? null)
            : createdProp?.type === 'created_time'
              ? createdProp.created_time ?? null
              : null

    const notesProp = props['Notes']
    const notes =
        notesProp?.type === 'rich_text'
            ? extractPlainText(notesProp.rich_text ?? [])
            : null

    const tagsProp = props['Tags']
    const tags =
        tagsProp?.type === 'multi_select'
            ? (tagsProp.multi_select ?? []).map((t) => t.name)
            : []

    return {
        id: page.id,
        title,
        internalization,
        status,
        url,
        createdAt,
        notes,
        tags,
    }
}

export async function fetchArtifactsFromNotion(
    apiKey: string,
    databaseId: string
): Promise<Artifact[]> {
    const pages: NotionPage[] = []
    let cursor: string | undefined = undefined

    do {
        const body: Record<string, unknown> = { page_size: 100 }
        if (cursor) body.start_cursor = cursor

        const response = await fetch(
            `${NOTION_API}/databases/${databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Notion-Version': NOTION_VERSION,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        )

        if (!response.ok) {
            throw new Error(
                `Notion API error: ${response.status} ${await response.text()}`
            )
        }

        const data = (await response.json()) as NotionQueryResponse

        for (const page of data.results) {
            if ('properties' in page) {
                pages.push(page)
            }
        }

        cursor = data.has_more
            ? (data.next_cursor ?? undefined)
            : undefined
    } while (cursor)

    const artifacts = pages.map(extractPageProperties)

    artifacts.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    })

    return artifacts
}
