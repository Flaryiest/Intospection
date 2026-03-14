import Navbar from '@components/navbar/navbar'
import Footer from '@components/footer/footer'
import { Outlet } from 'react-router-dom'
import styles from './layout.module.css'

export default function Layout() {
    return (
        <div className={styles.layout}>
            <Navbar />
            <div className={styles.page}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}
