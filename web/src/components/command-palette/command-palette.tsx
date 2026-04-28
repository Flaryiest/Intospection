import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './command-palette.module.css'

const PAGES = [
    { label: 'Home', path: '/', icon: '~' },
    { label: 'Experiences', path: '/experiences', icon: '>' },
    { label: 'Writing', path: '/writing', icon: '#' },
    { label: 'Artifacts', path: '/artifacts', icon: '*' },
]

interface CommandPaletteProps {
    open: boolean
    onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const [active, setActive] = useState(0)
    const navigate = useNavigate()
    const overlayRef = useRef<HTMLDivElement>(null)

    const go = useCallback(
        (index: number) => {
            navigate(PAGES[index].path)
            onClose()
        },
        [navigate, onClose]
    )

    useEffect(() => {
        if (!open) return

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((p) => (p + 1) % PAGES.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((p) => (p - 1 + PAGES.length) % PAGES.length)
            } else if (e.key === 'Enter') {
                e.preventDefault()
                go(active)
            }
        }

        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [open, active, go, onClose])

    if (!open) return null

    return (
        <div
            ref={overlayRef}
            className={styles.overlay}
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose()
            }}
        >
            <div className={styles.palette}>
                <div className={styles.header}>
                    <span className={styles.title}>Navigate to</span>
                </div>
                <div className={styles.items}>
                    {PAGES.map((page, i) => (
                        <div
                            key={page.path}
                            className={`${styles.item}${i === active ? ` ${styles.itemActive}` : ''}`}
                            onClick={() => go(i)}
                            onMouseEnter={() => setActive(i)}
                        >
                            <span className={styles.itemLabel}>
                                <span className={styles.itemIcon}>
                                    {page.icon}
                                </span>
                                {page.label}
                            </span>
                            {i === active && (
                                <span className={styles.itemHint}>
                                    /
                                    {page.path === '/'
                                        ? ''
                                        : page.path.slice(1)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.footer}>
                    <span className={styles.hint}>
                        <span className={styles.kbd}>↑</span>
                        <span className={styles.kbd}>↓</span> navigate
                    </span>
                    <span className={styles.hint}>
                        <span className={styles.kbd}>↵</span> select
                    </span>
                    <span className={styles.hint}>
                        <span className={styles.kbd}>esc</span> close
                    </span>
                </div>
            </div>
        </div>
    )
}
