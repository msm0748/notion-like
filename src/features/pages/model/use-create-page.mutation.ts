import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPage } from '../api'
import { pagesKeys } from '@/entities/pages'

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<{ id: string }, Error, string | void>({
    mutationFn: (parentId) => createPage(parentId ?? undefined),
    onSuccess: (_data, parentId) => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.lists() })
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: pagesKeys.children(parentId) })
      }
    },
  })
}
