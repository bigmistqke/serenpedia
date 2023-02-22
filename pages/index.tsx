import { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

import ReactFlow, { Background, Node, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import setupIndexedDB from 'use-indexeddb'

import useStore, { NodeData } from '../store'

import Footer from '../components/Footer'
import Panel from '../components/Panel'
import WikiNode from '../components/react-flow/WikiNode'

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

  const isTooltipShown = cursorPosition && !tooltip.hidden && tooltip.text

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-50GEGCF66L"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-50GEGCF66L');`,
        }}
      />
      <Head>
        <title>serenpedia</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
                if (
                  (e.target as HTMLDivElement).className === 'react-flow__pane'
                )
                  hideTooltip()
              }}
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
          {isTooltipShown ? (
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
    </>
  )
}

export default App
