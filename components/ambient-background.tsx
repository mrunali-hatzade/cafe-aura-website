"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  z: number
  size: number
  color: string
  speedX: number
  speedY: number
  speedZ: number
  opacity: number
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Particle settings
    const numParticles = 180
    const particles: Particle[] = []
    const focalLength = 300 // Perspective depth scale
    const maxZ = 600

    // Coffee theme color palette for particles (warm amber, gold, soft cream)
    const particleColors = [
      "rgba(217, 151, 85, ", // Gold/warm amber
      "rgba(196, 122, 69, ", // Cinnamon brown
      "rgba(255, 235, 204, ", // Soft cream
      "rgba(240, 185, 125, ", // Soft gold
    ]

    function createParticle(initZ = Math.random() * maxZ): Particle {
      return {
        // Position relative to screen center
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: initZ,
        size: Math.random() * 4.5 + 1.5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -Math.random() * 0.3 - 0.2, // Floating upwards slowly
        speedZ: -Math.random() * 0.4 - 0.15, // Moving towards the camera
        opacity: Math.random() * 0.55 + 0.3,
      }
    }

    // Initialize particles across different depths
    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle(Math.random() * maxZ))
    }

    // Event listener for mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coords around screen center between -1 and 1
      mouseRef.current.targetX = (e.clientX - width / 2) / (width / 2)
      mouseRef.current.targetY = (e.clientY - height / 2) / (height / 2)
    }

    // Event listener for resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth camera interpolation based on mouse
      const mouse = mouseRef.current
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Camera offset values
      const camOffsetX = mouse.x * 45
      const camOffsetY = mouse.y * 30

      // Sort particles by depth Z (draw back-to-front for proper 3D rendering)
      particles.sort((a, b) => b.z - a.z)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update particle positions
        p.x += p.speedX
        p.y += p.speedY
        p.z += p.speedZ

        // Reset particle if it moves behind camera (z <= 0) or goes off-screen
        if (p.z <= 0 || p.y < -height || Math.abs(p.x) > width * 3) {
          particles[i] = createParticle(maxZ)
          continue
        }

        // 3D perspective projection
        const scale = focalLength / (focalLength + p.z)
        const projX = (p.x - camOffsetX) * scale + width / 2
        const projY = (p.y - camOffsetY) * scale + height / 2
        const projSize = p.size * scale

        // Don't draw off-screen projected elements
        if (projX < 0 || projX > width || projY < 0 || projY > height) {
          continue
        }

        // Fade in based on distance, and fade out if too close to the camera
        const depthOpacityFactor = p.z > maxZ * 0.8 
          ? (maxZ - p.z) / (maxZ * 0.2) // Fade in at background
          : p.z < 100 
            ? p.z / 100 // Fade out close to camera
            : 1

        const currentOpacity = p.opacity * depthOpacityFactor

        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(projX, projY, projSize, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${currentOpacity})`
        ctx.shadowBlur = projSize * 3
        ctx.shadowColor = "rgba(217, 151, 85, 0.4)"
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow blur for performance
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
