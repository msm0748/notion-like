import supabase from '@/shared/utils/supabase';
import type { PageDto } from '../type';

async function getCurrentUserId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthenticated');
  return userId;
}

export const getPages = async (params?: {
  favorites?: boolean;
}): Promise<PageDto[]> => {
  const userId = await getCurrentUserId();

  if (params?.favorites) {
    // !inner join: favorites가 존재하는 page만 반환 (RLS가 favorites.userId 자동 필터)
    // 기존 2-round-trip → 1-round-trip
    const { data, error } = await supabase
      .from('pages')
      .select('*, favorites!inner(id)')
      .eq('userId', userId)
      .eq('isTrashed', false)
      .is('parentId', null)
      .order('updatedAt', { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((item) => {
      const { favorites: _join, ...page } = item as PageDto & {
        favorites: { id: string }[];
      };
      return page;
    });
  }

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('userId', userId)
    .eq('isTrashed', false)
    .is('parentId', null)
    .order('updatedAt', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PageDto[];
};

export const getPage = async (pageId: string): Promise<PageDto | null> => {
  const userId = await getCurrentUserId();

  // !left join으로 page + isFavorite 여부를 단일 쿼리로 처리
  // RLS(own_favorites_select)가 favorites.userId를 자동 필터링하므로 추가 필터 불필요
  // 기존 2-round-trip → 1-round-trip
  const { data: page, error } = await supabase
    .from('pages')
    .select('*, favorites!left(id)')
    .eq('id', pageId)
    .eq('userId', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!page) return null;

  const { favorites: favs, ...pageData } = page as PageDto & {
    favorites: { id: string }[];
  };
  return { ...pageData, isFavorite: favs.length > 0 };
};

export const addFavorite = async (pageId: string): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('favorites')
    .upsert({ userId, pageId }, { onConflict: 'userId,pageId' });
  if (error) throw new Error(error.message);
};

export const removeFavorite = async (pageId: string): Promise<void> => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('userId', userId)
    .eq('pageId', pageId);
  if (error) throw new Error(error.message);
};

export const searchPages = async (query: string): Promise<PageDto[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('userId', userId)
    .eq('isTrashed', false)
    .ilike('title', `%${query}%`)
    .order('updatedAt', { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as PageDto[];
};

export const getChildPages = async (parentId: string): Promise<PageDto[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('userId', userId)
    .eq('parentId', parentId)
    .eq('isTrashed', false)
    .order('updatedAt', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PageDto[];
};

export const getTrashedPages = async (): Promise<PageDto[]> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('userId', userId)
    .eq('isTrashed', true)
    .order('updatedAt', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PageDto[];
};
