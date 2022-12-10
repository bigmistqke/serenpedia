import { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'
import s from './Loading.module.css'

function Loading() {
  const [ellipses, setEllipses] = useState('')
  let ellipsesRef = useRef('')

  useEffect(() => {
    let stop = false
    const timer = setInterval(() => {
      if (ellipsesRef.current.length < 3)
        ellipsesRef.current = ellipsesRef.current + '.'
      else ellipsesRef.current = ''
      
      setEllipses(ellipsesRef.current)
    }, 250)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <span className={s.loading}>loading{ellipses}</span>
}

export default Loading
