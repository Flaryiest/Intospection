import { useState, useEffect, useCallback } from 'react'
import styles from './footer.module.css'

const THEMES = ['light', 'dark', 'matcha'] as const
type Theme = (typeof THEMES)[number]

function getStoredTheme(): Theme {
    const stored = localStorage.getItem('theme')
    if (stored && THEMES.includes(stored as Theme)) return stored as Theme
    return 'light'
}

export default function Footer() {
    const [theme, setTheme] = useState<Theme>(getStoredTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const cycleTheme = useCallback(() => {
        setTheme((prev) => {
            const i = THEMES.indexOf(prev)
            return THEMES[(i + 1) % THEMES.length]
        })
    }, [])

    return (
        <div className={styles.container}>
            <footer className={styles.footer}>
                <ul className={styles.list}>
                    <a
                        className={styles.link}
                        href="mailto:ericmzuo1@gmail.com"
                    >
                        Email
                    </a>
                    <a
                        className={styles.link}
                        href="https://www.linkedin.com/in/ericzuo8/"
                    >
                        LinkedIn
                    </a>
                    <a
                        className={styles.link}
                        href="https://github.com/Flaryiest"
                    >
                        GitHub
                    </a>
                    <a
                        className={styles.link}
                        href="https://x.com/ZuoEric8"
                    >
                        X
                    </a>
                </ul>
                <div className={styles.divider}></div>
                <div className={styles.commands}>
                    <button
                        className={styles.modeButton}
                        onClick={cycleTheme}
                    >
                        <span className={styles.themeLabel}>Theme: </span>
                        <span className={styles.themeName}>{theme}</span>
                    </button>

                    <div className={styles.divider}></div>

                    <div
                        className={`${styles.searchButton} ${styles.link}`}
                    >
                        %/ctrl + k
                    </div>
                </div>
            </footer>
        </div>
    )
}
