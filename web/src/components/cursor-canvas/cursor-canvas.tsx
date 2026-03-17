import { useRef, useEffect } from 'react'
import styles from './cursor-canvas.module.css'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    baseOpacity: number
    bleed: number // expansion rate, like ink spreading
}

// Simple pseudo-noise using sine
function noise(x: number, y: number): number {
    return (
        Math.sin(x * 0.7 + y * 1.3) * 0.5 +
        Math.sin(x * 1.1 - y * 0.9) * 0.3 +
        Math.sin(x * 0.3 + y * 2.1) * 0.2
    )
}

export default function CursorCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const particles: Particle[] = []
        let animId = 0
        let lastMouseX = 0
        let lastMouseY = 0
        let time = 0

        function resize() {
            const dpr = window.devicePixelRatio || 1
            canvas!.width = window.innerWidth * dpr
            canvas!.height = window.innerHeight * dpr
            ctx!.scale(dpr, dpr)
        }

        resize()

        const onResize = () => resize()
        window.addEventListener('resize', onResize)

        const onMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX
            const mouseY = e.clientY

            const dx = mouseX - lastMouseX
            const dy = mouseY - lastMouseY
            const speed = Math.sqrt(dx * dx + dy * dy)

            const count = Math.min(Math.floor(speed * 0.25) + 1, 4)

            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2
                const v = 0.15 + Math.random() * 0.5
                const isBlob = Math.random() < 0.15 // 15% chance of a larger ink blob

                particles.push({
                    x: mouseX + (Math.random() - 0.5) * 3,
                    y: mouseY + (Math.random() - 0.5) * 3,
                    vx: Math.cos(angle) * v * 0.6,
                    vy: Math.sin(angle) * v * 0.6,
                    life: 1,
                    maxLife: 150 + Math.random() * 90,
                    size: isBlob
                        ? 4 + Math.random() * 5
                        : 1.5 + Math.random() * 3,
                    baseOpacity: isBlob
                        ? 0.18 + Math.random() * 0.08
                        : 0.25 + Math.random() * 0.12,
                    bleed: isBlob ? 0.008 + Math.random() * 0.01 : 0,
                })
            }

            lastMouseX = mouseX
            lastMouseY = mouseY
        }

        window.addEventListener('mousemove', onMouseMove)

        function animate() {
            time += 0.01
            const inkColor =
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--ink-color')
                    .trim() || '20, 20, 20'

            ctx!.clearRect(
                0,
                0,
                canvas!.width / (window.devicePixelRatio || 1),
                canvas!.height / (window.devicePixelRatio || 1)
            )

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]

                p.life -= 1 / p.maxLife

                if (p.life <= 0) {
                    particles.splice(i, 1)
                    continue
                }

                // Noise-based drift
                const n = noise(p.x * 0.008 + time, p.y * 0.008 + time)
                p.vx += n * 0.015
                p.vy += Math.cos(n * 3) * 0.015

                p.vx *= 0.985
                p.vy *= 0.985

                p.x += p.vx
                p.y += p.vy

                // Ink bleed: blobs grow slightly
                p.size += p.bleed

                // Fade curve: hold opacity longer, then drop off
                const fadeCurve =
                    p.life > 0.3 ? 1 : p.life / 0.3
                const opacity = p.baseOpacity * fadeCurve

                // Draw with soft edge using radial gradient
                const radius = p.size * (0.7 + p.life * 0.3)

                if (radius > 0.5) {
                    const grad = ctx!.createRadialGradient(
                        p.x,
                        p.y,
                        0,
                        p.x,
                        p.y,
                        radius
                    )
                    grad.addColorStop(
                        0,
                        `rgba(${inkColor}, ${opacity})`
                    )
                    grad.addColorStop(
                        0.6,
                        `rgba(${inkColor}, ${opacity * 0.5})`
                    )
                    grad.addColorStop(1, `rgba(${inkColor}, 0)`)

                    ctx!.beginPath()
                    ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2)
                    ctx!.fillStyle = grad
                    ctx!.fill()
                }
            }

            if (particles.length > 400) {
                particles.splice(0, particles.length - 400)
            }

            animId = requestAnimationFrame(animate)
        }

        animId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, [])

    return <canvas ref={canvasRef} className={styles.canvas} />
}
