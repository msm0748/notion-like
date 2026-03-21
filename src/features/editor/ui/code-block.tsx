import { createCodeBlockSpec } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { codeBlockOptions } from '@blocknote/code-block'
import { Select, ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Copy, Check } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import type { Extension } from '@blocknote/core'

// 표시할 언어 목록 (codeBlockOptions.supportedLanguages에서 추출)
const LANGUAGE_LIST = [
  { value: 'text', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'shellscript', label: 'Bash' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
]

// Shiki 하이라이팅 + 올바른 content:'inline' 설정을 포함한 공식 스펙
const officialSpec = createCodeBlockSpec({
  ...codeBlockOptions,
  defaultLanguage: 'text',
  supportedLanguages: Object.fromEntries(
    LANGUAGE_LIST.map(({ value }) => [
      value,
      codeBlockOptions.supportedLanguages[value as keyof typeof codeBlockOptions.supportedLanguages] ?? { name: value, aliases: [] },
    ]),
  ),
})

function CodeBlockRender({
  block,
  editor,
  contentRef,
}: {
  block: { id: string; props: { language: string } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any
  contentRef: (node: HTMLElement | null) => void
}) {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const [copied, setCopied] = useState(false)
  const codeEl = useRef<HTMLElement | null>(null)

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      codeEl.current = node
      contentRef(node)
    },
    [contentRef],
  )

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(codeEl.current?.textContent ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const language = block.props.language

  const bgColor = isDark ? '#2F2F2F' : '#F8F8F8'
  const textColor = isDark ? '#E6E6E6' : '#1F2937'
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const iconColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const chevronColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: '6px',
        fontFamily: 'var(--mantine-font-family-monospace)',
        color: textColor,
        margin: '4px 0',
        width: '100%',
        display: 'block',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 툴바 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Select
          value={language}
          data={LANGUAGE_LIST}
          size="xs"
          variant="unstyled"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(val) =>
            editor.updateBlock(block, { props: { language: val ?? 'text' } })
          }
          comboboxProps={{ withinPortal: true }}
          styles={{
            input: {
              color: labelColor,
              fontSize: '12px',
              cursor: 'pointer',
              minHeight: 'unset',
              height: '24px',
              lineHeight: '24px',
            },
            section: { color: chevronColor },
          }}
          w={120}
        />
        <ActionIcon
          size="sm"
          variant="subtle"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleCopy}
          style={{ color: iconColor }}
          title="복사"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </ActionIcon>
      </div>

      {/* 코드 에디터 영역 - contentRef로 BlockNote 인라인 컨텐츠 마운트 */}
      <pre
        style={{
          margin: 0,
          padding: '12px 16px',
          fontFamily: 'inherit',
          fontSize: '13px',
          lineHeight: '1.6',
          color: textColor,
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        <code ref={setRef} style={{ fontFamily: 'inherit' }} />
      </pre>
    </div>
  )
}

export const codeBlock = createReactBlockSpec(
  officialSpec.config,
  {
    render: CodeBlockRender,
    toExternalHTML: ({ block, contentRef }) => (
      <pre>
        <code className={`language-${block.props.language}`} ref={contentRef} />
      </pre>
    ),
  },
  officialSpec.extensions as Extension[],
)
