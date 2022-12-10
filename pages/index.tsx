import React, { useEffect } from 'react'
import ReactFlow, { Background } from 'reactflow'
import shallow from 'zustand/shallow'

import 'reactflow/dist/style.css'

import useStore, { RFState } from '../store'
import WikiNode from '../components/react-flow/WikiNode'
import Panel from '../components/Panel'
import Head from 'next/head'

import setupIndexedDB from 'use-indexeddb'
import Footer from '../components/Footer'

// Database Configuration
const idbConfig = {
  databaseName: 'serenpedia',
  version: 1,
  stores: [
    {
      name: 'search',
      id: { keyPath: 'id', autoIncrement: true },
      indices: [
        { name: 'title', keyPath: 'title', options: { unique: false } },
        { name: 'data', keyPath: 'data' },
        { name: 'id', keyPath: 'id' },
      ],
    },
  ],
}

const nodeTypes = { defaultNode: WikiNode }

const selector = (state: RFState) => ({
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

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => console.log('success'))
      .catch((e) => console.error('error / unsupported', e))
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Head>
        <title>serenpedia</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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
              background: '#e8e8e8',
            }}
          />
        </ReactFlow>
        <Panel />
      </div>
      <Footer />
    </div>
  )
}

export default App
