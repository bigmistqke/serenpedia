import { useCallback, useRef, useState } from 'react'
import { useReactFlow } from 'reactflow'
import useStore, { WikiData } from '../../../store'
import when from '../../../utils/when'
import page from '../../../utils/wikipedia/page'
import s from './Select.module.css'

function Select({ id, options }: { id: string; options: WikiData[] }) {
  const {
    nodes,
    selectedWikiData,
    setSelectedWikiData,
    createLoadingNode,
    setNodeToNormal,
    setHoveredNodeId,
    setNodeToSelect,
    // addToNormalConnectingIds,
  } = useStore()

  const [opened, setOpened] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const toggleOpened = useCallback(() => setOpened(!opened), [opened])

  const makeSelection = useCallback(
    async (selection: WikiData) =>
      when(
        ref.current,
        selection,
        nodes.find((node) => node.id === id)?.position
      ).then(async (dom, selection, position) => {
        dom.innerText = selection.title

        setHoveredNodeId(undefined)

        setNodeToNormal(id, selection, [])

        const newId = createLoadingNode(id, {
          x: position.x + dom.offsetWidth + 150,
          y: position.y,
        })

        when(newId, await page(selection.title)).then((newId, data) => {
          if (data.relateds) {
            setNodeToNormal(id, selection, data.relateds)
            setNodeToSelect(newId, data.relateds)
          } else {
            // TODO: deal with error
            console.error('could not find relateds!!')
          }
        })
      }),
    [
      createLoadingNode,
      id,
      nodes,
      setHoveredNodeId,
      setNodeToNormal,
      setNodeToSelect,
    ]
  )

  const content = () => {
    if (opened)
      return (
        <button className={s.button} onClick={toggleOpened}>
          select
        </button>
      )
    return (
      <div
        className={`${s.container} nowheel`}
        onWheel={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {options?.map((data) => (
          <div key={data.title}>
            <button
              onClick={() => makeSelection(data)}
              onMouseEnter={() => {
                if (selectedWikiData?.title !== data.title)
                  setSelectedWikiData(data)
              }}
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
