import { Roboto, Inter, Orbitron} from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '../components/Analytics'
import { MicrosoftClarity } from '../components/Clarity'

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
      </head>
      <body className={`${orbitron.variable} ${inter.variable} ${roboto.variable}`}>
        <GoogleAnalytics />
        <MicrosoftClarity />
        {children}
      </body>
    </html>
  )
}
