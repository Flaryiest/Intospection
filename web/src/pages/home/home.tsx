import styles from './home.module.css';
import Navbar from "@components/navbar/navbar.tsx";
import Footer from "@components/footer/footer.tsx";
export function Home() {
    return <div className={styles.page}>
        <Navbar />
        <div className={styles.content}>
            <h1 className={styles.title}>Hi! I'm Eric.</h1>
            <h2 className={styles.subtitle}>17 y/o Chinese Canada living in Canada. Currently sidequesting and exploring the world, one step at a time. Most recently I have been working at a few startups, including Magic Hour (YC W24) and Hamming AI (YC S24).</h2>
            <div className={styles.introText}>More about me and my work can found be found here.</div>
            <div className={styles.sectionDivider}></div>
            <div className={styles.sectionTwo}>
                <h2 className={styles.sectionTwoTitle}>In order to be human: create</h2>
                <div className={styles.sectionTwoText}>
                    <p>In my free time, I enjoy writing and reading all types of works.</p>
                    <p>Will hopefully be sharing most of my writing here in the future, and would always love to get thoughts!</p>
                </div>  
            </div>
            <div className={styles.sectionDivider}></div>
        </div>
        <Footer />
    </div>
}