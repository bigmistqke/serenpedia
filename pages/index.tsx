import React, { useEffect, useState } from 'react'
import ReactFlow, { Background, Node, ReactFlowProvider } from 'reactflow'
import shallow from 'zustand/shallow'
import 'reactflow/dist/style.css'
import Head from 'next/head'
import setupIndexedDB from 'use-indexeddb'

import useStore, { NodeData, RFState } from '../store'

import WikiNode from '../components/react-flow/WikiNode'
import Panel from '../components/Panel'
import Footer from '../components/Footer'

import s from './index.module.css'

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

function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedWikiData,
    tooltip,
    hideTooltip,
    showTooltip,
    setSelectedNode,
  } = useStore()

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(() => console.log('success'))

      .catch((e) => console.error('error / unsupported', e))
  }, [])

  const [cursorPosition, setCursorPosition] = useState<{
    x: number
    y: number
  }>()

  return (
    <div
      style={{
        width: '100vw',

        height: '100vh',

        display: 'flex',

        flexDirection: 'column',
      }}
      onMouseMoveCapture={(e) => {
        setCursorPosition({
          x: e.clientX,

          y: e.clientY,
        })
      }}
    >
      <ReactFlowProvider>
        <Head>
          <title>serenpedia</title>

          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <div
          style={{
            flex: 1,

            position: 'relative',

            overflow: 'hidden',
          }}
        >
          <div
            className={s.graph}
            onMouseMove={(e) => {
              if (e.target.class === 'react-flow__pane') hideTooltip()
            }}

            // onClick={() => (focusOnPanel ? setFocusOnPanel(false) : undefined)}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              onNodeDrag={(e, node) => {
                setSelectedNode(node)
                setCursorPosition({
                  x: e.clientX,

                  y: e.clientY,
                })
              }}
              onNodeDragStop={(e, node: Node<NodeData>) => {
                showTooltip()
              }}
              onNodeDragStart={(e, node) => {
                setSelectedNode(node)
                hideTooltip()
              }}
            >
              <Background
                style={{
                  background: '#e8e8e8',
                }}
              />
            </ReactFlow>
          </div>

          <Panel />
        </div>

        <Footer />

        {cursorPosition && !tooltip.hidden && tooltip.text ? (
          <div
            className={s.tooltip}
            style={{
              left: cursorPosition.x + 10,
              top: cursorPosition.y - 30,
            }}
          >
            {tooltip.text.slice(0, 85)}...
          </div>
        ) : undefined}
      </ReactFlowProvider>
    </div>
  )
}

export default App
