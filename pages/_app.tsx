import '../styles/globals.css'
import type { AppProps } from 'next/app'
import './index.css'
import './wikipedia.css'

// pages/_app.js
import { Inconsolata } from '@next/font/google'

// If loading a variable font, you don't need to specify the font weight
const font = Inconsolata({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  )
}
