import styles from './navbar.module.css'
import { Link } from 'react-router-dom'
export default function Navbar() {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                Eric Zuo
            </Link>
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
    )
}
