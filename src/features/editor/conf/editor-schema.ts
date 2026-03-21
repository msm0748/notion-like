import {
  BlockNoteSchema,
  createBlockSpec,
  createExtension,
  createHeadingBlockConfig,
  createToggleWrapper,
  defaultBlockSpecs,
  addDefaultPropsExternalHTML,
  parseDefaultProps,
} from '@blocknote/core'
import type { HeadingOptions } from '@blocknote/core'

const HEADING_LEVELS = [1, 2, 3] as const

/**
 * 에디터 내 heading: 블록 레벨 1 → h2, 2 → h3, ... 6 → h6 (타이틀은 페이지에서 h1으로 별도 표시)
 */
function getRenderedHeadingLevel(blockLevel: number): number {
  return Math.min(blockLevel + 1, 6)
}

const createHeadingBlockSpecShifted = createBlockSpec(
  createHeadingBlockConfig,
  ({ allowToggleHeadings = true }: HeadingOptions = {}) => ({
    meta: {
      isolating: false,
    },
    parse(e: HTMLElement) {
      let level: number
      switch (e.tagName) {
        case 'H1':
          level = 1
          break
        case 'H2':
          level = 2
          break
        case 'H3':
          level = 3
          break
        case 'H4':
          level = 4
          break
        case 'H5':
          level = 5
          break
        case 'H6':
          level = 6
          break
        default:
          return undefined
      }
      return {
        ...parseDefaultProps(e),
        level,
      }
    },
    render(block: { props: { level: number } }, editor: unknown) {
      const tagLevel = getRenderedHeadingLevel(block.props.level)
      const dom = document.createElement(`h${tagLevel}`)
      if (allowToggleHeadings) {
        const toggleWrapper = createToggleWrapper(block as any, editor as any, dom)
        return { ...toggleWrapper, contentDOM: dom }
      }
      return {
        dom,
        contentDOM: dom,
      }
    },
    toExternalHTML(block: { props: Record<string, unknown> }) {
      const level = block.props.level as number
      const tagLevel = getRenderedHeadingLevel(level)
      const dom = document.createElement(`h${tagLevel}`)
      addDefaultPropsExternalHTML(block.props as any, dom)
      return {
        dom,
        contentDOM: dom,
      }
    },
  }),
  ({ levels = [...HEADING_LEVELS] }: HeadingOptions = {}) => [
    createExtension({
      key: 'heading-shortcuts',
      keyboardShortcuts: Object.fromEntries(
        levels.map((level) => [
          `Mod-Alt-${level}`,
          ({ editor }: { editor: any }) => {
            const cursorPosition = editor.getTextCursorPosition()
            if (
              editor.schema.blockSchema[cursorPosition.block.type].content !==
              'inline'
            ) {
              return false
            }
            editor.updateBlock(cursorPosition.block, {
              type: 'heading',
              props: { level },
            })
            return true
          },
        ])
      ),
      inputRules: levels.map((level) => ({
        find: new RegExp(`^(#{${level}})\\s$`),
        replace({ match }: { match: RegExpMatchArray }) {
          return {
            type: 'heading',
            props: {
              level: match[1].length,
            },
          }
        },
      })),
    }),
  ]
)

export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    heading: createHeadingBlockSpecShifted(),
  },
})
