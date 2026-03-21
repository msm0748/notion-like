import supabase from '@/shared/utils/supabase';
import type { PageDto } from '@/entities/pages/type';
import type { UpdatePagePayload } from '../type';

async function getCurrentUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthenticated');
  return userId;
}

export const createPage = async (): Promise<{ id: string }> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('pages')
    .insert({ userId, title: '', content: null })
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

export const deletePage = async (pageId: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', pageId);
  if (error) throw new Error(error.message);
};
