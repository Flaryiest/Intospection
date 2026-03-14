import styles from "./footer.module.css"
export default function Footer() {
    return <div className={styles.container}>
        <footer className={styles.footer}>
            <ul className={styles.list}>
               <a className={styles.link} href="mailto:ericmzuo1@gmail.com">Email</a>  
               <a className={styles.link} href="https://www.linkedin.com/in/ericzuo8/">LinkedIn</a>
               <a className={styles.link} href="https://github.com/Flaryiest">GitHub</a>
               <a className={styles.link} href="https://x.com/ZuoEric8">X</a>
               <div className={styles.divider}></div>
               <button className={styles.modeButton}>
                Appearance:
               </button>
               <div className={`${styles.divider}`}></div>
               <div className={`${styles.searchButton} ${styles.link}`}>
                    %/ctrl + k
               </div>
            </ul>
        </footer>
    </div>
}