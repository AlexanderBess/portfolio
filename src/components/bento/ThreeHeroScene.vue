<template>
  <div ref="containerRef" class="pointer-events-none absolute inset-0" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

/**
 * Decorative 3D scene for the hero card: a slowly rotating wireframe
 * icosahedron with a particle shell and mouse parallax.
 *
 * Engineering notes:
 * - colors follow the active theme (reads CSS vars, reacts to [data-theme] flips)
 * - rAF pauses when the scene is offscreen (IntersectionObserver)
 * - respects prefers-reduced-motion (static frame, no idle spin)
 * - DPR capped at 2, full dispose on unmount
 */

interface Props {
  /** Horizontal offset of the object, in world units (shifts it off the text). */
  offsetX?: number
}

const props = withDefaults(defineProps<Props>(), { offsetX: 1.15 })

const containerRef = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let mesh: THREE.LineSegments | null = null
let points: THREE.Points | null = null
let wireMaterial: THREE.LineBasicMaterial | null = null
let pointsMaterial: THREE.PointsMaterial | null = null

let rafId = 0
let isVisible = true
let reducedMotion = false

const pointer = { x: 0, y: 0 }

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let themeObserver: MutationObserver | null = null

/** Resolve theme-dependent scene colors from the current data-theme. */
function sceneColors(): { wire: THREE.Color; dots: THREE.Color; wireOpacity: number } {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  return isDark
    ? { wire: new THREE.Color('#00f2fe'), dots: new THREE.Color('#3b82f6'), wireOpacity: 0.28 }
    : { wire: new THREE.Color('#2563eb'), dots: new THREE.Color('#0891b2'), wireOpacity: 0.22 }
}

function applyThemeColors(): void {
  if (!wireMaterial || !pointsMaterial) return
  const { wire, dots, wireOpacity } = sceneColors()
  wireMaterial.color = wire
  wireMaterial.opacity = wireOpacity
  pointsMaterial.color = dots
  renderOnce()
}

function renderOnce(): void {
  if (renderer && scene && camera) renderer.render(scene, camera)
}

function animate(): void {
  if (!mesh || !points) return

  // Idle spin + eased mouse parallax
  mesh.rotation.y += 0.0022
  mesh.rotation.x += 0.0009
  mesh.rotation.y += (pointer.x * 0.35 - mesh.rotation.y * 0.02) * 0.02
  mesh.rotation.x += (pointer.y * 0.25 - mesh.rotation.x * 0.02) * 0.02
  points.rotation.copy(mesh.rotation)

  renderOnce()
  rafId = requestAnimationFrame(animate)
}

function startLoop(): void {
  cancelAnimationFrame(rafId)
  if (isVisible && !reducedMotion) rafId = requestAnimationFrame(animate)
}

function onPointerMove(event: MouseEvent): void {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { width, height } = container.getBoundingClientRect()

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50)
  camera.position.z = 5

  const geometry = new THREE.IcosahedronGeometry(1.5, 1)
  const { wire, dots, wireOpacity } = sceneColors()

  wireMaterial = new THREE.LineBasicMaterial({ color: wire, transparent: true, opacity: wireOpacity })
  mesh = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMaterial)
  mesh.position.x = props.offsetX

  pointsMaterial = new THREE.PointsMaterial({
    color: dots,
    size: 0.045,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  })
  points = new THREE.Points(geometry, pointsMaterial)
  points.position.x = props.offsetX

  scene.add(mesh, points)

  // Keep canvas in sync with the card size
  resizeObserver = new ResizeObserver(([entry]) => {
    if (!renderer || !camera) return
    const { width: w, height: h } = entry.contentRect
    if (w === 0 || h === 0) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderOnce()
  })
  resizeObserver.observe(container)

  // Don't burn frames while offscreen
  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting
    isVisible ? startLoop() : cancelAnimationFrame(rafId)
  })
  intersectionObserver.observe(container)

  // React to theme switches
  themeObserver = new MutationObserver(applyThemeColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  window.addEventListener('mousemove', onPointerMove, { passive: true })

  renderOnce()
  startLoop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', onPointerMove)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  themeObserver?.disconnect()

  mesh?.geometry.dispose()
  points?.geometry.dispose()
  wireMaterial?.dispose()
  pointsMaterial?.dispose()
  renderer?.dispose()
  renderer?.domElement.remove()

  renderer = scene = camera = mesh = points = wireMaterial = pointsMaterial = null
})
</script>
