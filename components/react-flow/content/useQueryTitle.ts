import { useCallback } from 'react'
import useStore, { WikiData } from '../../../store'
import getWikipediaPage from '../../../api/getWikipediaPage'

const useQueryTitle = () => {
  const { nodes, createLoadingNode, setNodeToLoading } = useStore()

  return useCallback(
    async (
      id: string,
      title: string,
      position: { x: number; y: number },
      loadingNodeId?: string
    ): Promise<
      | { success: false; loadingNodeId?: string }
      | {
          success: true
          loadingNodeId: string
          self: WikiData
          relateds: WikiData[]
        }
    > => {
      {
        if (loadingNodeId) {
          setNodeToLoading(loadingNodeId)
        } else {
          loadingNodeId = createLoadingNode(id, position)
        }

        const newPage = await getWikipediaPage(title)

        if (!loadingNodeId) return { loadingNodeId, success: false }

        if (newPage) {
          const { self, relateds } = newPage

          return { loadingNodeId, success: true, self, relateds }
        } else {
          return { loadingNodeId, success: false }
        }
      }
    },

    [nodes, createLoadingNode]
  )
}
export default useQueryTitle
