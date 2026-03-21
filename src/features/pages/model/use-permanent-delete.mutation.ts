import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permanentlyDeletePage } from '../api';
import { pagesKeys } from '@/entities/pages';

export const usePermanentDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pageId: string) => permanentlyDeletePage(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.all });
      queryClient.invalidateQueries({ queryKey: pagesKeys.detail(pageId) });
    },
  });
};
