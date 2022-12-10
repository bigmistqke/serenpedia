import { useCallback } from 'react'
import { CgArrowTopRight } from 'react-icons/cg'
import useStore from '../store'
import s from './Panel.module.css'

function Panel() {
  const { selectedWikiData, setSelectedWikiData } = useStore()

  const onClick = useCallback(() => {
    setSelectedWikiData(undefined)
  }, [setSelectedWikiData])

  return (
    <>
      {selectedWikiData && selectedWikiData.html ? (
        <div className={s.panel}>
          <div className={s.panelButtons}>
            <a
              href={selectedWikiData.url.desktop}
              target="_blank"
              rel="noreferrer"
            >
              <CgArrowTopRight />
            </a>
          </div>
          <div className={s.content}>
            <h1 className={s.title}>{selectedWikiData.title}</h1>
            {selectedWikiData.thumbnail ? (
              <div className={s.thumbnail}>
                {selectedWikiData.thumbnail ? (
                  <img
                    src={selectedWikiData.thumbnail}
                    alt={selectedWikiData.title}
                  />
                ) : undefined}
              </div>
            ) : undefined}
            <div
              className={s.extract}
              dangerouslySetInnerHTML={{ __html: selectedWikiData.html }}
            />
          </div>
        </div>
      ) : undefined}
    </>
  )
}

export default Panel
