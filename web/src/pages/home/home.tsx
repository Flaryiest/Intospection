import { Link } from 'react-router-dom'
import styles from './home.module.css'

function Arrow() {
    return (
        <svg
            className={styles.arrow}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function Home() {
    return (
        <>
            <h1 className={styles.title}>Hi! I'm Eric.</h1>
            <p className={styles.subtitle}>
                17 y/o Chinese Canadian living in Canada. Currently
                sidequesting and exploring the world, one step at a time.
                Most recently I have been working at a few startups,
                including{' '}
                <a
                    href="https://magichour.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                >
                    Magic Hour
                    <Arrow />
                </a>{' '}
                <span className={styles.dim}>(YC W24)</span>.
            </p>
            <p className={styles.introText}>
                More about me and my work can be found in{' '}
                <Link to="/experiences" className={styles.pageLink}>
                    experiences
                    <Arrow />
                </Link>
                .
            </p>
            <div className={styles.sectionDivider}></div>
            <div className={styles.sectionTwo}>
                <h2 className={styles.sectionTwoTitle}>
                    In order to be human: <em>create</em>
                </h2>
                <div className={styles.sectionTwoText}>
                    <p>
                        In my free time, I enjoy{' '}
                        <Link to="/writing" className={styles.pageLink}>
                            writing
                            <Arrow />
                        </Link>{' '}
                        and reading all types of works. You can find what
                        I've been consuming in{' '}
                        <Link to="/artifacts" className={styles.pageLink}>
                            artifacts
                            <Arrow />
                        </Link>
                        .
                    </p>
                    <p>
                        Will hopefully be sharing most of my writing here
                        in the future, and would always love to get
                        thoughts!
                    </p>
                </div>
            </div>
            <div className={styles.sectionDivider}></div>
        </>
    )
}
