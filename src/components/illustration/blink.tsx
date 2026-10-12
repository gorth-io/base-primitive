"use client"

import * as React from "react"

import { cn } from "cn"

interface MousePosition {
  x: number
  y: number
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = React.useState<MousePosition>({
    x: 0,
    y: 0,
  })

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return mousePosition
}

interface BlinkingParticlesProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
  blinkSpeed?: number
  minOpacity?: number
  edgeBias?: number
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255

  return [red, green, blue]
}

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  homeX: number
  homeY: number
  magnetism: number
  blinkSpeed: number
  blinkOffset: number
}

export const BlinkingParticles: React.FC<BlinkingParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  blinkSpeed = 1,
  minOpacity = 0.2,
  edgeBias = 0,
  ...props
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = React.useRef<HTMLDivElement>(null)
  const context = React.useRef<CanvasRenderingContext2D | null>(null)
  const circles = React.useRef<Circle[]>([])
  const mousePosition = useMousePosition()
  const mouse = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = React.useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rafID = React.useRef<number | null>(null)
  const resizeTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const startTime = React.useRef<number | null>(null)
  const cellQueue = React.useRef<{ x: number; y: number }[]>([])

  const initCanvas = () => {
    resizeCanvas()
    startTime.current = null
  }

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2

      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight

      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)

      // Clear existing particles and create new ones with exact quantity
      circles.current = []
      cellQueue.current = []

      for (let i = 0; i < quantity; i++) {
        const circle = circleParams()

        drawCircle(circle)
      }
    }
  }

  // Random placement has no memory of where earlier particles landed, so it reliably throws
  // several into the same small area (real clumps, not just visual noise) while leaving other
  // spots empty. A jittered grid guarantees even spacing instead: the container is divided into
  // roughly `quantity` cells, at most one particle spawns per cell, and a small random jitter
  // inside each cell keeps the result looking organic rather than a rigid dot matrix. Every
  // cell always gets a chance at a particle — edgeBias only nudges each particle's position
  // outward within its own cell, it never removes cells, so no region (including right next to
  // the ring) is ever left completely empty.
  const CELL_JITTER_RATIO = 0.8
  const EDGE_PULL_RATIO = 0.35

  const buildCellQueue = (): { x: number; y: number }[] => {
    const { w, h } = canvasSize.current

    if (w <= 0 || h <= 0) {
      return [{ x: 0, y: 0 }]
    }

    const cols = Math.max(1, Math.round(Math.sqrt(quantity * (w / h))))
    const rows = Math.max(1, Math.ceil(quantity / cols))
    const cellW = w / cols
    const cellH = h / rows
    const centerX = w / 2
    const centerY = h / 2

    const cells: { col: number; row: number }[] = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.push({ col, row })
      }
    }

    // Unbiased shuffle so, when the grid has a few more cells than particles, which ones get
    // dropped is random rather than always the same corner
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

        ;[cells[i], cells[j]] = [cells[j], cells[i]]
    }

    return cells.slice(0, quantity).map(({ col, row }) => {
      const cellCenterX = col * cellW + cellW / 2
      const cellCenterY = row * cellH + cellH / 2

      const dirX = cellCenterX - centerX
      const dirY = cellCenterY - centerY
      const dirLength = Math.sqrt(dirX ** 2 + dirY ** 2) || 1
      const outwardX = dirX / dirLength
      const outwardY = dirY / dirLength

      const jitterX = (Math.random() - 0.5) * cellW * CELL_JITTER_RATIO
      const jitterY = (Math.random() - 0.5) * cellH * CELL_JITTER_RATIO
      const pullX = outwardX * edgeBias * cellW * EDGE_PULL_RATIO
      const pullY = outwardY * edgeBias * cellH * EDGE_PULL_RATIO

      return {
        x: cellCenterX + jitterX + pullX,
        y: cellCenterY + jitterY + pullY,
      }
    })
  }

  const getGridSlot = () => {
    if (cellQueue.current.length === 0) {
      cellQueue.current = buildCellQueue()
    }

    return (
      cellQueue.current.pop() ?? {
        x: canvasSize.current.w / 2,
        y: canvasSize.current.h / 2,
      }
    )
  }

  const circleParams = (): Circle => {
    const gridSlot = getGridSlot()
    const x = Math.floor(gridSlot.x)
    const y = Math.floor(gridSlot.y)
    const translateX = 0
    const translateY = 0

    // Continuous range instead of the old two-step (size / size+1) split, so sizes vary
    // smoothly across the field rather than jumping between two fixed values
    const pSize = size + Math.random() * size
    const alpha = 0
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1))
    const magnetism = 0.1 + Math.random() * 4

    // Randomized per particle so the whole field doesn't pulse in unison
    const particleBlinkSpeed = (0.0008 + Math.random() * 0.001) * blinkSpeed
    const blinkOffset = Math.random() * Math.PI * 2

    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,

      // The grid slot is "home" — the particle wanders a couple of px around it (see
      // animate()) instead of drifting off in a straight line, so the even spacing holds up
      // for as long as the field is on screen instead of only at the moment it spawns
      homeX: x,
      homeY: y,
      magnetism,
      blinkSpeed: particleBlinkSpeed,
      blinkOffset,
    }
  }

  const rgb = hexToRgb(color)

  const drawCircle = (circle: Circle, update = false, renderAlpha?: number) => {
    if (context.current) {
      const { x, y, translateX, translateY, size } = circle
      const alpha = renderAlpha ?? circle.alpha

      context.current.translate(translateX, translateY)
      context.current.beginPath()
      context.current.arc(x, y, size, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
      context.current.fill()
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) {
        circles.current.push(circle)
      }
    }
  }

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      )
    }
  }

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2

    return remapped > 0 ? remapped : 0
  }

  const animate = (timestamp: number) => {
    if (startTime.current === null) {
      startTime.current = timestamp
    }

    const elapsed = timestamp - startTime.current

    clearContext()
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ]

      const closestEdge = edge.reduce((a, b) => Math.min(a, b))

      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      )

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02

        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge
      }

      // vx/vy pan the whole field by moving home itself, rather than the particle directly —
      // the spring pull below keeps each particle orbiting its (possibly moving) home instead
      // of wandering away and re-clustering with its neighbors over time
      circle.homeX += vx
      circle.homeY += vy
      circle.x +=
        (circle.homeX - circle.x) * 0.02 + (Math.random() - 0.5) * 0.25
      circle.y +=
        (circle.homeY - circle.y) * 0.02 + (Math.random() - 0.5) * 0.25
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease

      const blink =
        minOpacity +
        (1 - minOpacity) *
        ((Math.sin(elapsed * circle.blinkSpeed + circle.blinkOffset) + 1) / 2)

      drawCircle(circle, true, circle.alpha * blink)

      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1)

        // create a new circle
        const newCircle = circleParams()

        drawCircle(newCircle)
      }
    })
    rafID.current = window.requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }

    initCanvas()
    rafID.current = window.requestAnimationFrame(animate)

    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }

      resizeTimeout.current = setTimeout(() => {
        initCanvas()
      }, 200)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current)
      }

      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }

      window.removeEventListener("resize", handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    color,
    quantity,
    staticity,
    ease,
    size,
    vx,
    vy,
    blinkSpeed,
    minOpacity,
    edgeBias,
    dpr,
  ])

  React.useEffect(() => {
    onMouseMove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition.x, mousePosition.y])

  React.useEffect(() => {
    initCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        className
      )}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
