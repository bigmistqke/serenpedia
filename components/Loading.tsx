import { useEffect, useRef, useState } from 'react'

function Loading({ className }: { className?: string }) {
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

  return <span className={className}>loading{ellipses}</span>
}

export default Loading
