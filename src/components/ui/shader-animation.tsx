"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<{
        camera: THREE.Camera
        scene: THREE.Scene
        renderer: THREE.WebGLRenderer
        uniforms: any
        animationId: number
    } | null>(null)
    const isAnimatingRef = useRef<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // Vertex shader
        const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

        // Fragment shader
        const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.001;

        vec3 color = vec3(1.0); // Start with white/light background
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            float pattern = lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            color[j] -= pattern * 0.3;
          }
        }
        color = clamp(color, 0.7, 1.0);
        gl_FragColor = vec4(color, 0.8);
      }
    `

        // Initialize Three.js scene
        const camera = new THREE.Camera()
        camera.position.z = 1

        const scene = new THREE.Scene()
        const geometry = new THREE.PlaneGeometry(2, 2)

        const uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() },
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        // Cap pixel ratio for perf, especially on high-DPI
        const devicePR = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
        const cappedPR = Math.min(devicePR, 1.75)
        renderer.setPixelRatio(cappedPR)

        container.appendChild(renderer.domElement)

        // Handle window resize
        const onWindowResize = () => {
            const width = container.clientWidth
            const height = container.clientHeight
            renderer.setSize(width, height)
            uniforms.resolution.value.x = renderer.domElement.width
            uniforms.resolution.value.y = renderer.domElement.height
        }

        // Initial resize
        onWindowResize()
        window.addEventListener("resize", onWindowResize, false)

        // Animation loop
        const animate = () => {
            if (!isAnimatingRef.current) return
            const animationId = requestAnimationFrame(animate)
            uniforms.time.value += 0.05
            renderer.render(scene, camera)

            if (sceneRef.current) {
                sceneRef.current.animationId = animationId
            }
        }

        // Start/stop helpers
        const start = () => {
            if (!isAnimatingRef.current) {
                isAnimatingRef.current = true
                animate()
            }
        }
        const stop = () => {
            isAnimatingRef.current = false
            if (sceneRef.current?.animationId) cancelAnimationFrame(sceneRef.current.animationId)
        }

        // Visibility handling
        const onVisibilityChange = () => {
            if (document.hidden) {
                stop()
            } else if (isVisible) {
                start()
            }
        }
        document.addEventListener("visibilitychange", onVisibilityChange)

        // IntersectionObserver to pause offscreen
        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                setIsVisible(entry.isIntersecting)
                if (entry.isIntersecting && !document.hidden) {
                    start()
                } else {
                    stop()
                }
            },
            { threshold: 0.05 }
        )
        io.observe(container)

        // Store scene references for cleanup
        sceneRef.current = {
            camera,
            scene,
            renderer,
            uniforms,
            animationId: 0,
        }

        // Start animation
        start()

        // Cleanup function
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange)
            io.disconnect()
            window.removeEventListener("resize", onWindowResize)

            if (sceneRef.current) {
                stop()

                if (container && sceneRef.current.renderer.domElement) {
                    container.removeChild(sceneRef.current.renderer.domElement)
                }

                sceneRef.current.renderer.dispose()
                geometry.dispose()
                material.dispose()
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{
                background: "transparent",
                overflow: "hidden",
            }}
            data-allow-motion
        />
    )
}
