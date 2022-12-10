import { useCallback, useEffect, useRef, useState } from 'react'
import { useReactFlow, Node } from 'reactflow'
import useStore, {
  NodeData,
  NormalNodeData,
  SelectNodeData,
  WikiData,
} from '../../../store'
import when from '../../../utils/when'
import lookUp from '../../../utils/wikipedia/page'
import s from './Select.module.css'

function Select({
  node,
  options,
}: {
  node: Node<SelectNodeData>
  options: WikiData[]
}) {
  const {
    nodes,
    setSelectedWikiData,
    createLoadingNode,
    setNodeDataSelf,
    setNodeDataRelateds,
    setNodeToNormal,
    setNodeToSelect,
    setNodeDataOptions,
    setHoveredNodeId,
  } = useStore()

  const [opened, setOpened] = useState(false)
  const [selection, setSelection] = useState<WikiData>()

  const ref = useRef<HTMLDivElement>(null)

  const toggleOpened = useCallback(() => setOpened(!opened), [opened])
  const selectTitle = useCallback((data: WikiData) => {
    setSelection(data)
  }, [])

  useEffect(() => {
    const look = async () => {
      if (!selection || !ref.current) return
      setHoveredNodeId(undefined)
      // node = setNodeDataType(node, 'normal')
      // setNodeDataSelf(node, selection)
      setNodeToNormal(node.id, selection, options)

      const position = nodes.find((n) => n.id === node.id)?.position
      when(
        position &&
          createLoadingNode(node.id, {
            x: position.x + ref.current.offsetWidth + 50,
            y: position.y,
          }),
        await lookUp(selection.title)
      ).then((newId, data) => {
        if (data.relateds) {
          // setNodeToNormal(node.id, selection, data.relateds)
          setNodeToSelect(newId, data.relateds)
        } else {
          console.error('could not find relateds!!')
        }
      })
    }
    look()
  }, [selection, ref])

  const content = () => {
    if (opened)
      return (
        <button className={s.button} onClick={toggleOpened}>
          select
        </button>
      )
    if (selection) return <span>{selection.title}</span>
    return (
      <div
        className={`${s.container} nowheel`}
        onWheel={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onMouseMove={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
      >
        {options?.map((data) => (
          <div key={data.title}>
            <button
              onClick={() => {
                selectTitle(data)
              }}
              onMouseEnter={() => setSelectedWikiData(data)}
            >
              {data.title}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return <div ref={ref}>{content()}</div>
}
export default Select
