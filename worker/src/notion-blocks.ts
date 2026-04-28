const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

interface NotionRichText {
    plain_text: string
    href: string | null
    annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
    }
}

interface NotionBlock {
    id: string
    type: string
    has_children: boolean
    children?: NotionBlock[]
    [key: string]: unknown
}

interface BlockContent {
    rich_text?: NotionRichText[]
    caption?: NotionRichText[]
    language?: string
    icon?: { type: string; emoji?: string }
    url?: string
    file?: { url: string }
    external?: { url: string }
    type?: string
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

function renderRichText(richText: NotionRichText[]): string {
    if (!richText || richText.length === 0) return ''

    return richText
        .map((segment) => {
            let html = escapeHtml(segment.plain_text)

            if (segment.annotations.code) html = `<code>${html}</code>`
            if (segment.annotations.bold) html = `<strong>${html}</strong>`
            if (segment.annotations.italic) html = `<em>${html}</em>`
            if (segment.annotations.strikethrough) html = `<s>${html}</s>`
            if (segment.annotations.underline) html = `<u>${html}</u>`

            if (
                segment.annotations.color &&
                segment.annotations.color !== 'default'
            ) {
                const color = segment.annotations.color.replace(
                    '_background',
                    ''
                )
                if (segment.annotations.color.includes('_background')) {
                    html = `<span style="background-color: var(--notion-${color})">${html}</span>`
                } else {
                    html = `<span style="color: var(--notion-${color})">${html}</span>`
                }
            }

            if (segment.href) {
                html = `<a href="${escapeHtml(segment.href)}" target="_blank" rel="noopener noreferrer">${html}</a>`
            }

            return html
        })
        .join('')
}

function getBlockContent(block: NotionBlock): BlockContent {
    return (block[block.type] as BlockContent) ?? {}
}

function getImageUrl(block: NotionBlock): string | null {
    const content = getBlockContent(block)
    if (content.type === 'file') return content.file?.url ?? null
    if (content.type === 'external') return content.external?.url ?? null
    return null
}

function renderChildren(block: NotionBlock): string {
    if (!block.children || block.children.length === 0) return ''
    return renderBlocksToHtml(block.children)
}

export function renderBlocksToHtml(blocks: NotionBlock[]): string {
    const parts: string[] = []
    let i = 0

    while (i < blocks.length) {
        const block = blocks[i]
        const content = getBlockContent(block)
        const richText = content.rich_text ?? []

        // Group adjacent list items
        if (block.type === 'bulleted_list_item') {
            parts.push('<ul>')
            while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
                const li = blocks[i]
                const liContent = getBlockContent(li)
                parts.push(
                    `<li>${renderRichText(liContent.rich_text ?? [])}${renderChildren(li)}</li>`
                )
                i++
            }
            parts.push('</ul>')
            continue
        }

        if (block.type === 'numbered_list_item') {
            parts.push('<ol>')
            while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
                const li = blocks[i]
                const liContent = getBlockContent(li)
                parts.push(
                    `<li>${renderRichText(liContent.rich_text ?? [])}${renderChildren(li)}</li>`
                )
                i++
            }
            parts.push('</ol>')
            continue
        }

        switch (block.type) {
            case 'paragraph':
                parts.push(`<p>${renderRichText(richText)}</p>`)
                break

            case 'heading_1':
                parts.push(`<h2>${renderRichText(richText)}</h2>`)
                break

            case 'heading_2':
                parts.push(`<h3>${renderRichText(richText)}</h3>`)
                break

            case 'heading_3':
                parts.push(`<h4>${renderRichText(richText)}</h4>`)
                break

            case 'code': {
                const lang = content.language ?? ''
                const caption = renderRichText(content.caption ?? [])
                parts.push(
                    `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(
                        richText.map((t) => t.plain_text).join('')
                    )}</code></pre>`
                )
                if (caption) parts.push(`<p class="code-caption">${caption}</p>`)
                break
            }

            case 'quote':
                parts.push(
                    `<blockquote>${renderRichText(richText)}${renderChildren(block)}</blockquote>`
                )
                break

            case 'callout': {
                const icon = content.icon?.emoji ?? ''
                parts.push(
                    `<div class="callout">${icon ? `<span class="callout-icon">${icon}</span>` : ''}<div>${renderRichText(richText)}${renderChildren(block)}</div></div>`
                )
                break
            }

            case 'image': {
                const url = getImageUrl(block)
                if (url) {
                    const caption = renderRichText(content.caption ?? [])
                    parts.push(
                        `<figure><img src="${escapeHtml(url)}" alt="${caption ? escapeHtml(richText.map((t) => t.plain_text).join('')) : ''}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
                    )
                }
                break
            }

            case 'bookmark': {
                const url = (block.bookmark as { url?: string })?.url ?? ''
                const caption = renderRichText(content.caption ?? [])
                parts.push(
                    `<a class="bookmark" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${caption || escapeHtml(url)}</a>`
                )
                break
            }

            case 'divider':
                parts.push('<hr />')
                break

            case 'toggle':
                parts.push(
                    `<details><summary>${renderRichText(richText)}</summary>${renderChildren(block)}</details>`
                )
                break

            case 'table_of_contents':
                // Skip — TOC is handled by the page structure
                break

            default:
                // Unsupported block type — render rich text if available
                if (richText.length > 0) {
                    parts.push(`<p>${renderRichText(richText)}</p>`)
                }
                break
        }

        i++
    }

    return parts.join('\n')
}

export async function fetchPageBlocks(
    apiKey: string,
    pageId: string
): Promise<NotionBlock[]> {
    const blocks: NotionBlock[] = []
    let cursor: string | undefined = undefined

    do {
        const url = new URL(`${NOTION_API}/blocks/${pageId}/children`)
        url.searchParams.set('page_size', '100')
        if (cursor) url.searchParams.set('start_cursor', cursor)

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Notion-Version': NOTION_VERSION,
            },
        })

        if (!response.ok) {
            throw new Error(
                `Notion blocks API error: ${response.status} ${await response.text()}`
            )
        }

        const data = (await response.json()) as {
            results: NotionBlock[]
            has_more: boolean
            next_cursor: string | null
        }

        for (const block of data.results) {
            if (block.has_children) {
                block.children = await fetchPageBlocks(apiKey, block.id)
            }
            blocks.push(block)
        }

        cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined
    } while (cursor)

    return blocks
}
