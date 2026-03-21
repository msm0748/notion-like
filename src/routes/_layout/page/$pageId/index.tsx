import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TopNav } from './-ui/top-nav';
import { Box, Title } from '@mantine/core';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { CONTENT_MAX_WIDTH, CONTENT_PADDING_X } from '@/shared/conf/constant';
import { pagesQueryOptions } from '@/entities/pages';
import {
  useUpdatePageMutation,
  useCreatePageMutation,
  useDeletePageMutation,
} from '@/features/pages';
import {
  EditorContent,
  type EditorContentHandle,
  type EditorBlock,
} from '@/features/editor';

export const Route = createFileRoute('/_layout/page/$pageId/')({
  component: PageEditor,
});

function PageEditor() {
  const { pageId } = Route.useParams();
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);
  const initialTitleSetRef = useRef(false);
  const { mutate: updatePage } = useUpdatePageMutation();
  const { mutateAsync: createPage } = useCreatePageMutation();
  const { mutate: deletePage } = useDeletePageMutation();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const editorRef = useRef<EditorContentHandle>(null);

  const { data: page } = useQuery(pagesQueryOptions.detail(pageId));

  // 최신값을 인자로 받아 debounce — ref를 클로저에 닫지 않아 lint 경고 없음
  const savePage = useMemo(
    () =>
      debounce((id: string, title: string, content?: EditorBlock[]) => {
        updatePage({
          pageId: id,
          title,
          ...(content !== undefined && { content }),
        });
      }, 500),
    [updatePage],
  );

  useEffect(() => {
    initialTitleSetRef.current = false;
  }, [pageId]);

  useEffect(() => {
    if (page && !page.title) {
      titleRef.current?.focus();
    }
  }, [page]);

  useEffect(() => {
    if (!page || !titleRef.current || initialTitleSetRef.current) return;
    const value = page.title ?? '';
    titleRef.current.textContent = value;
    initialTitleSetRef.current = true;
    queueMicrotask(() => setIsTitleEmpty(!value.trim()));
  }, [page]);

  // 현재 content를 ref로 추적 (title 변경 시에도 최신 content 전달용)
  const contentRef = useRef<EditorBlock[] | undefined>(undefined);

  const updateTitleEmpty = () => {
    const el = titleRef.current;
    const text = el?.textContent ?? '';
    const empty = !text.trim();
    setIsTitleEmpty(empty);
    if (empty && el) {
      requestAnimationFrame(() => {
        const current = titleRef.current;
        if (current && !current.textContent.trim()) {
          current.innerHTML = '';
        }
      });
    }
    savePage(pageId, text, contentRef.current);
  };

  const handleContentChange = useCallback(
    (content: EditorBlock[]) => {
      contentRef.current = content;
      const title = titleRef.current?.textContent ?? '';
      savePage(pageId, title, content);
    },
    [pageId, savePage],
  );

  useEffect(() => {
    return () => {
      savePage.cancel();
    };
  }, [savePage]);

  const handleDeleteSubPage = useCallback(
    (subPageId: string) => {
      deletePage(subPageId);
    },
    [deletePage],
  );

  const handleCreateSubPage = useCallback(async (): Promise<
    string | undefined
  > => {
    try {
      const { id } = await createPage(pageId);
      navigate({ to: '/page/$pageId', params: { pageId: id } });
      return id;
    } catch (err) {
      console.error('하위 페이지 생성 실패:', err);
      return undefined;
    }
  }, [createPage, pageId, navigate]);

  const initialContent = Array.isArray(page?.content)
    ? (page.content as EditorBlock[])
    : undefined;

  return (
    <Box h="100%" display="flex" sx={{ flexDirection: 'column' }}>
      <TopNav pageId={pageId} />
      <Box
        sx={{
          cursor: 'text',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '80px',
        }}
      >
        <Title
          ref={titleRef}
          order={1}
          component="h1"
          data-empty={isTitleEmpty}
          sx={{
            fontSize: '40px',
            fontWeight: 700,
            lineHeight: 1.2,
            border: 'none',
            outline: 'none',
            minHeight: '2.75rem',
            width: '100%',
            maxWidth: CONTENT_MAX_WIDTH,
            paddingLeft: CONTENT_PADDING_X,
            paddingRight: CONTENT_PADDING_X,
            '&[data-empty="true"]::after': {
              content: '"제목없음"',
              color: 'var(--mantine-color-dimmed)',
            },
          }}
          contentEditable
          suppressContentEditableWarning
          onInput={updateTitleEmpty}
          onBlur={updateTitleEmpty}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              editorRef.current?.focusStart();
            }
          }}
        />
      </Box>

      {page !== undefined && (
        <EditorContent
          key={pageId}
          ref={editorRef}
          initialContent={initialContent}
          onChange={handleContentChange}
          onCreateSubPage={handleCreateSubPage}
          onDeleteSubPage={handleDeleteSubPage}
        />
      )}
    </Box>
  );
}
