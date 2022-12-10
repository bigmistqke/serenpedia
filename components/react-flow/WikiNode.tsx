import { useCallback, useRef, useState } from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import { IoIosAdd, IoIosTrash } from 'react-icons/io'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import useStore, { NodeData } from '../../store'
import cursor from '../../utils/cursor'
import Query from './content/Query'
import Loading from './content/Loading'
import Normal from './content/Normal'
import Select from './content/Select'
import Error from './content/Error'

import s from './WikiNode.module.css'

export default function WikiNode({ id, data }: NodeProps<NodeData>) {
  const {
    nodes,
    setHoveredNodeId,
    selectedWikiData,
    hoveredNodeId,
    createSelectNode,
    removeNode,
    setNodePosition,
  } = useStore()

  const { project } = useReactFlow()

  const [loadingNodeId, setLoadingNodeId] = useState<string | undefined>()

  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback(() => {
    setHoveredNodeId(id)
  }, [setHoveredNodeId, id])

  const onDragHandle = useCallback(async () => {
    const { clientX, clientY } = await cursor()
    if (data.type !== 'normal' || !ref.current?.offsetWidth) return
    createSelectNode(id, project({ x: clientX, y: clientY }), data.relateds)
  }, [ref, data, createSelectNode, id, project])

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
        return <Loading />
      case 'normal':
        return <Normal data={data} />
      case 'select':
        return <Select id={id} options={data.options} />
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

    console.log(e.target.parentElement)

    const { left, top, height } = e.target.parentElement.getBoundingClientRect()

    const start = {
      x: e.clientX,
      y: e.clientY,
    }

    const newId = createSelectNode(
      id,
      project({ x: left, y: top }),
      data.relateds
    )
    if (!newId) return

    await cursor((e) => {
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      }
      setNodePosition(newId, project({ x: left + delta.x, y: top + delta.y }))
    })
  }

  return (
    <div className={s.container}>
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
        {data.type === 'normal' && selectedWikiData ? (
          <a
            className={`${s.close} ${s.button}`}
            href={selectedWikiData.url.desktop}
            target="_blank"
            rel="noreferrer"
          >
            <CgArrowTopRight />
          </a>
        ) : undefined}

        {nodes[0]?.id !== id ? (
          <button className={s.button} onClick={() => removeNode(id)}>
            <IoIosTrash />
          </button>
        ) : undefined}
      </div>

      <div className={s.wikiNode}>
        <div
          onMouseMove={onMouseMove}
          onMouseEnter={(e) => setHoveredNodeId(undefined)}
        >
          <Handle
            type="target"
            position={Position.Right}
            className={s.handle}
            onMouseDown={onDragHandle}
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

          {content()}

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

        {data.type === 'normal' && selectedWikiData && hoveredNodeId === id ? (
          <button
            className={`${s.button} ${s.add} nodrag nopan`}
            onMouseDown={addNode}
          >
            <IoIosAdd />
          </button>
        ) : undefined}
      </div>
    </div>
  )
}
