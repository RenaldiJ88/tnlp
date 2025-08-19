import { Roboto, Inter, Orbitron} from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '../components/Analytics'
import { MicrosoftClarity } from '../components/Clarity'
import { SupabaseAuthProvider } from '../hooks/useSupabaseAuth'

const roboto = Roboto({
  subsets: ['latin'],
  variable: "--font-roboto",
  weight: ["500"]
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: "--font-orbitron",
  weight: ["400", "600", "700"]
})

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-inter",
  weight: ["400", "700"]
})


export const metadata = {
  title: "Tu Notebook La Plata",  
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
          <link rel="icon" href="/img/favicon.ico" />
          <link 
            rel="preload" 
            as="image" 
            href="/img/home/note-home.webp"
            media="(max-width: 768px)"
            type="image/webp"
          />
          <link 
            rel="preload" 
            as="image" 
            href="/img/home/note-home.avif"
            media="(max-width: 768px)"
            type="image/avif"
          />
          <link 
            rel="preload" 
            as="image" 
            href="/img/home/img-home.webp"
            media="(max-width: 768px)"
            type="image/webp"
          />
          <link 
            rel="preload" 
            as="image" 
            href="/img/home/img-home.avif"
            media="(max-width: 768px)"
            type="image/avif"
          />
      </head>
      <body className={`${orbitron.variable} ${inter.variable} ${roboto.variable}`}>
        <SupabaseAuthProvider>
          <GoogleAnalytics />
          <MicrosoftClarity />
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
