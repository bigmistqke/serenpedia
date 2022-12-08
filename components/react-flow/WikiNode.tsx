import { useCallback, useRef } from 'react'
import { IoIosAdd, IoIosTrash, IoMdInformation } from 'react-icons/io'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import useStore, { NodeData } from '../../store'
import when from '../../utils/when'
import InputContent from './InputContent'
import SelectContent from './SelectContent'
import s from './WikiNode.module.css'
import LoadingContent from './LoadingContent'
import handler from '../../pages/api/hello'
import cursor from '../../utils/cursor'

export default function WikiNode({
  id,
  data,
  xPos,
  yPos,
}: NodeProps<NodeData>) {
  const {
    nodes,
    setHoveredNodeId,
    setSelectedWikiData,
    hoveredNodeId,
    createSelectNode,
  } = useStore()

  const { project } = useReactFlow()

  const ref = useRef<HTMLDivElement>(null)

  const onMouseEnter = useCallback(() => {
    setHoveredNodeId(id)
  }, [])

  const selectWikiData = useCallback(() => {
    if (data.type === 'normal') setSelectedWikiData(data.self)
  }, [data.type, data.self])

  const content = useCallback(() => {
    switch (data.type) {
      case 'query':
        return <InputContent id={id} title={data.self?.title} />
      case 'loading':
        return <LoadingContent />
      case 'normal':
        return (
          <span onMouseEnter={() => selectWikiData()}>{data.self?.title}</span>
        )
      case 'select':
        return <SelectContent id={id} options={data.options} />
      default:
        return <span>error</span>
    }
  }, [id, data.type, data.self, data.options])

  const onDragHandle = useCallback(async () => {
    const { clientX, clientY } = await cursor()
    console.log(xPos, yPos)
    if (data.type !== 'normal' || !ref.current?.offsetWidth) return
    createSelectNode(id, project({ x: clientX, y: clientY }), data.relateds)
  }, [ref, data.relateds])

  return (
    <>
      <div
        className={s.buttons}
        style={{
          visibility: hoveredNodeId === id ? 'visible' : 'hidden',
        }}
        ref={ref}
      >
        {when('self' in data && 'html' in data.self && data.self.html).then(
          () => (
            <button onClick={selectWikiData}>
              <IoMdInformation />
            </button>
          )
        )}
        <button>
          <IoIosTrash />
        </button>
      </div>

      <div className={s.wikiNode} onMouseEnter={onMouseEnter}>
        <Handle
          type="target"
          position={Position.Right}
          className={s.handle}
          onMouseDown={onDragHandle}
          style={{
            visibility: data.type === 'normal' ? 'visible' : 'hidden',
          }}
        >
          <div style={{ background: 'white', margin: '10px' }}>
            <IoIosAdd
              style={{ height: '100%', width: '100%', pointerEvents: 'none' }}
            />
          </div>
        </Handle>

        <div>{content()}</div>

        {nodes[0].id !== id ? (
          <Handle
            type="source"
            position={Position.Left}
            id="a"
            className={s.handle}
            style={{
              height: '2px',
              width: '2px',
              left: '-2px',
              border: 'none',
              padding: 'none',
              pointerEvents: 'none',
              backgroundColor: 'white',
            }}
          />
        ) : undefined}
      </div>
    </>
  )
}
