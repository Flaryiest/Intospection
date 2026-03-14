import styles from "./navbar.module.css"
import { Link } from "react-router-dom"
export default function Navbar() {
    return <header className={styles.header}>
        <h3 className={styles.logo}>Eric Zuo</h3>
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/experiences">Experiences</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/writing">Writing</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/artifacts">Artifacts</Link>
                </li>
            </ul>
        </nav>
    </header>
}