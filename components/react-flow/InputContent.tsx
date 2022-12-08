import { ChangeEvent, useCallback, useEffect, useRef } from 'react'
import useStore from '../../store'
import when from '../../utils/when'
import lookUp from '../../utils/wikipedia/lookUp'
import s from './InputContent.module.css'

// pages/_app.js
import { Inconsolata } from '@next/font/google'

// If loading a variable font, you don't need to specify the font weight
const font = Inconsolata({ subsets: ['latin'] })

function InputContent({ id, title }: { id: string; title: string }) {
  const {
    nodes,
    setNodeDataTitle,
    createLoadingNode,
    setNodeDataSelf,
    setNodeDataRelateds,
    setNodeDataType,
    setNodeDataOptions,
  } = useStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (title === '') {
      spanRef.current!.innerText = (
        inputRef.current! as HTMLInputElement
      ).placeholder
      inputRef.current!.style.width = spanRef.current!.offsetWidth + 'px'
    }
  }, [])

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      if ((evt.target as HTMLInputElement)?.value === '') {
        spanRef.current!.innerText = (
          evt.target as HTMLInputElement
        )?.placeholder
        inputRef.current!.style.width = spanRef.current!.offsetWidth + 'px'
      } else {
        spanRef.current!.innerText = (evt.target as HTMLInputElement)?.value
      }
      inputRef.current!.style.width = spanRef.current!.offsetWidth + 'px'
      setNodeDataTitle(id, (evt.target as HTMLInputElement)?.value)
    },
    [setNodeDataTitle, id]
  )

  useEffect(() => {
    if (inputRef.current && spanRef.current)
      setTimeout(
        () =>
          (inputRef.current!.style.width = spanRef.current!.offsetWidth + 'px'),
        0
      )
  })

  const onKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const width = inputRef.current?.offsetWidth
        if (!width) {
          console.error('width of inputRef is undefined')
          return
        }

        setNodeDataType(id, 'normal')
        //  TODO: this is a hack
        //  need a better state machine
        setNodeDataSelf(id, { title, html: '', thumbnail: '' })

        const position = nodes.find((node) => node.id === id)?.position

        when(
          position &&
            inputRef.current.parentElement &&
            createLoadingNode(id, {
              x: position.x + inputRef.current.parentElement.offsetWidth + 50,
              y: position.y,
            }),
          await lookUp(title)
        ).then((newId, { self, relateds }) => {
          setNodeDataType(id, 'normal')
          setNodeDataSelf(id, self)

          setNodeDataRelateds(id, relateds)

          setNodeDataType(newId, 'select')
          setNodeDataOptions(newId, relateds)
        })
      }
    },
    [
      nodes,
      id,
      createLoadingNode,
      title,
      setNodeDataType,
      setNodeDataRelateds,
      setNodeDataSelf,
      setNodeDataOptions,
      inputRef,
    ]
  )

  return (
    <>
      <input
        ref={inputRef}
        id="text"
        name="text"
        defaultValue={title}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={s.input}
        style={font.style}
        placeholder="enter a searchterm"
      />
      <span ref={spanRef} className={s.measure} />
    </>
  )
}

export default InputContent
