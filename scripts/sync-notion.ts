import 'dotenv/config'
import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type {
    PageObjectResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Artifact {
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

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error(
        'Missing NOTION_API_KEY or NOTION_DATABASE_ID in environment variables'
    )
    process.exit(1)
}

const notion = new Client({ auth: NOTION_API_KEY })

function extractPlainText(richText: RichTextItemResponse[]): string | null {
    if (!richText || richText.length === 0) return null
    return richText.map((t) => t.plain_text).join('')
}

function extractPageProperties(page: PageObjectResponse): Artifact {
    const props = page.properties

    const titleProp = props['Topic']
    const title =
        titleProp?.type === 'title'
            ? extractPlainText(titleProp.title) ?? ''
            : ''

    const enjoymentProp = props['Enjoyment']
    const enjoyment =
        enjoymentProp?.type === 'number' ? enjoymentProp.number : null

    const importanceProp = props['Importance']
    const importance =
        importanceProp?.type === 'number' ? importanceProp.number : null

    const statusProp = props['Status']
    const status =
        statusProp?.type === 'status'
            ? (statusProp.status?.name ?? null)
            : statusProp?.type === 'select'
              ? (statusProp.select?.name ?? null)
              : null

    const originProp = props['Origin']
    const url = originProp?.type === 'url' ? originProp.url : null

    const createdProp = props['Created']
    const createdAt =
        createdProp?.type === 'date'
            ? (createdProp.date?.start ?? null)
            : createdProp?.type === 'created_time'
              ? createdProp.created_time
              : null

    const notesProp = props['Notes']
    const notes =
        notesProp?.type === 'rich_text'
            ? extractPlainText(notesProp.rich_text)
            : null

    const tagsProp = props['Tags']
    const tags =
        tagsProp?.type === 'multi_select'
            ? tagsProp.multi_select.map((t) => t.name)
            : []

    return {
        id: page.id,
        title,
        enjoyment,
        importance,
        status,
        url,
        createdAt,
        notes,
        tags,
    }
}

async function fetchAllPages(): Promise<PageObjectResponse[]> {
    const pages: PageObjectResponse[] = []
    let cursor: string | undefined = undefined

    do {
        const response = await notion.databases.query({
            database_id: NOTION_DATABASE_ID!,
            start_cursor: cursor,
            page_size: 100,
        })

        for (const page of response.results) {
            if ('properties' in page) {
                pages.push(page as PageObjectResponse)
            }
        }

        cursor = response.has_more
            ? (response.next_cursor ?? undefined)
            : undefined
    } while (cursor)

    return pages
}

async function main() {
    console.log('Fetching artifacts from Notion...')

    const pages = await fetchAllPages()
    const artifacts = pages.map(extractPageProperties)

    // Sort by createdAt descending (newest first)
    artifacts.sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const outputPath = resolve(__dirname, '../web/src/data/artifacts.json')
    writeFileSync(outputPath, JSON.stringify(artifacts, null, 4), 'utf-8')

    console.log(`Synced ${artifacts.length} artifacts to ${outputPath}`)
}

main().catch((err) => {
    console.error('Failed to sync:', err)
    process.exit(1)
})
