import styles from './home.module.css';
import Navbar from "@components/navbar/navbar.tsx";
export function Home() {
    return <div className={styles.page}>
        <Navbar />
        <h1>Home</h1>
    </div>
}