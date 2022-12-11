import { useCallback, useEffect, useRef, useState } from 'react'
import { CgArrowTopRight, CgClose } from 'react-icons/cg'
import { html } from 'wikipedia/dist'
import useStore from '../store'
import s from './Panel.module.css'
import Loading from './Loading'
import useQueryTitle from './react-flow/content/useQueryTitle'

function Panel() {
  const {
    selectedWikiData,
    setSelectedWikiDataNormal,
    setNodeDataHtmlNormal,
    deselectWikiData,
    nodes,
    setNodeToNormal,
    setNodeToError,
    selectedNode,
  } = useStore()

  const queryTitle = useQueryTitle()

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
      new RegExp('href=\\"/wiki/', 'g'),
      'class="link" data-link="'
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

  const selectedNodeRef = useRef(selectedNode)

  useEffect(() => {
    selectedNodeRef.current = nodes.find(
      (node) => node.id === selectedWikiData?.id
    )
  })

  const addLink = useCallback(
    async (link: Element) => {
      const originalTitle = link.getAttribute('data-link')

      if (!originalTitle) return

      const title = decodeURI(originalTitle.split('#')[0])

      const node = selectedNodeRef.current
      if (!node) return

      const position = {
        x: node.position.x + (node.width || 0) + 75,
        y: node.position.y,
      }

      const result = await queryTitle(node.id, title, position)

      if (result.success) {
        setSelectedWikiDataNormal(result.loadingNodeId, result.self)
        setNodeToNormal(
          result.loadingNodeId,
          result.self,
          result.relateds,
          false
        )
        // setSelectedNode
      } else {
        if (result.loadingNodeId)
          setNodeToError(result.loadingNodeId, 'could not find any results')
      }
    },
    [selectedNode]
  )

  const initLink = (link: Element) => {
    link.classList.add(s.link)
    link.addEventListener('mousedown', () => {
      console.log('cloick')
      addLink(link)
    })
  }

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.link').forEach(initLink)
    }, 0)
  }, [selectedWikiData?.html])

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
