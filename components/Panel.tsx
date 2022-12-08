import { useCallback, useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'
import useStore, { RFState } from '../store'
import s from './Panel.module.css'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'

function Panel() {
  const { selectedWikiData, setSelectedWikiData } = useStore()

  const onClick = useCallback(() => {
    setSelectedWikiData(undefined)
  }, [])

  return (
    <>
      {selectedWikiData && selectedWikiData.html ? (
        <div className={s.panel}>
          <button onClick={onClick} className={s.close}>
            <IoMdClose />
          </button>
          <div className={s.content}>
            <h1 className={s.title}>{selectedWikiData.title}</h1>
            {selectedWikiData.thumbnail ? (
              <div className={s.thumbnail}>
                <img
                  src={selectedWikiData.thumbnail}
                  alt={selectedWikiData.title}
                />
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
