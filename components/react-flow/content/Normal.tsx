import useStore, { NormalNodeData } from '../../../store'

import s from './Normal.module.css'

function Normal({ id, data }: { id: string; data: NormalNodeData }) {
  const { setSelectedWikiDataNormal, setTooltipText, hideTooltip } = useStore()

  // const selectWikiData = useCallback(() => {

  //   if (data.type === 'normal') setSelectedWikiDataNormal(id, data.self)

  // }, [data, setSelectedWikiDataNormal])

  return (
    <div className={s.normal}>
      <span
        onClick={() => {
          setSelectedWikiDataNormal(id, data.self)
        }}
      >
        <div>{data.type === 'normal' && data.self.title}</div>
      </span>
      {data.showThumbnail && data.self.thumbnail ? (
        <div className={s.thumbnailContainer}>
          <img src={data.self.thumbnail} className={s.thumbnail} />
        </div>
      ) : undefined}
    </div>
  )
}

export default Normal
