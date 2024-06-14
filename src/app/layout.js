import './globals.css'
export const metadata = {
  title: "Tu Notebook La Patla",  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  )
}
