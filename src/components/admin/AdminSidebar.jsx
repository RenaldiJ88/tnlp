"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '📊',
      description: 'Vista general'
    },
    {
      name: 'Productos',
      href: '/admin/productos',
      icon: '💻',
      description: 'Gestión de productos'
    },
    {
      name: 'Servicios Técnicos',
      href: '/admin/servicios-tecnicos',
      icon: '🔧',
      description: 'Reparaciones y mantenimiento'
    },
    {
      name: 'Configuración',
      href: '/admin/configuracion',
      icon: '⚙️',
      description: 'Ajustes del sitio'
    }
  ]

  return (
    <motion.div
      className={`bg-gray-900 text-white ${
        isMobile 
          ? (isCollapsed ? 'w-12' : 'w-48') 
          : (isCollapsed ? 'w-16' : 'w-64')
      } transition-all duration-300 min-h-screen relative lg:static`}
      initial={false}
      animate={{ 
        width: isMobile 
          ? (isCollapsed ? 48 : 192)
          : (isCollapsed ? 64 : 256)
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-xl font-bold">TNLP Admin</h1>
              <p className="text-gray-400 text-sm">Panel de control</p>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <motion.div
                      className="ml-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>


    </motion.div>
  )
}