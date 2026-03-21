/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { editorHasBlockWithType } from '@blocknote/core'
import { SideMenuExtension } from '@blocknote/core/extensions'
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  blockTypeSelectItems,
  useBlockNoteEditor,
  useComponentsContext,
  useExtensionState,
} from '@blocknote/react'
import { useMemo } from 'react'

/**
 * 드래그 핸들(⠿) 메뉴에 블록 타입 변경(Paragraph, Heading 1~6, Quote, 목록 등) 항목을 추가합니다.
 * 공식 Components.Generic.Menu.Item을 사용해 메뉴 클릭 시 자동으로 닫히도록 합니다.
 */
function BlockTypeMenuItems() {
  const editor = useBlockNoteEditor()
  const Components = useComponentsContext()!
  const block = useExtensionState(SideMenuExtension, {
    editor,
    selector: (state) => state?.block,
  })

  const items = useMemo(() => {
    if (!block || !editor) return []
    const dict = editor.dictionary
    return blockTypeSelectItems(dict).filter((item) => {
      if (item.type === 'heading' && (item.props?.level as number) > 3) {
        return false
      }
      return editorHasBlockWithType(
        editor,
        item.type,
        Object.fromEntries(
          Object.entries(item.props ?? {}).map(([k, v]) => [k, typeof v]),
        ) as Record<string, 'string' | 'number' | 'boolean'>,
      )
    })
  }, [block, editor])

  if (!block || !editor) return null

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Components.Generic.Menu.Item
            key={`${item.type}-${JSON.stringify(item.props ?? {})}`}
            className="bn-menu-item"
            onClick={() => {
              editor.focus()
              editor.updateBlock(block, {
                type: item.type as any,
                props: (item.props as any) ?? {},
              })
            }}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {item.name}
          </Components.Generic.Menu.Item>
        )
      })}
      <div
        role="separator"
        style={{
          height: 1,
          margin: '4px 0',
          backgroundColor: 'var(--bn-colors-border, #eee)',
        }}
      />
      <RemoveBlockItem>Delete</RemoveBlockItem>
      <BlockColorsItem>Colors</BlockColorsItem>
    </>
  )
}

/**
 * 블록 타입 변경 + Delete, Colors가 포함된 커스텀 드래그 핸들 메뉴 컴포넌트.
 * BlockNoteView의 SideMenuController와 함께 사용합니다.
 */
export function DragHandleMenuWithBlockTypes(props: {
  children?: React.ReactNode
}) {
  return (
    <DragHandleMenu>
      <BlockTypeMenuItems />
      {props.children}
    </DragHandleMenu>
  )
}
