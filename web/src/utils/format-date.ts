export function formatDate(
    dateStr: string | null,
    month: 'short' | 'long' = 'short'
): string {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month,
        day: 'numeric',
    })
}
