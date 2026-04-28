import assert from 'node:assert/strict'
import test from 'node:test'
import { createCachedLoader } from '../src/hooks/cached-loader.ts'

test('shares an in-flight load and caches the resolved value', async () => {
    let calls = 0
    let resolveLoad!: (value: string[]) => void

    const loader = createCachedLoader<string[]>(
        () =>
            new Promise((resolve) => {
                calls += 1
                resolveLoad = resolve
            })
    )

    const first = loader.load()
    const second = loader.load()

    assert.equal(calls, 1)
    resolveLoad(['ready'])

    assert.deepEqual(await first, ['ready'])
    assert.deepEqual(await second, ['ready'])
    assert.equal(loader.hasValue(), true)
    assert.deepEqual(loader.read(), ['ready'])

    assert.deepEqual(await loader.load(), ['ready'])
    assert.equal(calls, 1)
})

test('does not cache rejected loads so a later load can retry', async () => {
    let calls = 0
    const loader = createCachedLoader(async () => {
        calls += 1
        if (calls === 1) throw new Error('temporary failure')
        return 'recovered'
    })

    await assert.rejects(loader.load(), /temporary failure/)
    assert.equal(loader.hasValue(), false)

    assert.equal(await loader.load(), 'recovered')
    assert.equal(calls, 2)
    assert.equal(loader.hasValue(), true)
})
