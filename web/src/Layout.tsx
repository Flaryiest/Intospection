import { useState, useEffect, useCallback } from 'react'
import Navbar from '@components/navbar/navbar'
import Footer from '@components/footer/footer'
import CursorCanvas from '@components/cursor-canvas/cursor-canvas'
import CommandPalette from '@components/command-palette/command-palette'
import { preloadContent } from '@hooks/content-cache'
import { Outlet } from 'react-router-dom'
import styles from './layout.module.css'

export default function Layout() {
    const [paletteOpen, setPaletteOpen] = useState(false)

    const openPalette = useCallback(() => setPaletteOpen(true), [])
    const closePalette = useCallback(() => setPaletteOpen(false), [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setPaletteOpen((prev) => !prev)
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        preloadContent()
    }, [])

    return (
        <>
            <CursorCanvas />
            {paletteOpen && (
                <CommandPalette open={paletteOpen} onClose={closePalette} />
            )}
            <div className={styles.layout}>
                <Navbar />
                <div className={styles.page}>
                    <Outlet />
                </div>
                <Footer onOpenPalette={openPalette} />
            </div>
        </>
    )
}
