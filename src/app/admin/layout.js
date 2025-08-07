import { Inter } from 'next/font/google'
import AdminAuthWrapper from '../../components/admin/AdminAuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TNLP - Panel de Administración',
  description: 'Panel de administración para Tu Notebook La Plata',
}

export default function AdminLayout({ children }) {
  return (
    <div className={inter.className}>
      <AdminAuthWrapper>
        {children}
      </AdminAuthWrapper>
    </div>
  )
}