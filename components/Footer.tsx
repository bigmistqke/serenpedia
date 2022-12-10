import { useIndexedDBStore } from 'use-indexeddb'
import { useCallback, useEffect, useState } from 'react'
import useStore from '../store'

import s from './Footer.module.css'

type DBEntryType = { title: string; data: string; id?: string }

const Footer = () => {
  const [dbEntryId, setDbEntryId] = useState<string>()

  const idb = useIndexedDBStore<DBEntryType>('search')
  const { nodes, edges, open, init } = useStore()

  const [allSearches, setAllSearches] = useState<DBEntryType[]>([])

  useEffect(() => {
    const init = async () => {
      setAllSearches(await idb?.getAll())
    }
    init()
  }, [idb])

  const save = useCallback(async () => {
    try {
      if ('self' in nodes[0].data && nodes[0].data.self.title && dbEntryId) {
        const result = await idb?.getAll()

        await idb.update({
          id: dbEntryId,
          title: nodes[0].data.self?.title,
          data: JSON.stringify({ nodes, edges }),
        })
        const all = await idb?.getAll()
        setAllSearches(all)
      }
    } catch (err) {
      console.error(err)
    }
  }, [dbEntryId, edges, idb, nodes])

  const saveNew = useCallback(async () => {
    try {
      if ('self' in nodes[0].data && nodes[0].data.self.title) {
        const newId = await idb.add({
          title: nodes[0].data.self?.title,
          data: JSON.stringify({ nodes, edges }),
        })

        const all = await idb?.getAll()

        setAllSearches(all)
      }
    } catch (err) {
      console.error(err)
    }
  }, [edges, idb, nodes])

  const deleteAll = useCallback(async () => {
    try {
      if ('self' in nodes[0].data) {
        await idb.deleteAll()
        const all = await idb?.getAll()
        setAllSearches(all)
      }
    } catch (err) {
      console.error(err)
    }
  }, [idb, nodes])

  const openData = useCallback(
    (search: DBEntryType) => {
      const data = JSON.parse(search.data)
      if (!data) return
      setDbEntryId(search.id)
      open(data)
    },
    [open]
  )

  const createNew = useCallback(() => {
    setDbEntryId(undefined)
    init()
  }, [])

  return (
    <footer className={s.footer}>
      <span className={s.container} style={{ flex: 1, overflow: 'auto' }}>
        {allSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => openData(search)}
            className={search.id === dbEntryId ? s.selected : undefined}
          >
            {search.title}
          </button>
        ))}
      </span>
      <span className={s.container}>
        {dbEntryId ? <button onClick={save}>save</button> : undefined}
        <button onClick={saveNew}>save new</button>
        <button onClick={createNew}>create new</button>
        <button onClick={deleteAll}>delete all</button>
      </span>
    </footer>
  )
}
export default Footer
