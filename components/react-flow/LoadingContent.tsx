import { useEffect, useRef, useState } from 'react'
import { useCallback } from 'react'

function LoadingContent() {
  const [ellipses, setEllipses] = useState('')
  let ellipsesRef = useRef('')

  useEffect(() => {
    let stop = false
    const timer = setInterval(() => {
      if (ellipsesRef.current.length < 3)
        ellipsesRef.current = ellipsesRef.current + '.'
      else ellipsesRef.current = ''
      console.log('timer')
      setEllipses(ellipsesRef.current)
    }, 250)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <span style={{ display: 'flex' }}>loading{ellipses}</span>
}

export default LoadingContent
