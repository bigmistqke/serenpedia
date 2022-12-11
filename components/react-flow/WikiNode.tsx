import { useCallback, useRef, useState } from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import { IoIosAdd, IoIosCamera, IoIosTrash } from 'react-icons/io'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'

import useStore, { NodeData } from '../../store'

import Loading from '../Loading'
import Query from './content/Query'
import Normal from './content/Normal'
import Select from './content/Select'
import Error from './content/Error'

import cursor from '../../utils/cursor'

import s from './WikiNode.module.css'
import loadingStyle from './content/Loading.module.css'

export default function WikiNode({ id, data }: NodeProps<NodeData>) {
  const {
    nodes,
    setHoveredNodeId,
    selectedWikiData,
    hoveredNodeId,
    createSelectNode,
    removeNode,
    setNodePosition,
    setNodeToNormal,
    setSelectedWikiDataNormal,
    setTooltipText,
    hideTooltip,
    tooltip,
  } = useStore()

  const { project } = useReactFlow()

  const [loadingNodeId, setLoadingNodeId] = useState<string | undefined>()

  const ref = useRef<HTMLDivElement>(null)

  const content = useCallback(() => {
    switch (data.type) {
      case 'query':
        return (
          <Query
            id={id}
            title={data.title}
            completions={data.completions}
            loadingNodeId={loadingNodeId}
            setLoadingNodeId={setLoadingNodeId}
          />
        )

      case 'loading':
        return <Loading className={loadingStyle.loading} />

      case 'normal':
        return <Normal id={id} data={data} />

      case 'select':
        return (
          <Select
            id={id}
            options={data.options}
            showThumbnail={data.showThumbnail}
          />
        )

      case 'error':
        return <Error message={data.message} />

      default:
        return <span>error</span>
    }
  }, [id, data])

  const addNode = async (e) => {
    if (data.type !== 'normal') return

    const width = ref.current?.offsetWidth

    const position = nodes.find((node) => node.id === id)?.position

    if (!position || !width) return

    const { left, top, height } = e.target.parentElement.getBoundingClientRect()

    const start = {
      x: e.clientX,

      y: e.clientY,
    }

    const newId = createSelectNode(
      id,

      project({ x: left + 10, y: top + 10 }),

      data.relateds
    )

    if (!newId) return

    await cursor((e) => {
      const delta = {
        x: e.clientX - start.x,

        y: e.clientY - start.y,
      }

      setNodePosition(
        newId,

        project({
          x: left + delta.x + 10,

          y: top + delta.y + 10,
        })
      )
    })
  }

  return (
    <div className={s.container} onMouseMove={() => setHoveredNodeId(id)}>
      <div
        className={s.buttons}
        style={{
          visibility:
            data.type !== 'loading' && hoveredNodeId === id
              ? 'visible'
              : 'hidden',
        }}
        ref={ref}
      >
        {data.type === 'normal' &&
        hoveredNodeId === id &&
        data.self.thumbnail ? (
          <button
            className={s.button}
            onClick={() => {
              if (data.type === 'normal') {
                setNodeToNormal(
                  id,

                  data.self,

                  data.relateds,

                  !data.showThumbnail
                )
              }
            }}
          >
            <IoIosCamera />
          </button>
        ) : undefined}

        {data.type === 'normal' && hoveredNodeId === id ? (
          <a
            className={`${s.close} ${s.button}`}
            href={selectedWikiData?.url.desktop}
            target="_blank"
            rel="noreferrer"
          >
            <CgArrowTopRight />
          </a>
        ) : undefined}

        {nodes[0]?.id !== id ? (
          <button
            className={s.button}
            onClick={() => {
              removeNode(id)
              setTooltipText('')
              hideTooltip()
            }}
          >
            <IoIosTrash />
          </button>
        ) : undefined}
      </div>

      <div
        className={s.wikiNode}
        onMouseMove={() => {
          if (data.type === 'normal') {
            if (!data.self?.extract?.text) {
              console.error('data.self.extract.text is undefined', data)
              return
            }

            setTooltipText(data.self.extract.text)
          }
        }}
        onMouseUp={() => {
          if (data.type === 'normal') setTooltipText(data.self.extract.text)
        }}
        onMouseLeave={() => {
          hideTooltip()
        }}
      >
        <div>
          <Handle
            type="target"
            position={Position.Right}
            className={s.handle}
            // onMouseDown={onDragHandle}

            style={{
              pointerEvents: 'none',

              right: '0px',

              padding: '0px',

              visibility:
                data.type === 'normal' || (nodes[0] && nodes.length > 1)
                  ? 'visible'
                  : 'hidden',
            }}
          ></Handle>

          <div
            className={s.content}
            onMouseDownCapture={() => {
              if (data.type === 'normal') {
                setSelectedWikiDataNormal(id, data.self)
              }
            }}
          >
            <div>{content()}</div>
          </div>

          {nodes[0]?.id !== id ? (
            <Handle
              type="source"
              position={Position.Left}
              id="a"
              className={s.handle}
              style={{
                left: '0px',

                padding: '0px',

                border: 'none',

                pointerEvents: 'none',

                backgroundColor: 'white',
              }}
            />
          ) : undefined}
        </div>

        {data.type === 'normal' &&
        hoveredNodeId === id &&
        data.relateds.length > 0 ? (
          <button
            className={`${s.button} ${s.add} nodrag nopan`}
            onMouseDown={addNode}
            ref={ref}
          >
            <IoIosAdd />
          </button>
        ) : undefined}
      </div>
    </div>
  )
}
