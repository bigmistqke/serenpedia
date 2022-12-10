import { useCallback } from 'react'
import { NodeProps } from 'reactflow'
import useStore, { NodeData, NormalNodeData } from '../../../store'
import s from './Normal.module.css'

function Normal({ data }: { data: NormalNodeData }) {
  const { setSelectedWikiData } = useStore()
  const selectWikiData = useCallback(() => {
    if (data.type === 'normal') setSelectedWikiData(data.self)
  }, [data, setSelectedWikiData])

  return (
    <span onMouseMove={() => selectWikiData()} className={s.normal}>
      <div>{data.type === 'normal' && data.self.title}</div>
    </span>
  )
}
export default Normal
