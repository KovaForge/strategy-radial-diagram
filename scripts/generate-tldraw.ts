/**
 * Generates tldraw-compatible exports for the strategy radial diagram.
 * Run: npm run generate:tldraw
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Window } from 'happy-dom'
import {
	Editor,
	createShapeId,
	createTLStore,
	defaultAddFontsFromNode,
	defaultBindingUtils,
	defaultShapeTools,
	defaultShapeUtils,
	defaultTools,
	serializeTldrawJson,
	tipTapDefaultExtensions,
	toRichText,
} from 'tldraw'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

interface DiagramData {
	title: string
	subtitle: string
	center: { x: number; y: number }
	rings: Array<{ radius: number; color: string; label: string }>
	focusAreas: string[]
	goals: string[]
	ways: string[]
	layout: {
		focusRadius: number
		goalRadius: number
		wayRadius: number
		focusNode: NodeStyle
		goalNode: NodeStyle
		wayNode: NodeStyle
	}
}

interface NodeStyle {
	width: number
	height: number
	color: string
	fill: string
	labelColor: string
}

function setupDom() {
	const window = new Window({ url: 'http://localhost/' })
	const document = window.document
	Object.assign(globalThis, {
		window,
		document,
		HTMLElement: window.HTMLElement,
		Element: window.Element,
		Node: window.Node,
		getComputedStyle: window.getComputedStyle.bind(window),
		requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
		cancelAnimationFrame: (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
	})
}

function placeOnCircle(
	centerX: number,
	centerY: number,
	radius: number,
	count: number,
	index: number
) {
	const angle = (index / count) * Math.PI * 2 - Math.PI / 2
	return {
		x: centerX + radius * Math.cos(angle),
		y: centerY + radius * Math.sin(angle),
	}
}

function createEditor() {
	const container = document.createElement('div')
	document.body.appendChild(container)
	Object.defineProperty(container, 'getBoundingClientRect', {
		value: () => ({
			x: 0,
			y: 0,
			top: 0,
			left: 0,
			width: 1200,
			height: 1000,
			bottom: 1000,
			right: 1200,
			toJSON: () => ({}),
		}),
	})

	const shapeUtils = [...defaultShapeUtils]
	const bindingUtils = [...defaultBindingUtils]

	return new Editor({
		shapeUtils,
		bindingUtils,
		tools: [...defaultTools, ...defaultShapeTools],
		store: createTLStore({ shapeUtils, bindingUtils }),
		getContainer: () => container,
		options: {
			text: {
				addFontsFromNode: defaultAddFontsFromNode,
				tipTapConfig: {
					extensions: tipTapDefaultExtensions,
				},
			},
		},
	})
}

function buildDiagram(editor: Editor, data: DiagramData) {
	const { center } = data
	const shapeIds: ReturnType<typeof createShapeId>[] = []

	// Title block
	const titleId = createShapeId('title')
	editor.createShape({
		id: titleId,
		type: 'text',
		x: center.x - 280,
		y: center.y - 520,
		props: {
			richText: toRichText(data.title),
			color: 'green',
			size: 'xl',
			font: 'draw',
			w: 560,
			autoSize: false,
			textAlign: 'middle',
		},
	})
	shapeIds.push(titleId)

	const subtitleId = createShapeId('subtitle')
	editor.createShape({
		id: subtitleId,
		type: 'text',
		x: center.x - 220,
		y: center.y - 470,
		props: {
			richText: toRichText(data.subtitle),
			color: 'grey',
			size: 'l',
			font: 'draw',
			w: 440,
			autoSize: false,
			textAlign: 'middle',
		},
	})
	shapeIds.push(subtitleId)

	// Guide rings
	for (const [i, ring] of data.rings.entries()) {
		const id = createShapeId(`ring-${i}`)
		const diameter = ring.radius * 2
		editor.createShape({
			id,
			type: 'geo',
			x: center.x - ring.radius,
			y: center.y - ring.radius,
			props: {
				geo: 'ellipse',
				w: diameter,
				h: diameter,
				color: ring.color,
				fill: 'none',
				dash: 'dashed',
				size: 's',
				richText: toRichText(''),
			},
			opacity: 0.35,
		})
		shapeIds.push(id)
	}

	const addNodes = (
		items: string[],
		radius: number,
		style: NodeStyle,
		prefix: string
	) => {
		items.forEach((label, index) => {
			const point = placeOnCircle(center.x, center.y, radius, items.length, index)
			const id = createShapeId(`${prefix}-${index}`)
			editor.createShape({
				id,
				type: 'geo',
				x: point.x - style.width / 2,
				y: point.y - style.height / 2,
				props: {
					geo: 'rectangle',
					w: style.width,
					h: style.height,
					color: style.color,
					fill: style.fill,
					labelColor: style.labelColor,
					dash: 'draw',
					size: 'm',
					font: 'draw',
					align: 'middle',
					verticalAlign: 'middle',
					richText: toRichText(label),
				},
			})
			shapeIds.push(id)
		})
	}

	addNodes(data.focusAreas, data.layout.focusRadius, data.layout.focusNode, 'focus')
	addNodes(data.goals, data.layout.goalRadius, data.layout.goalNode, 'goal')
	addNodes(data.ways, data.layout.wayRadius, data.layout.wayNode, 'way')

	// Legend
	const legendId = createShapeId('legend')
	editor.createShape({
		id: legendId,
		type: 'geo',
		x: center.x - 180,
		y: center.y + 500,
		props: {
			geo: 'rectangle',
			w: 360,
			h: 110,
			color: 'grey',
			fill: 'semi',
			labelColor: 'black',
			dash: 'draw',
			size: 's',
			font: 'draw',
			align: 'start',
			verticalAlign: 'start',
			richText: toRichText(
				'How to Read This Diagram\nFocus Areas (Center) support → Goals (Middle Ring)\nGoals are achieved through → Ways of Working (Outer Ring)'
			),
		},
	})
	shapeIds.push(legendId)

	return shapeIds
}

async function main() {
	setupDom()

	const data = JSON.parse(
		readFileSync(join(root, 'data', 'diagram.json'), 'utf8')
	) as DiagramData

	const editor = createEditor()
	const shapeIds = buildDiagram(editor, data)

	const exportsDir = join(root, 'exports')
	mkdirSync(exportsDir, { recursive: true })

	const tldrPath = join(exportsDir, 'commercial-controls.tldr')
	const tldrJson = await serializeTldrawJson(editor)
	writeFileSync(tldrPath, tldrJson, 'utf8')

	const content = editor.getContentFromCurrentPage(shapeIds)
	const tlcontentPath = join(exportsDir, 'commercial-controls.tlcontent.json')
	writeFileSync(tlcontentPath, JSON.stringify(content, null, 2), 'utf8')

	editor.dispose()
	console.log(`Wrote ${tldrPath}`)
	console.log(`Wrote ${tlcontentPath}`)
	process.exit(0)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})
