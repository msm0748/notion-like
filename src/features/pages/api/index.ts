import supabase from '@/shared/utils/supabase';
import type { PageDto } from '@/entities/pages/type';
import type { UpdatePagePayload } from '../type';

async function getCurrentUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthenticated');
  return userId;
}

export const createPage = async (parentId?: string): Promise<{ id: string }> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('pages')
    .insert({ userId, title: '', content: null, parentId: parentId ?? null })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return { id: (data as { id: string }).id };
};

export const updatePage = async ({ pageId, title, content }: UpdatePagePayload): Promise<PageDto> => {
  const { data, error } = await supabase
    .from('pages')
    .update({ title, ...(content !== undefined && { content }) })
    .eq('id', pageId)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as PageDto;
};

export const softDeletePage = async (pageId: string): Promise<void> => {
  const { error } = await supabase
    .from('pages')
    .update({ isTrashed: true })
    .eq('id', pageId);
  if (error) throw new Error(error.message);
};

export const restorePage = async (pageId: string): Promise<{ resolvedParentId: string | null }> => {
  // 복구할 페이지의 parentId 확인
  const { data: page, error: fetchError } = await supabase
    .from('pages')
    .select('parentId')
    .eq('id', pageId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { parentId } = page as { parentId: string | null };
  let resolvedParentId = parentId;

  if (parentId) {
    // 부모 페이지가 존재하고 휴지통에 없는지 확인
    const { data: parentPage } = await supabase
      .from('pages')
      .select('id, isTrashed, content')
      .eq('id', parentId)
      .maybeSingle();

    if (!parentPage || parentPage.isTrashed) {
      // 부모가 없거나 휴지통에 있으면 최상위 페이지로 복구
      resolvedParentId = null;
    } else {
      // 부모 페이지 content 끝에 subPageLink 블록 추가
      const existingContent = Array.isArray(parentPage.content) ? parentPage.content : [];
      const subPageLinkBlock = {
        id: crypto.randomUUID(),
        type: 'subPageLink',
        props: { pageId },
        content: [],
        children: [],
      };
      const newContent = [...existingContent, subPageLinkBlock];
      await supabase
        .from('pages')
        .update({ content: newContent })
        .eq('id', parentId);
    }
  }

  const { error } = await supabase
    .from('pages')
    .update({ isTrashed: false, parentId: resolvedParentId })
    .eq('id', pageId);
  if (error) throw new Error(error.message);

  return { resolvedParentId };
};

export const permanentlyDeletePage = async (pageId: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', pageId);
  if (error) throw new Error(error.message);
};

export const permanentlyDeleteAllTrashedPages = async (): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('userId', userId)
    .eq('isTrashed', true);
  if (error) throw new Error(error.message);
};
