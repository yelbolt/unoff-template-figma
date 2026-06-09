import { bodyFontFamily, darkColor } from './styles'

export default class TodoChecklist {
  node: FrameNode

  constructor({ items }: { items: string[] }) {
    this.node = this.makeNode(items)
  }

  private makeNode(items: string[]): FrameNode {
    const container = figma.createFrame()
    container.name = 'To-do checklist'
    container.fills = [
      { type: 'SOLID', opacity: 0.5, color: { r: 1, g: 1, b: 1 } },
    ]
    container.strokes = [{ type: 'SOLID', opacity: 0.05, color: darkColor }]
    container.strokeAlign = 'INSIDE'
    container.cornerRadius = 12
    container.layoutMode = 'VERTICAL'
    container.layoutSizingHorizontal = 'FIXED'
    container.resize(240, 10)
    container.layoutSizingVertical = 'HUG'
    container.paddingTop = 12
    container.paddingLeft = 12
    container.paddingBottom = 12
    container.paddingRight = 12
    container.itemSpacing = 8

    items.forEach((text) => container.appendChild(this.makeRow(text)))

    return container
  }

  private makeRow(text: string): FrameNode {
    const row = figma.createFrame()
    row.name = '_row'
    row.fills = []
    row.layoutMode = 'HORIZONTAL'
    row.primaryAxisSizingMode = 'FIXED'
    row.layoutAlign = 'STRETCH'
    row.layoutSizingVertical = 'HUG'
    row.counterAxisAlignItems = 'CENTER'
    row.itemSpacing = 8

    // Bullet
    const bullet = figma.createEllipse()
    bullet.name = '_bullet'
    bullet.resize(8, 8)
    bullet.fills = [{ type: 'SOLID', opacity: 0.2, color: darkColor }]

    // Label
    const label = figma.createText()
    label.name = '_label'
    label.characters = text
    label.fontName = { family: bodyFontFamily, style: 'Medium' }
    label.fontSize = 12
    label.setRangeLineHeight(0, text.length, { value: 130, unit: 'PERCENT' })
    label.fills = [{ type: 'SOLID', color: darkColor }]
    label.layoutGrow = 1

    row.appendChild(bullet)
    row.appendChild(label)

    return row
  }
}
