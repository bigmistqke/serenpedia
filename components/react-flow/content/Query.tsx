import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import useStore from '../../../store'
import when from '../../../utils/when'
import page from '../../../api/wikipedia/page'
import s from './Query.module.css'

import { Inconsolata } from '@next/font/google'
import suggestions from '../../../api/wikipedia/autocomplete'
import useQueryTitle from './useQueryTitle'

const font = Inconsolata({ subsets: ['latin'] })

function Query({
  id,
  title,
  completions,
  loadingNodeId,
  setLoadingNodeId,
}: {
  id: string
  title: string
  completions: string[]
  loadingNodeId?: string
  setLoadingNodeId: (id: string | undefined) => void
}) {
  const {
    nodes,
    removeNode,
    setNodeDataTitle,
    createLoadingNode,
    setSelectedWikiDataNormal,
    setNodeDataCompletions,
    setNodeToNormal,
    setNodeToSelect,
    setNodeToError,
    setNodeToLoading,
    setNodeToQuery,
  } = useStore()

  const queryTitle = useQueryTitle()

  const [hasReceivedAutocompletions, setHasReceivedAutocompletions] =
    useState(false)

  // const [completions, setCompletions] = useState<string[]>()

  const [localValue, setLocalValue] = useState<string>(title)
  const [inputInFocus, setInputInFocus] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompletionRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      when(title === '').then(() => {
        setNodeDataCompletions(id, [])
        setHasReceivedAutocompletions(false)
      }),
    [title]
  )

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      //  TODO: very ugly hack to remove the loading/error indicator
      //  need to re-architecture the whole node system

      if (nodes.length > 1) {
        removeNode(nodes[1].id)
        setLoadingNodeId(undefined)
      }

      if (!inputRef.current) {
        console.error('inputRef is undefined')
        return
      }

      const input = evt.target as HTMLInputElement
      const value = input?.value
      setLocalValue(value)
      setNodeDataTitle(id, value)

      if (!value) {
        setNodeDataCompletions(id, [])
      } else {
        suggestions(value).then((suggestions) => {
          setHasReceivedAutocompletions(true)
          if (!suggestions) {
            setNodeDataCompletions(id, [])
            return
          }

          suggestions = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().startsWith(value.toLowerCase())
          )

          if (completions && suggestions.includes(completions[0])) {
            const index = suggestions.findIndex(
              (suggestion) => suggestion === completions[0]
            )
            suggestions.splice(index, 1)
            suggestions = [completions[0], ...suggestions]
          }

          setNodeDataCompletions(id, suggestions.length > 0 ? suggestions : [])
        })
      }
    },

    [setNodeDataTitle, id, setNodeDataCompletions, completions, nodes]
  )

  const onKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && autocompletionRef.current) {
        const position = nodes.find((node) => node.id === id)?.position
        const width = inputRef.current?.offsetWidth
        if (inputRef.current?.value && position && width) {
          const result = await queryTitle(
            id,
            inputRef.current?.value,
            { x: position.x + width + 90, y: position.y },
            loadingNodeId
          )
          if (!result.success) {
            if (!result.loadingNodeId) {
              console.error('loadingNodeId is undefined')
            } else {
              setNodeToError(result.loadingNodeId, 'could not find any results')
            }

            setNodeToQuery(id, title, [])

            inputRef.current?.focus()
            return
          } else {
            setSelectedWikiDataNormal(id, result.self)
            setNodeToNormal(id, result.self, result.relateds, false)
            setNodeToSelect(result.loadingNodeId, result.relateds)
          }
        }
      }

      if (event.key === 'ArrowDown' && completions && completions.length > 0) {
        event.preventDefault()
        const first = completions.shift()
        if (first) setNodeDataCompletions(id, [...completions, first])
      }

      if (event.key === 'ArrowUp' && completions && completions.length > 0) {
        event.preventDefault()
        const last = completions.pop()
        if (last) setNodeDataCompletions(id, [last, ...completions])
      }

      if (event.key === 'Tab' && completions && completions.length > 0) {
        event.preventDefault()
        setNodeDataTitle(id, completions[0])
        setLocalValue(completions[0])
        inputRef.current!.value = completions[0]
      }
    },

    [
      queryTitle,
      completions,
      loadingNodeId,
      setLoadingNodeId,
      removeNode,
      setNodeDataCompletions,
    ]
  )

  const getCompletion = () => {
    if (localValue.length === 0) return ''

    if (inputInFocus && completions && completions.length > 0)
      return completions[0].slice(localValue?.length)

    return undefined
  }

  const isQueryCorrect = completions === undefined && localValue !== ''

  return (
    <>
      <div
        style={{
          position: 'relative',
        }}
        className={`${s.inputContainer} ${isQueryCorrect ? s.error : ''}`}
      >
        <input
          ref={inputRef}
          id="text"
          name="text"
          defaultValue={title}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={s.input}
          style={{
            ...font.style,
            color:
              title.length > 1 &&
              completions.length === 0 &&
              hasReceivedAutocompletions
                ? 'red'
                : '',
          }}
          placeholder="enter a query"
          onBlur={() => setInputInFocus(false)}
          onFocus={() => setInputInFocus(true)}
        />

        <div ref={autocompletionRef} className={s.measure}>
          <span style={{ visibility: 'hidden' }}>
            {localValue || 'enter a query'}
          </span>

          <span>{getCompletion()}</span>
        </div>
      </div>
    </>
  )
}

export default Query
