import { useCallback, useRef, useState } from 'react'

import useStore, { NormalNodeData, WikiData } from '../../../store'
import when from '../../../utils/when'
import page from '../../../utils/wikipedia/page'

import s from './Select.module.css'

function Select({ id, options }: { id: string; options: WikiData[] }) {
  const {
    nodes,
    selectedWikiData,
    setSelectedWikiDataSelect,
    createLoadingNode,
    setNodeToNormal,
    setHoveredNodeId,
    setNodeToSelect,
    setTooltipText,
    hideTooltip,
  } = useStore()

  const [opened, setOpened] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const toggleOpened = useCallback(() => setOpened(!opened), [opened])

  const finalizeSelection = useCallback(() => {}, [nodes])

  const makeSelection = useCallback(
    async (selection: WikiData, index: number) =>
      when(
        ref.current,

        selection,

        nodes.find((node) => node.id === id)?.position
      ).then(async (dom, selection, position) => {
        dom.innerText = selection.title

        setHoveredNodeId(undefined)

        hideTooltip()

        setNodeToNormal(id, { ...selection, html: undefined }, [], false)

        const newId = createLoadingNode(id, {
          x: position.x + dom.offsetWidth + 100,

          y: position.y,
        })

        setSelectedWikiDataSelect(id, index, selection)

        when(newId, await page(selection.title)).then((newId, data) => {
          if (data.relateds) {
            const nodeData = nodes.find((node) => node.id === id)
              ?.data as NormalNodeData

            //  TODO: 'ignore'-flag is a bit awkward...

            setNodeToNormal(id, data.self, data.relateds, 'ignore')

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
        {options?.map((data, index) => (
          <div key={data.title}>
            <button
              onClick={() => makeSelection(data, index)}
              onMouseMove={(e) => setTooltipText(data.extract.text)}
              onMouseLeave={() => hideTooltip()}
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
