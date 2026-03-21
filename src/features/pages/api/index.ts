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

export const restorePage = async (pageId: string): Promise<void> => {
  const { error } = await supabase
    .from('pages')
    .update({ isTrashed: false })
    .eq('id', pageId);
  if (error) throw new Error(error.message);
};

export const permanentlyDeletePage = async (pageId: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', pageId);
  if (error) throw new Error(error.message);
};
