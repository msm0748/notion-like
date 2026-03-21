import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPage } from '../api'
import { pagesKeys } from '@/entities/pages'

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createPage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagesKeys.lists() })
    },
  })
}
