import { Box } from '@mantine/core';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FileText } from 'lucide-react';
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from '@/shared/conf/constant';
import { BlockNoteView } from '@blocknote/mantine';
import {
  AddBlockButton,
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react';
import { DragHandleMenuWithBlockTypes } from './drag-handle-menu-with-block-types';
import { SlashMenu } from './slash-menu';
import { editorSchema, type EditorBlock } from '../conf/editor-schema';

function collectSubPageIds(blocks: EditorBlock[]): Set<string> {
  const ids = new Set<string>();
  for (const block of blocks) {
    if (block.type === 'subPageLink' && block.props.pageId) {
      ids.add(block.props.pageId);
    }
    if (block.children?.length) {
      for (const id of collectSubPageIds(block.children)) {
        ids.add(id);
      }
    }
  }
  return ids;
}

interface EditorContentProps {
  initialContent?: EditorBlock[];
  onChange?: (content: EditorBlock[]) => void;
  onCreateSubPage?: () => Promise<string | undefined>;
  onDeleteSubPage?: (pageId: string) => void;
}

export interface EditorContentHandle {
  focusStart: () => void;
}

export const EditorContent = forwardRef<
  EditorContentHandle,
  EditorContentProps
>(({ initialContent, onChange, onCreateSubPage, onDeleteSubPage }, ref) => {
  const editor = useCreateBlockNote({
    schema: editorSchema,
    initialContent,
  });

  useImperativeHandle(ref, () => ({
    focusStart: () => {
      const firstBlock = editor.document[0];
      if (!firstBlock) return;
      editor.focus();
      editor.setTextCursorPosition(firstBlock, 'start');
    },
  }));

  const prevSubPageIdsRef = useRef<Set<string>>(
    initialContent ? collectSubPageIds(initialContent) : new Set(),
  );

  useEffect(() => {
    return editor.onChange(() => {
      const doc = editor.document as EditorBlock[];
      onChange?.(doc);

      if (onDeleteSubPage) {
        const currentIds = collectSubPageIds(doc);
        for (const id of prevSubPageIdsRef.current) {
          if (!currentIds.has(id)) {
            onDeleteSubPage(id);
          }
        }
        prevSubPageIdsRef.current = currentIds;
      }
    });
  }, [editor, onChange, onDeleteSubPage]);

  const handleClickOutsideEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const lastBlock = editor.document[editor.document.length - 1];
      editor.focus();
      editor.setTextCursorPosition(lastBlock, 'end');
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        cursor: 'text',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      pt="xl"
      onClick={handleClickOutsideEditor}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          paddingLeft: CONTENT_PADDING_X,
          paddingRight: CONTENT_PADDING_X,
          /* BlockNote 기본 padding-inline(54px) 제거 → 래퍼 패딩만 사용해 타이틀과 정렬 */
          '& .bn-editor': { paddingInline: 0 },
          /* 에디터 내 h2~h6 크기: h2 30px 기준으로 단계별 조정 */
          '& .bn-editor h2': { fontSize: '30px', fontWeight: 600 },
          '& .bn-editor h3': { fontSize: '26px', fontWeight: 600 },
          '& .bn-editor h4': { fontSize: '22px', fontWeight: 600 },

          /* 헤딩 크기 증가에 따른 드래그 핸들 (SideMenu) 위치 보정 
             (BlockNote 기본 정렬이 top-start 이므로 폰트가 커지면 아이콘이 너무 위로 감) */
          '& :where(.bn-side-menu)[data-block-type="heading"][data-level="1"]':
            { transform: 'translateY(-18px)' },
          '& :where(.bn-side-menu)[data-block-type="heading"][data-level="2"]':
            { transform: 'translateY(-4px)' },
        }}
      >
        {/* 에디터 본문: Heading 1 → h2, Heading 2 → h3, ... */}
        <BlockNoteView
          editor={editor}
          theme="light"
          sideMenu={false}
          slashMenu={false}
        >
          <SuggestionMenuController
            triggerCharacter={'/'}
            suggestionMenuComponent={SlashMenu}
            getItems={async (query: string) => {
              const items = getDefaultReactSlashMenuItems(editor).filter(
                (item) =>
                  ![
                    'Heading 4',
                    'Heading 5',
                    'Heading 6',
                    '제목 4',
                    '제목 5',
                    '제목 6',
                  ].includes(item.title),
              );

              if (onCreateSubPage) {
                items.push({
                  title: '하위 페이지',
                  onItemClick: async () => {
                    const pageId = await onCreateSubPage();
                    if (!pageId) return;

                    const currentBlock = editor.getTextCursorPosition().block;
                    const isCurrentEmpty =
                      Array.isArray(currentBlock.content) &&
                      (currentBlock.content.length === 0 ||
                        (currentBlock.content.length === 1 &&
                          currentBlock.content[0].type === 'text' &&
                          currentBlock.content[0].text === '/'));

                    if (isCurrentEmpty) {
                      editor.updateBlock(currentBlock, {
                        type: 'subPageLink',
                        props: { pageId },
                      });
                    } else {
                      editor.insertBlocks(
                        [{ type: 'subPageLink', props: { pageId } }],
                        currentBlock,
                        'after',
                      );
                    }
                  },
                  aliases: ['sub-page', 'subpage', 'page', '하위', '페이지'],
                  group: '고급',
                  icon: <FileText size={18} />,
                  subtext: '하위 페이지를 생성합니다',
                });
              }

              if (!query) return items;
              const lowered = query.toLowerCase();
              return items.filter(
                (item) =>
                  item.title.toLowerCase().includes(lowered) ||
                  item.subtext?.toLowerCase().includes(lowered) ||
                  item.aliases?.some((alias) =>
                    alias.toLowerCase().includes(lowered),
                  ),
              );
            }}
          />
          <SideMenuController
            sideMenu={(props) => (
              <SideMenu
                {...props}
                dragHandleMenu={DragHandleMenuWithBlockTypes}
              >
                <AddBlockButton />
                <DragHandleButton
                  dragHandleMenu={DragHandleMenuWithBlockTypes}
                />
              </SideMenu>
            )}
          />
        </BlockNoteView>
      </Box>
      <Box
        sx={{ minHeight: '40vh' }}
        onClick={() => {
          const lastBlock = editor.document[editor.document.length - 1];
          editor.focus();
          editor.setTextCursorPosition(lastBlock, 'end');
        }}
      />
    </Box>
  );
});
