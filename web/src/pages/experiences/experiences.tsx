import styles from './experiences.module.css'

export default function Experiences() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Experiences</h1>
                <p className={styles.subtitle}>
                    A running log of things I've done, am doing, and hope
                    to do. Roughly in order of recency.
                </p>
            </div>

            <div className={styles.columns}>
                <div className={styles.main}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Work</h2>

                        <div className={styles.entry}>
                            <div className={styles.entryHeader}>
                                <h3 className={styles.entryTitle}>
                                    <a
                                        href="https://magichour.ai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        Magic Hour
                                    </a>
                                </h3>
                                <span className={styles.entryMeta}>
                                    YC W24
                                </span>
                            </div>
                            <p className={styles.entryDesc}>
                                AI video generation platform. Helped build
                                things that make pixels move in ways they
                                probably shouldn't.
                            </p>
                        </div>

                        <div className={styles.entry}>
                            <div className={styles.entryHeader}>
                                <h3 className={styles.entryTitle}>
                                    <a
                                        href="https://heartline.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        Heartline
                                    </a>
                                </h3>
                                <span className={styles.entryMeta}>
                                    Intern
                                </span>
                            </div>
                            <p className={styles.entryDesc}>
                                AI-powered mental health app. Worked on the
                                intervention pipeline and helped redesign
                                the interface with the design team. React
                                Native and Golang.
                            </p>
                        </div>

                        <div className={styles.entry}>
                            <div className={styles.entryHeader}>
                                <h3 className={styles.entryTitle}>
                                    <a
                                        href="https://hamming.ai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.link}
                                    >
                                        Hamming AI
                                    </a>
                                </h3>
                                <span className={styles.entryMeta}>
                                    YC S24
                                </span>
                            </div>
                            <p className={styles.entryDesc}>
                                AI testing infrastructure. Worked on
                                making sure AI agents do what they're
                                supposed to. Turns out that's harder than
                                it sounds.
                            </p>
                        </div>
                    </section>

                    <div className={styles.divider}></div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Learning</h2>

                        <div className={styles.entry}>
                            <div className={styles.entryHeader}>
                                <h3 className={styles.entryTitle}>
                                    Linear Algebra
                                </h3>
                                <span className={styles.entryMeta}>
                                    currently
                                </span>
                            </div>
                            <p className={styles.entryDesc}>
                                Studying the language that makes
                                everything from graphics to machine
                                learning actually work. Eigenvalues are
                                growing on me.
                            </p>
                        </div>

                        <div className={styles.entry}>
                            <div className={styles.entryHeader}>
                                <h3 className={styles.entryTitle}>
                                    Research
                                </h3>
                                <span className={styles.entryMeta}>
                                    exploring
                                </span>
                            </div>
                            <p className={styles.entryDesc}>
                                Looking into research opportunities.
                                Still figuring out the exact direction,
                                but the pull toward understanding things
                                deeply is hard to ignore.
                            </p>
                        </div>
                    </section>

                    <div className={styles.divider}></div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Someday</h2>

                        <div className={styles.entry}>
                            <p className={styles.entryDesc}>
                                Travel the world. Become a great person,
                                or at least an interesting one. The
                                details are deliberately left vague.
                            </p>
                        </div>
                    </section>

                    <div className={styles.divider}></div>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Log</h2>
                        <p className={styles.logSubtitle}>
                            Small but unique parts of my life.
                        </p>

                        <div className={styles.log}>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Hack The Change 2024
                                </span>
                                <span className={styles.logNote}>
                                    1st Place Winner. Won $5,000
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    MiniMedi Hacks 2024
                                </span>
                                <span className={styles.logNote}>
                                    1st Place Winner. 300 participants
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Undercity Hackathon
                                </span>
                                <span className={styles.logNote}>
                                    Flown out to SF for a hackathon
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    GenTalks
                                </span>
                                <span className={styles.logNote}>
                                    Web Developer
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Calgary Science Spelling Challenge
                                </span>
                                <span className={styles.logNote}>
                                    IT Director
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Elvaria Music Foundation
                                </span>
                                <span className={styles.logNote}>
                                    IT Director
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Honours with Distinction
                                </span>
                                <span className={styles.logNote}>
                                    Every semester, every year
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Vex Robotics
                                </span>
                                <span className={styles.logNote}>
                                    3388A
                                </span>
                            </div>
                            <div className={styles.logItem}>
                                <span className={styles.logTitle}>
                                    Ascend
                                </span>
                                <span className={styles.logNote}>
                                    Catch me building on Saturdays
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className={styles.aside}>
                    <div className={styles.asideCard}>
                        <h3 className={styles.asideLabel}>Now</h3>
                        <ul className={styles.asideList}>
                            <li>Studying linear algebra</li>
                            <li>Exploring research directions</li>
                            <li>Building this site</li>
                        </ul>
                    </div>

                    <div className={styles.asideCard}>
                        <h3 className={styles.asideLabel}>Interests</h3>
                        <ul className={styles.asideList}>
                            <li>AI and agents</li>
                            <li>Systems programming</li>
                            <li>Writing</li>
                            <li>Reading everything</li>
                        </ul>
                    </div>

                    <div className={styles.asideCard}>
                        <h3 className={styles.asideLabel}>Values</h3>
                        <p className={styles.asideText}>
                            Build things that matter. Learn in public.
                            Stay curious. Don't take yourself too
                            seriously.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
