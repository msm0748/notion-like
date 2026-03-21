import { createBlockConfig } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { Select, ActionIcon } from '@mantine/core'
import { Copy, Check } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

const SUPPORTED_LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'xml', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
]

const TOKEN_COLORS: Record<string, string> = {
  'hljs-keyword': '#C792EA',
  'hljs-string': '#C3E88D',
  'hljs-comment': '#546E7A',
  'hljs-number': '#F78C6C',
  'hljs-function': '#82AAFF',
  'hljs-title': '#82AAFF',
  'hljs-built_in': '#FFCB6B',
  'hljs-type': '#FFCB6B',
  'hljs-literal': '#FF5370',
  'hljs-variable': '#EEFFFF',
  'hljs-attr': '#C792EA',
  'hljs-name': '#F07178',
  'hljs-tag': '#F07178',
  'hljs-operator': '#89DDFF',
  'hljs-punctuation': '#89DDFF',
}

type HastNode =
  | { type: 'text'; value: string }
  | { type: 'element'; tagName: string; properties: { className?: string[] }; children: HastNode[] }
  | { type: string }

function renderHast(nodes: HastNode[], key = 0): React.ReactNode[] {
  return nodes.map((node, i) => {
    if (node.type === 'text' && 'value' in node) {
      return node.value
    }
    if (node.type === 'element' && 'children' in node) {
      const cls = node.properties?.className ?? []
      const color = cls.map((c: string) => TOKEN_COLORS[c]).find(Boolean)
      return (
        <span key={`${key}-${i}`} style={color ? { color } : undefined}>
          {renderHast(node.children, i)}
        </span>
      )
    }
    return null
  })
}

function highlight(code: string, language: string): React.ReactNode[] {
  if (!code || language === 'plaintext') return [code]
  try {
    const result = lowlight.highlight(language, code)
    return renderHast(result.children as HastNode[])
  } catch {
    return [code]
  }
}

const BLOCK_NAV_KEYS = ['ArrowUp', 'ArrowDown', 'Enter', 'Backspace', 'Escape']

const createCodeBlockConfig = createBlockConfig(
  () =>
    ({
      type: 'codeBlock' as const,
      propSchema: {
        code: { default: '' },
        language: { default: 'plaintext' },
      },
      content: 'none',
    }) as const,
)

function CodeBlockRender({
  block,
  editor,
}: {
  block: { id: string; props: { code: string; language: string } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any
}) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const code = block.props.code
  const language = block.props.language

  // 새로 생성된 블록(빈 코드)이면 textarea에 자동 포커스
  // setTimeout: BlockNote가 content:none 블록 생성 후 커서를 다음 블록으로 이동시키는 것을 기다린 뒤 재포커스
  useEffect(() => {
    if (code === '') {
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [code])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      editor.updateBlock(block, { props: { code: e.target.value } })
    },
    [editor, block],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (BLOCK_NAV_KEYS.includes(e.key)) {
      e.stopPropagation()
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      e.stopPropagation()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const newValue = el.value.substring(0, start) + '  ' + el.value.substring(end)
      editor.updateBlock(block, { props: { code: newValue } })
      requestAnimationFrame(() => {
        el.selectionStart = start + 2
        el.selectionEnd = start + 2
      })
    }
  }, [editor, block])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const highlighted = highlight(code, language)

  return (
    <div
      style={{
        backgroundColor: '#2F2F2F',
        borderRadius: '6px',
        fontFamily: 'var(--mantine-font-family-monospace)',
        color: '#E6E6E6',
        margin: '4px 0',
        overflow: 'hidden',
        width: '100%',
        display: 'block',
        boxSizing: 'border-box',
      }}
    >
      {/* 툴바 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Select
          value={language}
          data={SUPPORTED_LANGUAGES}
          size="xs"
          variant="unstyled"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(val) =>
            editor.updateBlock(block, { props: { language: val ?? 'plaintext' } })
          }
          comboboxProps={{ withinPortal: true }}
          styles={{
            input: {
              color: 'rgba(255,255,255,0.45)',
              fontSize: '12px',
              cursor: 'pointer',
              minHeight: 'unset',
              height: '24px',
              lineHeight: '24px',
            },
            section: { color: 'rgba(255,255,255,0.3)' },
          }}
          w={120}
        />
        <ActionIcon
          size="sm"
          variant="subtle"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleCopy}
          style={{ color: 'rgba(255,255,255,0.45)' }}
          title="복사"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </ActionIcon>
      </div>

      {/* 에디터 영역 */}
      <div style={{ position: 'relative', padding: '12px 16px' }}>
        {/* 문법 강조 레이어 */}
        <pre
          aria-hidden
          style={{
            margin: 0,
            padding: 0,
            pointerEvents: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            fontFamily: 'inherit',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#E6E6E6',
            minHeight: '20px',
          }}
        >
          <code>{highlighted}</code>
        </pre>

        {/* 투명 편집 레이어 */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          style={{
            position: 'absolute',
            inset: 0,
            padding: '12px 16px',
            margin: 0,
            resize: 'none',
            border: 'none',
            background: 'transparent',
            color: 'transparent',
            caretColor: 'white',
            fontFamily: 'inherit',
            fontSize: '13px',
            lineHeight: '1.6',
            outline: 'none',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}

export const codeBlock = createReactBlockSpec(createCodeBlockConfig, {
  render: CodeBlockRender,
  toExternalHTML: ({ block }) => (
    <pre>
      <code className={`language-${block.props.language}`}>{block.props.code}</code>
    </pre>
  ),
})
