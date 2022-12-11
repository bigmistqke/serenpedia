import useStore, { NormalNodeData } from '../../../store'

import s from './Normal.module.css'

function Normal({ id, data }: { id: string; data: NormalNodeData }) {
  const { setSelectedWikiDataNormal, setTooltipText, hideTooltip } = useStore()

  // const selectWikiData = useCallback(() => {

  //   if (data.type === 'normal') setSelectedWikiDataNormal(id, data.self)

  // }, [data, setSelectedWikiDataNormal])

  return (
    <span
      className={s.normal}
      onClick={() => {
        setSelectedWikiDataNormal(id, data.self)
      }}
    >
      <div>{data.type === 'normal' && data.self.title}</div>
    </span>
  )
}

export default Normal
