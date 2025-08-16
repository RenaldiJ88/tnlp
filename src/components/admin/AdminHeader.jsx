"use client";

import { useState } from 'react'
import Link from 'next/link'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

export default function AdminHeader({ user }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { logout } = useSupabaseAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Breadcrumb could go here */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900">
            Panel de Administración
          </h2>
        </div>

        {/* Right side - User menu and actions */}
        <div className="flex items-center space-x-4">
          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="mr-2">🌐</span>
              Ver sitio
            </Link>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-sm text-gray-500">Administrador</p>
                </div>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}