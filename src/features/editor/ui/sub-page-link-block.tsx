import { createBlockConfig } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { pagesQueryOptions } from '@/entities/pages'
import { DEFAULT_TITLE } from '@/shared/conf/constant'

const createSubPageLinkBlockConfig = createBlockConfig(
  () =>
    ({
      type: 'subPageLink' as const,
      propSchema: {
        pageId: { default: '' },
      },
      content: 'none',
    }) as const,
)

function SubPageLinkRender({
  block,
}: {
  block: { props: { pageId: string } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any
}) {
  const navigate = useNavigate()
  const pageId = block.props.pageId

  const { data: page } = useQuery({
    ...pagesQueryOptions.detail(pageId),
    enabled: !!pageId,
  })

  const title = page?.title?.trim() || DEFAULT_TITLE

  return (
    <div
      onClick={() => {
        if (pageId) {
          navigate({ to: '/page/$pageId', params: { pageId } })
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 6px',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <FileText
        size={18}
        style={{
          flexShrink: 0,
          color: 'var(--mantine-color-notionGray-6)',
        }}
      />
      <span
        style={{
          fontSize: '14px',
          fontWeight: 400,
          color: 'var(--mantine-color-dark-9)',
          textDecoration: 'underline',
          textDecorationColor: 'var(--mantine-color-gray-4)',
          textUnderlineOffset: '2px',
        }}
      >
        {title}
      </span>
    </div>
  )
}

export const subPageLinkBlock = createReactBlockSpec(
  createSubPageLinkBlockConfig,
  {
    render: SubPageLinkRender,
    toExternalHTML: ({ block }) => {
      return (
        <a href={`/page/${block.props.pageId}`}>
          {block.props.pageId || 'Sub-page'}
        </a>
      )
    },
  },
)
