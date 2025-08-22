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
  description: "Especialistas en notebooks gaming, diseño y office. Llevamos hasta vos notebooks seleccionadas de alta gama. Servicio técnico especializado. La Plata, Argentina.",
  keywords: "notebooks, laptops, gaming, office, diseño, servicio técnico, La Plata, Argentina, ASUS, HP, Lenovo, MSI, Dell, Acer",
  authors: [{ name: "Tu Notebook La Plata" }],
  creator: "Tu Notebook La Plata",
  publisher: "Tu Notebook La Plata",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Tu Notebook La Plata - Especialistas en Notebooks",
    description: "Especialistas en notebooks gaming, diseño y office. Llevamos hasta vos notebooks seleccionadas de alta gama.",
    url: "https://tunotebooklp.com",
    siteName: "Tu Notebook La Plata",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Notebook La Plata - Especialistas en Notebooks",
    description: "Especialistas en notebooks gaming, diseño y office.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
          <link rel="icon" href="/img/favicon.ico" />
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.clarity.ms" />
          <link 
            rel="preload" 
            as="image" 
            href="https://res.cloudinary.com/dkj7padnu/image/upload/f_avif,q_60,w_800/v1755800448/tnlp/home/img-home.jpg"
            media="(max-width: 768px)"
            fetchpriority="high"
          />
          <link 
            rel="preload" 
            as="image" 
            href="https://res.cloudinary.com/dkj7padnu/image/upload/f_webp,q_70,w_1920/v1755800448/tnlp/home/img-home.jpg"
            media="(min-width: 769px)"
            fetchpriority="high"
          />
      </head>
      <body className={`${orbitron.variable} ${inter.variable} ${roboto.variable}`}>
        <SupabaseAuthProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-2 py-1 z-50">
            Skip to main
          </a>
          <GoogleAnalytics />
          <MicrosoftClarity />
          <div id="main-content">
            {children}
          </div>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
