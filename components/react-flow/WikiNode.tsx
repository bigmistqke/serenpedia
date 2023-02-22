import { useCallback, useState } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import useStore, { NodeData } from '../../store'

import Loading from '../Loading'
import Query from './content/Query'
import Normal from './content/Normal'
import Select from './content/Select'
import Error from './content/Error'

import s from './WikiNode.module.css'
import loadingStyle from './content/Loading.module.css'
import { TopIcons, AddIcon } from './content/Icons'

export default function WikiNode({ id, data }: NodeProps<NodeData>) {
  const {
    nodes,
    setHoveredNodeId,
    hoveredNodeId,
    setSelectedWikiDataNormal,
    setTooltipText,
    hideTooltip,
  } = useStore()

  const [loadingNodeId, setLoadingNodeId] = useState<string | undefined>()

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
        return <Select id={id} options={data.options} />

      case 'error':
        return <Error message={data.message} />

      default:
        return <span>error</span>
    }
  }, [id, data])

  const handleToolTip = useCallback(() => {
    if (data.type === 'normal') {
      if (!data.self?.extract?.text) {
        console.error('data.self.extract.text is undefined', data)
        return
      }
      setTooltipText(data.self.extract.text)
    }
  }, [data])

  const isAddIconVisible =
    data.type === 'normal' && hoveredNodeId === id && data.relateds.length > 0

  const isLeftHandleVisible =
    data.type === 'normal' || (nodes[0] && nodes.length > 1)

  const isRightHandleVisible = nodes[0]?.id !== id

  return (
    <div className={s.container} onMouseEnter={() => setHoveredNodeId(id)}>
      <TopIcons data={data} id={id} />

      <div
        className={s.wikiNode}
        onMouseEnter={handleToolTip}
        onMouseUp={() => {
          if (data.type === 'normal') setTooltipText(data.self.extract.text)
        }}
        onMouseLeave={() => hideTooltip()}
      >
        <div>
          <Handle
            type="target"
            position={Position.Right}
            className={s.handle}
            style={{
              pointerEvents: 'none',
              right: '0px',
              padding: '0px',
              border: 'none',
              visibility: isLeftHandleVisible ? 'visible' : 'hidden',
            }}
          />
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
              visibility: isRightHandleVisible ? 'visible' : 'hidden',
            }}
          />
        </div>
        {isAddIconVisible ? <AddIcon id={id} data={data} /> : undefined}
      </div>
    </div>
  )
}
