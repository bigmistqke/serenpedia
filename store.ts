import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow'

import zeptoid from 'zeptoid'

import create from 'zustand'

export type WikiUrl = {
  desktop: string

  mobile: string
}

export type WikiData = {
  title: string

  extract: {
    html: string

    text: string
  }

  html: string | undefined

  thumbnail: string | undefined

  url: WikiUrl
}

export type NodeType = 'loading' | 'query' | 'normal' | 'select'

export type LoadingNodeData = {
  type: 'loading'
}

export type ErrorNodeData = {
  type: 'error'

  message: string
}

export type SelectNodeData = {
  type: 'select'

  options: WikiData[]
}

export type QueryNodeData = {
  type: 'query'

  title: string

  completions: string[]
}

export type NormalNodeData = {
  type: 'normal'

  showThumbnail: boolean

  self: WikiData

  relateds: WikiData[]
}

export type NodeData =
  | LoadingNodeData
  | QueryNodeData
  | NormalNodeData
  | SelectNodeData
  | ErrorNodeData

const initialNodes: () => Node<NodeData>[] = () => [
  {
    id: zeptoid(),

    type: 'defaultNode',

    position: { x: 0, y: 0 },

    data: {
      type: 'query',

      title: '',

      completions: [],
    },
  },
]

