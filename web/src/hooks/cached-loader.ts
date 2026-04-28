export interface CachedLoader<T> {
    hasValue: () => boolean
    read: () => T | undefined
    load: () => Promise<T>
    preload: () => void
    clear: () => void
}

export function createCachedLoader<T>(
    fetchValue: () => Promise<T>
): CachedLoader<T> {
    let hasCachedValue = false
    let cachedValue: T | undefined
    let pending: Promise<T> | null = null

    const load = () => {
        if (hasCachedValue) return Promise.resolve(cachedValue as T)

        pending ??= fetchValue()
            .then((value) => {
                cachedValue = value
                hasCachedValue = true
                return value
            })
            .finally(() => {
                pending = null
            })

        return pending
    }

    return {
        hasValue: () => hasCachedValue,
        read: () => cachedValue,
        load,
        preload: () => {
            void load().catch(() => undefined)
        },
        clear: () => {
            hasCachedValue = false
            cachedValue = undefined
            pending = null
        },
    }
}
