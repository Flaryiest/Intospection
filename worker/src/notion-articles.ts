import type { Article } from './types.js'
import { fetchPageBlocks, renderBlocksToHtml } from './notion-blocks.js'

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

interface NotionRichText {
    plain_text: string
}

interface NotionProperty {
    type: string
    title?: NotionRichText[]
    rich_text?: NotionRichText[]
    status?: { name: string } | null
    select?: { name: string } | null
    date?: { start: string } | null
    created_time?: string
    multi_select?: { name: string }[]
}

interface NotionPage {
    id: string
    created_time: string
    last_edited_time: string
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

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

export async function fetchArticlesFromNotion(
    apiKey: string,
    databaseId: string
): Promise<Article[]> {
    const pages: NotionPage[] = []
    let cursor: string | undefined = undefined

    do {
        const body: Record<string, unknown> = {
            page_size: 100,
            filter: {
                property: 'Status',
                status: { equals: 'Published' },
            },
        }
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

        cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined
    } while (cursor)

    const articles: Article[] = []

    for (const page of pages) {
        const props = page.properties

        // "Post" is the title property in this Notion database
        const titleProp = props['Post']
        const title =
            titleProp?.type === 'title'
                ? extractPlainText(titleProp.title ?? []) ?? ''
                : ''

        const slug = slugify(title)

        // "Notes" serves as the article description/summary
        const notesProp = props['Notes']
        const description =
            notesProp?.type === 'rich_text'
                ? extractPlainText(notesProp.rich_text ?? [])
                : null

        // Use page created_time as the published date
        const publishedAt = page.created_time ?? null

        const tagsProp = props['Tags']
        const tags =
            tagsProp?.type === 'multi_select'
                ? (tagsProp.multi_select ?? []).map((t) => t.name)
                : []

        const blocks = await fetchPageBlocks(apiKey, page.id)
        const contentHtml = renderBlocksToHtml(blocks)

        articles.push({
            id: page.id,
            title,
            slug,
            description,
            publishedAt,
            tags,
            contentHtml,
        })
    }

    articles.sort((a, b) => {
        if (!a.publishedAt && !b.publishedAt) return 0
        if (!a.publishedAt) return 1
        if (!b.publishedAt) return -1
        return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
    })

    return articles
}
