import { useCallback, useEffect, useRef, useState } from 'react'
import { useReactFlow } from 'reactflow'
import useStore, { WikiData } from '../../store'
import when from '../../utils/when'
import lookUp from '../../utils/wikipedia/lookUp'
import s from './SelectContent.module.css'

function SelectContent({
  id,
  options,
  xPos,
  yPos,
}: {
  id: string
  options: WikiData[]
}) {
  const {
    nodes,
    setSelectedWikiData,
    createLoadingNode,
    setNodeDataSelf,
    setNodeDataRelateds,
    setNodeDataType,
    setNodeDataOptions,
    setHoveredNodeId,
  } = useStore()

  const { project } = useReactFlow()

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
      setNodeDataType(id, 'normal')
      setNodeDataSelf(id, selection)
      const position = nodes.find((node) => node.id === id)?.position
      when(
        position &&
          createLoadingNode(id, {
            x: position.x + ref.current.offsetWidth + 50,
            y: position.y,
          }),
        await lookUp(selection.title)
      ).then((newId, data) => {
        setNodeDataRelateds(id, [])
        setNodeDataType(newId, 'select')

        if (data.relateds) {
          setNodeDataRelateds(id, data.relateds)
          setNodeDataOptions(newId, data.relateds)
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
          console.log('this happens/')
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
export default SelectContent
