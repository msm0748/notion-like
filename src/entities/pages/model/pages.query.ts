import { queryOptions } from '@tanstack/react-query';
import { getPage, getPages, searchPages, getChildPages } from '../api';

export const pagesKeys = {
  all: ['pages'] as const,
  lists: () => [...pagesKeys.all, 'list'] as const,
  list: (title: string) => [...pagesKeys.lists(), title] as const,
  details: () => [...pagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...pagesKeys.details(), id] as const,
  favorites: () => [...pagesKeys.all, 'favorites'] as const,
  searches: () => [...pagesKeys.all, 'search'] as const,
  search: (query: string) => [...pagesKeys.searches(), query] as const,
  children: (parentId: string) => [...pagesKeys.all, 'children', parentId] as const,
};

export const pagesQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: pagesKeys.lists(),
      queryFn: () => getPages(),
    }),

  favorites: () =>
    queryOptions({
      queryKey: pagesKeys.favorites(),
      queryFn: () => getPages({ favorites: true }),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: pagesKeys.detail(id),
      queryFn: () => getPage(id),
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: pagesKeys.search(query),
      queryFn: () => searchPages(query),
    }),

  children: (parentId: string) =>
    queryOptions({
      queryKey: pagesKeys.children(parentId),
      queryFn: () => getChildPages(parentId),
    }),
};
