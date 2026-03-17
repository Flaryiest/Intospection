import styles from './score-ring.module.css'

interface ScoreRingProps {
    value: number
    color: 'green' | 'blue'
    label: string
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreRing({ value, color, label }: ScoreRingProps) {
    const offset = CIRCUMFERENCE * (1 - value / 10)

    return (
        <div className={styles.container}>
            <svg className={styles.ring} viewBox="0 0 40 40">
                <circle
                    className={styles.track}
                    cx="20"
                    cy="20"
                    r={RADIUS}
                />
                <circle
                    className={`${styles.value} ${color === 'green' ? styles.green : styles.blue}`}
                    cx="20"
                    cy="20"
                    r={RADIUS}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                />
                <text
                    className={styles.number}
                    x="20"
                    y="20"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="rotate(90, 20, 20)"
                >
                    {value}
                </text>
            </svg>
            <span className={styles.label}>{label}</span>
        </div>
    )
}
