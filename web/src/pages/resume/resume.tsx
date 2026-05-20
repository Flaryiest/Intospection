import { useEffect } from 'react'

export default function Resume() {
    useEffect(() => {
        window.location.replace('/Eric_Zuo_Resume.pdf')
    }, [])
    return null
}
