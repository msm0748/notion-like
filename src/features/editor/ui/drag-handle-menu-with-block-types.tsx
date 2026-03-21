import { Fragment } from 'react';
import { editorHasBlockWithType } from '@blocknote/core';
import { SideMenuExtension } from '@blocknote/core/extensions';
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  blockTypeSelectItems,
  useBlockNoteEditor,
  useComponentsContext,
  useExtensionState,
} from '@blocknote/react';
import { useMemo } from 'react';
import { Box, Text } from '@mantine/core';

const GROUP_ORDER = ['Headings', 'Basic blocks', 'Advanced', 'Media'];

function getGroup(type: string): string {
  if (type === 'heading') return 'Headings';
  if (type === 'table') return 'Advanced';
  if (
    type === 'image' ||
    type === 'video' ||
    type === 'audio' ||
    type === 'file'
  )
    return 'Media';
  return 'Basic blocks';
}

function BlockTypeMenuItems() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const block = useExtensionState(SideMenuExtension, {
    editor,
    selector: (state) => state?.block,
  });

  const grouped = useMemo(() => {
    if (!block || !editor) return [];
    const dict = editor.dictionary;
    const items = blockTypeSelectItems(dict).filter((item) => {
      if (item.type === 'heading' && (item.props?.level as number) > 3)
        return false;
      if (item.type === 'heading' && (item.props as any)?.isToggleable)
        return false;
      return editorHasBlockWithType(
        editor,
        item.type,
        Object.fromEntries(
          Object.entries(item.props ?? {}).map(([k, v]) => [k, typeof v]),
        ) as Record<string, 'string' | 'number' | 'boolean'>,
      );
    });

    const map = new Map<string, typeof items>();
    for (const item of items) {
      const g = getGroup(item.type);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }

    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      name: g,
      items: map.get(g)!,
    }));
  }, [block, editor]);

  if (!block || !editor) return null;

  if (block.type === 'subPageLink') {
    return <RemoveBlockItem>Delete</RemoveBlockItem>;
  }

  return (
    <>
      {grouped.map((group) => (
        <Fragment key={group.name}>
          {/* Group label */}
          <Text
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--mantine-color-dimmed)',
              padding: '8px 12px 4px',
              userSelect: 'none',
            }}
          >
            {group.name}
          </Text>

          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Box
                sx={{
                  '& .bn-menu-item': {
                    height: 'auto',
                    padding: '4px 8px',
                  },
                }}
              >
                <Components.Generic.Menu.Item
                  key={`${item.type}-${JSON.stringify(item.props ?? {})}`}
                  className="bn-menu-item"
                  onClick={() => {
                    editor.focus();
                    editor.updateBlock(block, {
                      type: item.type as any,
                      props: (item.props as any) ?? {},
                    });
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        backgroundColor: 'var(--mantine-color-body)',
                        border: '1px solid var(--mantine-color-gray-3)',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--mantine-color-dark-6)',
                      }}
                    >
                      <Icon size={20} />
                    </Box>
                    <Text size="sm" fw={500}>
                      {item.name}
                    </Text>
                  </Box>
                </Components.Generic.Menu.Item>
              </Box>
            );
          })}
        </Fragment>
      ))}

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
  );
}

export function DragHandleMenuWithBlockTypes(props: {
  children?: React.ReactNode;
}) {
  return (
    <DragHandleMenu>
      <BlockTypeMenuItems />
      {props.children}
    </DragHandleMenu>
  );
}
