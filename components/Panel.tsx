import { useCallback, useEffect, useRef, useState } from 'react'
import { CgArrowTopRight, CgClose } from 'react-icons/cg'
import { html } from 'wikipedia/dist'
import useStore from '../store'
import s from './Panel.module.css'
import Loading from './Loading'

function Panel() {
  const {
    selectedWikiData,
    setSelectedWikiDataNormal,
    setNodeDataHtmlNormal,
    deselectWikiData,
    focusOnPanel,
    nodes,
  } = useStore()

  const [loading, setLoading] = useState<boolean>()

  const selectedWikiDataIdRef = useRef<string | undefined>('')

  selectedWikiDataIdRef.current = selectedWikiData?.id

  useEffect(() => {
    setLoading(false)
  }, [selectedWikiData])

  const showMore = useCallback(async () => {
    if (!selectedWikiData) return

    setLoading(true)

    let extraHtml = await html(selectedWikiData.title)

    if (!selectedWikiData) return

    extraHtml = extraHtml.replace(
      new RegExp('href=\\"/wiki', 'g'),

      'target="_blank" href="https://www.wikipedia.org/wiki'
    )

    setLoading(false)

    setNodeDataHtmlNormal(selectedWikiData.id, extraHtml)

    if (selectedWikiDataIdRef.current === selectedWikiData.id) {
      setSelectedWikiDataNormal(selectedWikiData.id, {
        ...selectedWikiData,

        html: extraHtml,
      })
    }
  }, [selectedWikiData])

  return (
    <>
      {selectedWikiData && selectedWikiData.extract ? (
        <div className={s.panel}>
          <div className={s.panelButtons}>
            <button onClick={() => deselectWikiData()}>
              <CgClose />
            </button>

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
              dangerouslySetInnerHTML={{
                __html: selectedWikiData.html || selectedWikiData.extract.html,
              }}
            />

            {!selectedWikiData.html ? (
              <button onClick={showMore} className={s.showMore}>
                {loading ? <Loading /> : 'show more'}
              </button>
            ) : undefined}
          </div>
        </div>
      ) : undefined}
    </>
  )
}

export default Panel
