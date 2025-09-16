'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, LogOut, Settings } from 'lucide-react'

export default function SellerDashboard() {
  const { data: session, status } = useSession()
  const [isSettingUpSeller, setIsSettingUpSeller] = useState(false)

  const handleBecomeSellerAuth = async () => {
    setIsSettingUpSeller(true)
    try {
      // Sign in with Google with calendar scopes
      await signIn('google', { 
        callbackUrl: '/seller?setup=true'
      })
    } catch (error) {
      console.error('Error during seller setup:', error)
      setIsSettingUpSeller(false)
    }
  }

const setupSellerRole = async () => {
  try {
    const response = await fetch('/api/seller/role', {
      method: 'POST',
    })
    
    if (response.ok) {
      const url = new URL(window.location.href)
      url.searchParams.delete('setup')
      window.location.href = url.toString()
    }
  } catch (error) {
    console.error('Error setting up seller role:', error)
  }
}


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('setup') === 'true' && session?.user) {
      setupSellerRole()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="card text-center">
              <div className="mb-6">
                <Calendar className="text-blue-600 mx-auto mb-4" size={48} />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Seller Dashboard
                </h1>
                <p className="text-gray-600">
                  Sign in with Google to access your seller dashboard and manage your calendar availability
                </p>
              </div>
              
              <button
                onClick={handleBecomeSellerAuth}
                disabled={isSettingUpSeller}
                className="btn-primary w-full mb-4"
              >
                {isSettingUpSeller ? 'Setting up...' : 'Sign in with Google'}
              </button>
              
              <Link href="/" className="btn-secondary w-full">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">
                Seller Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <Link href="/seller/appointments" className="btn-secondary">
                Appointments
              </Link>
              <button
                onClick={() => signOut()}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-900">
                Calendar Integration
              </h2>
            </div>
            
            {session.user.role === 'seller' ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">
                    Google Calendar Connected
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Your Google Calendar is connected and buyers can now see your availability and book appointments with you.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    How it works:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Buyers can see your available time slots</li>
                    <li>• Booked appointments appear in both calendars</li>
                    <li>• Google Meet links are automatically generated</li>
                    <li>• You'll receive calendar notifications</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-700 font-medium">
                    Setup Required
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete your seller setup to allow buyers to book appointments with you.
                </p>
                <button
                  onClick={setupSellerRole}
                  className="btn-primary"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/seller/appointments"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">View Appointments</h3>
                <p className="text-sm text-gray-600">
                  See all your scheduled appointments
                </p>
              </Link>
              
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">Open Google Calendar</h3>
                <p className="text-sm text-gray-600">
                  Manage your calendar directly
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}