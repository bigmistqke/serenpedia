import { useRef } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { useReactFlow } from 'reactflow'

import { CgArrowTopRight } from 'react-icons/cg'
import { IoIosCamera, IoIosTrash } from 'react-icons/io'

import useStore, { NodeData } from '../../../store'
import cursor from '../../../utils/cursor'

import s from './Icons.module.css'

export const AddIcon = ({ data, id }: { data: NodeData; id: string }) => {
  const { createSelectNode, nodes, setNodePosition } = useStore()
  const { project } = useReactFlow()

  const ref = useRef<HTMLButtonElement>(null)

  const addNode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (data.type !== 'normal') return

    const width = ref.current?.offsetWidth

    const position = nodes.find((node) => node.id === id)?.position

    if (!position || !width) return

    const { left, top } = (
      e.target as HTMLElement
    ).parentElement!.getBoundingClientRect()

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

    cursor((e) => {
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      }

      setNodePosition(
        newId,
        project({
          x: left + delta.x,
          y: top + delta.y,
        })
      )
    })
  }

  return (
    <button
      className={`${s.button} ${s.add} nodrag nopan`}
      onMouseDown={(e) => addNode(e)}
      ref={ref}
    >
      <IoIosAdd />
    </button>
  )
}

export const TopIcons = ({ data, id }: { data: NodeData; id: string }) => {
  const {
    nodes,
    selectedWikiData,
    hoveredNodeId,
    removeNode,
    setNodeToNormal,
    setTooltipText,
    hideTooltip,
  } = useStore()

  return (
    <div
      className={s.buttons}
      style={{
        visibility:
          data.type !== 'loading' && hoveredNodeId === id
            ? 'visible'
            : 'hidden',
      }}
    >
      {data.type === 'normal' && hoveredNodeId === id && data.self.thumbnail ? (
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
          className={s.button}
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
  )
}
