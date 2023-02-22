import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { hotjar } from 'react-hotjar'
import * as gtag from '../lib/gtag'
import { useRouter } from 'next/router'

import { Inconsolata } from '@next/font/google'

import '../styles/globals.css'
import './index.css'
import './wikipedia.css'
import EmbedSocial from '../components/EmbedSocial'

const font = Inconsolata({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const [isEmbedSocialHidden, setIsEmbedSocialHidden] = useState(true)

  // show EmbedSocial after 30 seconds
  useEffect(() => {
    setTimeout(() => setIsEmbedSocialHidden(false), 30000)
  }, [])

  // hotjar initialization
  useEffect(() => {
    hotjar.initialize(3313468, 6)
  }, [])

  // google analytics: handle route-events
  useEffect(() => {
    const handleRouteChange = (url: string) => gtag.pageview(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <main className={font.className}>
      <EmbedSocial hidden={isEmbedSocialHidden} />
      <Component {...pageProps} />
    </main>
  )
}
