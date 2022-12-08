import React, { useCallback } from 'react'
import ReactFlow, { Background } from 'reactflow'
import shallow from 'zustand/shallow'

import 'reactflow/dist/style.css'

import useStore from '../store'
import WikiNode from '../components/react-flow/WikiNode'
import Panel from '../components/Panel'
import Head from 'next/head'

const nodeTypes = { defaultNode: WikiNode }

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  )

  const onConnectStart = useCallback((event) => {
    console.log('start', event)
  }, [])

  return (
    <>
      <Head>
        <title>SERENPEDIA</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background
            style={{
              background: 'lightgrey',
            }}
          />
        </ReactFlow>
        <Panel />
      </div>
    </>
  )
}

export default App