const getNormalNode = ({
  title,

  position,

  extract,

  thumbnail,

  url,
}: {
  title: string

  position: { x: number; y: number }

  extract: { html: string; text: string }

  thumbnail: string

  url: WikiUrl
}): Node<NodeData> => ({
  id: zeptoid(),

  type: 'defaultNode',

  position,

  data: {
    type: 'normal',

    self: {
      title,

      extract,

      thumbnail,

      url,

      html: undefined,
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

  style: {
    stroke: 'white',

    strokeWidth: '2px',
  },
})

const initialEdges: Edge[] = []

type SelectedWikiData =
  | (WikiData & { type: 'normal'; id: string })
  | (WikiData & { type: 'select'; index: number; id: string })

export type RFState = {
  nodes: Node<NodeData>[]
  edges: Edge[]
  hoveredNodeId: string | undefined
  selectedWikiData?: SelectedWikiData
  selectedNode?: Node<NodeData>
  tooltipText?: string
  tooltip: {
    text: string
    hidden: boolean
  }
  focusOnPanel: boolean
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  open: (data: { nodes: Node<NodeData>[]; edges: Edge[] }) => void
  init: () => void
  removeNode: (id: string) => void
  createLoadingNode: (
    id: string,
    position: { x: number; y: number }
  ) => string | undefined
  createSelectNode: (
    sourceId: string,
    position: { x: number; y: number },
    options: WikiData[]
  ) => string | undefined
  setNodePosition: (nodeId: string, position: { x: number; y: number }) => void
  setNodeDataTitle: (nodeId: string, title: string) => void
  setNodeDataSelf: (nodeId: string, self: WikiData) => void
  setNodeDataRelateds: (nodeId: string, relateds: WikiData[]) => void
  setNodeDataCompletions: (nodeId: string, completions: string[]) => void
  setNodeDataOptions: (nodeId: string, options: WikiData[]) => void
  setNodeDataHtmlNormal: (nodeId: string, html: string) => void
  setNodeDataHtmlSelect: (
    nodeId: string,
    optionIndex: number,
    html: string
  ) => void
  setNodeToNormal: (
    nodeId: string,
    self: WikiData & { html: string | undefined },
    relateds: WikiData[],
    showThumbnail: boolean | 'ignore'
  ) => void
  setNodeToSelect: (nodeId: string, options: WikiData[]) => void
  setNodeToError: (nodeId: string, message: string) => void
  setNodeToQuery: (nodeId: string, title: string, completions: string[]) => void
  setNodeToLoading: (nodeId: string) => void
  setHoveredNodeId: (nodeId: string | undefined) => void
  deselectWikiData: () => void
  setSelectedNode: (node: Node<NodeData>) => void
  setSelectedWikiDataNormal: (
    id: string,
    wikiData: WikiData | undefined
  ) => void
  setSelectedWikiDataSelect: (
    id: string,
    index: number,
    wikiData: WikiData | undefined
  ) => void
  setTooltipText: (tooltipText: string) => void
  hideTooltip: () => void
  showTooltip: () => void
  setFocusOnPanel: (focus: boolean) => void
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const nodes = initialNodes()
const useStore = create<RFState>((set, get) => ({
  nodes,

  edges: initialEdges,

  hoveredNodeId: undefined,

  selectedWikiData: undefined,

  selectedNode: nodes[0],

  tooltip: {
    text: '',

    hidden: true,
  },

  focusOnPanel: false,

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

  open: (data: { nodes: Node<NodeData>[]; edges: Edge[] }) => {
    set({
      nodes: data.nodes,

      edges: data.edges,

      selectedWikiData: undefined,
    })
  },

  init: () => {
    set({
      nodes: initialNodes(),

      edges: [],

      selectedWikiData: undefined,
    })
  },

  removeNode: (id: string) => {
    const iterate = (id: string) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== id),
      })

      const edges = get().edges.filter((edge) => edge.target === id)

      edges.forEach((edge) => iterate(edge.source))
    }

    set({
      selectedWikiData: undefined,
    })

    iterate(id)
  },

  createLoadingNode: (sourceId: string, position: { x: number; y: number }) => {
    const node = get().nodes.find((node) => node.id === sourceId)

    if (!node) {
      console.error('could not find node with id', sourceId)

      return undefined
    }

    const newId = zeptoid()

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

  setNodePosition: (nodeId: string, position: { x: number; y: number }) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.position = position
        }

        return node
      }),
    })
  },

  setNodeDataTitle: (nodeId: string, title: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          if (node.data.type === 'normal') {
            node.data.self.title = title
          } else if (node.data.type === 'query') {
            node.data.title = title
          } else {
            console.error(
              'setNodeDataTitle error: node is not of type `normal` or `query`'
            )
          }
        }

        return node
      }),
    })
  },

  setNodeToSelect: (id: string, options: WikiData[]) => {
    set({
      nodes: [
        ...get().nodes.map((node) => {
          if (node.id === id) {
            node.data = {
              type: 'select',

              options,
            }
          }

          return node
        }),
      ],
    })
  },

  setNodeToLoading: (id) => {
    set({
      nodes: [
        ...get().nodes.map((node) => {
          if (node.id === id) {
            node.data = {
              type: 'loading',
            }
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
              'tried to set data.self of a node which is not of type.normal'
            )
          }
        }

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
              'tried to set data.related of a node which is not of type.normal'
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
            node.data = { ...node.data, options }
          } else {
            console.error(
              'tried to set data.options of a node which is not of type.select'
            )
          }
        }

        return { ...node }
      }),
    })
  },

  setNodeDataHtmlNormal: (nodeId: string, html: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges

          if (node.data.type === 'normal') {
            return {
              ...node,

              data: { ...node.data, self: { ...node.data.self, html } },
            }
          } else {
            console.error(
              'tried to set data.self.html of a node which is not of type.normal'
            )
          }
        }

        return node
      }),
    })
  },

  setNodeDataHtmlSelect: (
    nodeId: string,

    optionIndex: number,

    html: string
  ) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          if (node.data.type === 'select') {
            node.data.options[optionIndex] = {
              ...node.data.options[optionIndex],

              html,
            }
          } else {
            console.error(
              'tried to set data.options[i].html of a node which is not of type.select',

              html,

              node.data
            )
          }
        }

        return { ...node }
      }),
    })
  },

  setNodeDataCompletions: (nodeId: string, completions: string[]) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the cahnges

          if (node.data.type === 'query') {
            node.data = { ...node.data, completions }
          } else {
            console.error(
              'tried to set data.completions of a node which is not of type.query'
            )
          }
        }

        return { ...node }
      }),
    })
  },

  setNodeToNormal: (
    nodeId: string,

    self: WikiData & { html: string | undefined },

    relateds: WikiData[],

    showThumbnail: boolean | 'ignore'
  ) => {
    set({
      nodes: [
        ...get().nodes.map((n) => {
          if (n.id === nodeId) {
            n.data = {
              type: 'normal',

              showThumbnail:
                showThumbnail === 'ignore'
                  ? n.data.showThumbnail
                  : showThumbnail,

              self,

              relateds,
            }
          }

          return n
        }),
      ],
    })
  },

  setNodeToError: (id: string, message: string) => {
    set({
      nodes: [
        ...get().nodes.map((node) => {
          if (node.id === id) {
            node.data = {
              type: 'error',

              message,
            }
          }

          return node
        }),
      ],
    })
  },

  setNodeToQuery: (id: string, title: string, completions: string[]) => {
    set({
      nodes: [
        ...get().nodes.map((node) => {
          if (node.id === id) {
            // const title =

            // 'self' in node.data

            //   ? node.data.self.title

            //   : "title" in node.data

            //     ? node.data.title

            //     : "";

            node.data = {
              type: 'query',

              title,

              completions,
            }
          }

          return node
        }),
      ],
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

  deselectWikiData: () => {
    set({
      selectedWikiData: undefined,
    })
  },

  setSelectedNode: (selectedNode: Node<NodeData>) => {
    set({
      selectedNode,
    })
  },

  setSelectedWikiDataNormal: (id: string, wikiData: WikiData | undefined) => {
    set({
      selectedWikiData: wikiData
        ? { ...wikiData, id, type: 'normal' }
        : undefined,
    })
  },

  setSelectedWikiDataSelect: (
    id: string,

    index: number,

    wikiData: WikiData | undefined
  ) => {
    set({
      selectedWikiData: wikiData
        ? { ...wikiData, id, index, type: 'select' }
        : undefined,
    })
  },

  setTooltipText: (tooltipText: string) => {
    set({
      tooltip: {
        hidden: false,

        text: tooltipText,
      },
    })
  },

  hideTooltip: () => {
    set({
      tooltip: {
        ...get().tooltip,

        hidden: true,
      },
    })
  },

  showTooltip: () => {
    set({
      tooltip: {
        ...get().tooltip,

        hidden: false,
      },
    })
  },

  setFocusOnPanel: (focus: boolean) => {
    set({
      focusOnPanel: focus,
    })
  },
}))

export default useStore
