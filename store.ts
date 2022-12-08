import create from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
} from 'reactflow'
import wiki from 'wikipedia'
import zeptoid from 'zeptoid'

export type WikiData = {
  title: string
  html: string
  thumbnail: string
}

export type NodeType = 'loading' | 'query' | 'normal' | 'select'

export type LoadingNodeData = {
  type: 'loading'
}

export type SelectNodeData = {
  type: 'select'
  options: WikiData[]
}

export type QueryNodeData = {
  type: 'query'
  self: {
    title: string
  }
}

export type NormalNodeData = {
  type: 'normal'
  self: WikiData
  relateds: WikiData[]
}

export type NodeData =
  | LoadingNodeData
  | QueryNodeData
  | NormalNodeData
  | SelectNodeData

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'defaultNode',
    position: { x: 0, y: 0 },
    data: {
      type: 'query',
      self: {
        title: '',
      },
    },
  },
]

const getNormalNode = ({
  title,
  position,
  html,
  thumbnail,
}: {
  title: string
  position: { x: number; y: number }
  html: string
  thumbnail: string
}): Node<NodeData> => ({
  id: zeptoid(),
  type: 'defaultNode',
  position,
  data: {
    type: 'normal',
    self: {
      title,
      html,
      thumbnail,
    },
    relateds: [],
  },
})

const getLoadingNode = (
  id: string,
  position: { x: number; y: number }
): Node<NodeData> => ({
  id,
  type: 'defaultNode',
  position,
  data: {
    type: 'loading',
  },
})

const getSelectNode = (
  id: string,
  position: { x: number; y: number },
  options: WikiData[]
): Node<NodeData> => ({
  id,
  type: 'defaultNode',
  position,
  data: {
    type: 'select',
    options,
  },
})

const getDefaultEdge = (targetId: string, sourceId: string) => ({
  id: zeptoid(),
  source: sourceId,
  target: targetId,
})

const initialEdges: Edge[] = []

export type RFState = {
  nodes: Node<NodeData>[]
  edges: Edge[]
  hoveredNodeId: string | undefined
  selectedWikiData?: WikiData
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  createLoadingNode: (
    id: string,
    position: { x: number; y: number }
  ) => string | undefined
  createSelectNode: (
    sourceId: string,
    position: { x: number; y: number },
    options: WikiData[]
  ) => string | undefined
  setNodeDataTitle: (nodeId: string, title: string) => void
  setNodeDataType: (id: string, type: NodeType) => void
  setNodeDataSelf: (nodeId: string, self: WikiData) => void
  setNodeDataRelateds: (nodeId: string, relateds: WikiData[]) => void
  setNodeDataOptions: (nodeId: string, options: WikiData[]) => void
  setHoveredNodeId: (nodeId: string | undefined) => void
  setSelectedWikiData: (wikiData: WikiData | undefined) => void
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  hoveredNodeId: undefined,
  selectedWikiData: undefined,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    })
  },
  createLoadingNode: (sourceId: string, position: { x: number; y: number }) => {
    const node = get().nodes.find((node) => node.id === sourceId)

    if (!node) {
      console.error('could not find node with id', sourceId)
      return undefined
    }

    const newId = zeptoid()

    console.log('loadingnode', position)

    const newNode = getLoadingNode(newId, position)
    const newEdge = getDefaultEdge(sourceId, newId)

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    })

    return newId
  },
  createSelectNode: (
    sourceId: string,
    position: { x: number; y: number },
    options: WikiData[]
  ) => {
    const node = get().nodes.find((node) => node.id === sourceId)

    if (!node) {
      console.error('could not find node with id', sourceId)
      return undefined
    }

    const newId = zeptoid()

    const newNode = getSelectNode(newId, position, options)
    const newEdge = getDefaultEdge(sourceId, newId)

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    })

    return newId
  },
  setNodeDataTitle: (nodeId: string, title: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          if (node.data.type !== 'loading') {
            const self = {
              ...node.data.self,
              title,
            }
            // TODO: fix non-critical type-error
            node.data = { ...node.data, self }
          } else {
            console.error('tried to set data.self.title of a loading node')
          }
        }
        return node
      }),
    })
  },
  setNodeDataType: (id: string, type: NodeType) => {
    set({
      nodes: [
        ...get().nodes.map((node) => {
          if (node.id === id) {
            node.data.type = type
          }
          return node
        }),
      ],
    })
  },
  setNodeDataSelf: (nodeId: string, self: WikiData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          if (node.data.type === 'normal') {
            node.data = { ...node.data, self }
          } else {
            console.error(
              'tried to set data.self of a node that was not yet of type.normal'
            )
          }
        }
        console.log('self is', node)
        return { ...node }
      }),
    })
  },
  setNodeDataRelateds: (nodeId: string, relateds: WikiData[]) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          if (node.data.type === 'normal') {
            node.data = { ...node.data, relateds }
          } else {
            console.error(
              'tried to set data.related of a node that was not yet of type.normal'
            )
          }
        }
        return node
      }),
    })
  },
  setNodeDataOptions: (nodeId: string, options: WikiData[]) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges
          if (node.data.type === 'select') {
            node.data = { type: 'select', options }
          } else {
            console.error(
              'tried to set data.related of a node that was not yet of type.normal'
            )
          }
        }
        return { ...node }
      }),
    })
  },
  connectNodes: (sourceId: string, targetId: string) => {
    const newEdge = getDefaultEdge(sourceId, targetId)
    set({
      edges: [...get().edges, newEdge],
    })
    return newEdge.id
  },
  setHoveredNodeId: (nodeId: string | undefined) => {
    set({
      hoveredNodeId: nodeId,
    })
  },
  setSelectedWikiData: (wikiData: WikiData | undefined) => {
    set({
      selectedWikiData: wikiData,
    })
  },
}))

export default useStore
