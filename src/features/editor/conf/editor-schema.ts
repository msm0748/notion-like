import {
  BlockNoteSchema,
  createBlockSpec,
  createCodeBlockSpec,
  createExtension,
  createHeadingBlockConfig,
  createToggleWrapper,
  defaultBlockSpecs,
  addDefaultPropsExternalHTML,
  parseDefaultProps,
} from '@blocknote/core'
import type { HeadingOptions } from '@blocknote/core'
import { codeBlockOptions } from '@blocknote/code-block'
import { subPageLinkBlock } from '../ui/sub-page-link-block'

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
    codeBlock: createCodeBlockSpec({
      ...codeBlockOptions,
      defaultLanguage: 'shellscript',
      supportedLanguages: {
        text: { name: 'Plain Text', aliases: ['text', 'txt'] },
        javascript: { name: 'JavaScript', aliases: ['javascript', 'js'] },
        typescript: { name: 'TypeScript', aliases: ['typescript', 'ts'] },
        jsx: { name: 'JSX', aliases: ['jsx'] },
        tsx: { name: 'TSX', aliases: ['tsx'] },
        python: { name: 'Python', aliases: ['python', 'py'] },
        rust: { name: 'Rust', aliases: ['rust', 'rs'] },
        go: { name: 'Go', aliases: ['go'] },
        shellscript: { name: 'Bash', aliases: ['shellscript', 'bash', 'sh', 'zsh'] },
        html: { name: 'HTML', aliases: ['html'] },
        css: { name: 'CSS', aliases: ['css'] },
        json: { name: 'JSON', aliases: ['json'] },
        sql: { name: 'SQL', aliases: ['sql'] },
        yaml: { name: 'YAML', aliases: ['yaml', 'yml'] },
        markdown: { name: 'Markdown', aliases: ['markdown', 'md'] },
      },
    }),
    heading: createHeadingBlockSpecShifted(),
    subPageLink: subPageLinkBlock(),
  },
})

export type EditorBlock = (typeof editorSchema)['Block']
