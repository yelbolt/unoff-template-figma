import { darkColor, propertyFontFamily } from './styles'

// ── Color helpers ─────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  return [h * 360, s, l]
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const hNorm = h / 360
  let r: number, g: number, b: number

  if (s === 0) 
    r = g = b = l
   else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      let tVal = t
      if (tVal < 0) tVal += 1
      if (tVal > 1) tVal -= 1
      if (tVal < 1 / 6) return p + (q - p) * 6 * tVal
      if (tVal < 1 / 2) return q
      if (tVal < 2 / 3) return p + (q - p) * (2 / 3 - tVal) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, hNorm + 1 / 3)
    g = hue2rgb(p, q, hNorm)
    b = hue2rgb(p, q, hNorm - 1 / 3)
  }
  return { r, g, b }
}

// ── Shade scale ───────────────────────────────────────────────────────────────

const SHADES: Array<{ stop: number; lightness: number }> = [
  { stop: 50, lightness: 0.96 },
  { stop: 100, lightness: 0.91 },
  { stop: 200, lightness: 0.82 },
  { stop: 300, lightness: 0.73 },
  { stop: 400, lightness: 0.60 },
  { stop: 500, lightness: 0.49 },
  { stop: 600, lightness: 0.38 },
  { stop: 700, lightness: 0.29 },
  { stop: 800, lightness: 0.20 },
  { stop: 900, lightness: 0.12 },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default class ColorPalette {
  node: FrameNode

  constructor({ baseColor }: { baseColor: string }) {
    this.node = this.makeNode(baseColor)
  }

  private makeNode(baseColor: string): FrameNode {
    const [h, s] = hexToHsl(baseColor)

    const container = figma.createFrame()
    container.name = `Palette — ${baseColor.toUpperCase()}`
    container.fills = [
      { type: 'SOLID', opacity: 0.5, color: { r: 1, g: 1, b: 1 } },
    ]
    container.strokes = [{ type: 'SOLID', opacity: 0.05, color: darkColor }]
    container.strokeAlign = 'INSIDE'
    container.cornerRadius = 12
    container.layoutMode = 'HORIZONTAL'
    container.layoutSizingHorizontal = 'HUG'
    container.layoutSizingVertical = 'HUG'
    container.paddingTop = 12
    container.paddingLeft = 12
    container.paddingBottom = 12
    container.paddingRight = 12
    container.itemSpacing = 4

    SHADES.forEach(({ stop, lightness }) => {
      const rgb = hslToRgb(h, s, lightness)
      container.appendChild(this.makeChip(stop, rgb))
    })

    return container
  }

  private makeChip(
    stop: number,
    rgb: { r: number; g: number; b: number }
  ): FrameNode {
    const chip = figma.createFrame()
    chip.name = `_${stop}`
    chip.fills = []
    chip.layoutMode = 'VERTICAL'
    chip.layoutSizingHorizontal = 'HUG'
    chip.layoutSizingVertical = 'HUG'
    chip.counterAxisAlignItems = 'CENTER'
    chip.itemSpacing = 6

    // Swatch
    const swatch = figma.createFrame()
    swatch.name = '_swatch'
    swatch.resize(56, 40)
    swatch.fills = [{ type: 'SOLID', color: rgb }]
    swatch.cornerRadius = 8
    swatch.strokes = [{ type: 'SOLID', opacity: 0.05, color: darkColor }]
    swatch.strokeAlign = 'INSIDE'

    // Stop label
    const stopLabel = figma.createText()
    stopLabel.name = '_stop'
    stopLabel.characters = String(stop)
    stopLabel.fontName = { family: propertyFontFamily, style: 'Medium' }
    stopLabel.fontSize = 8
    stopLabel.fills = [{ type: 'SOLID', opacity: 0.5, color: darkColor }]
    stopLabel.textAlignHorizontal = 'CENTER'

    chip.appendChild(swatch)
    chip.appendChild(stopLabel)

    return chip
  }
}
