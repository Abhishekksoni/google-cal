'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, LogOut, Search, User } from 'lucide-react'

interface Seller {
  id: string
  name: string
  email: string
  image?: string
}

export default function BuyerPage() {
  const { data: session, status } = useSession()
  const [sellers, setSellers] = useState<Seller[]>([])
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = sellers.filter(seller => 
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSellers(filtered)
    } else {
      setFilteredSellers(sellers)
    }
  }, [searchTerm, sellers])

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/sellers')
      if (response.ok) {
        const data = await response.json()
        setSellers(data)
        setFilteredSellers(data)
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="card text-center">
              <div className="mb-6">
                <Calendar className="text-green-600 mx-auto mb-4" size={48} />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Book an Appointment
                </h1>
                <p className="text-gray-600">
                  Sign in with Google to browse available sellers and book appointments
                </p>
              </div>
              
              <button
                onClick={() => signIn('google', { callbackUrl: '/buyer' })}
                className="btn-primary w-full mb-4"
              >
                Sign in with Google
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
              <Calendar className="text-green-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
              <Link href="/buyer/appointments" className="btn-secondary">
                My Appointments
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Sellers
          </h2>
          <p className="text-gray-600 mb-6">
            Choose a seller to view their available time slots and book an appointment
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {filteredSellers.length === 0 ? (
          <div className="card text-center py-12">
            <User className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No sellers found' : 'No sellers available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check back later for available sellers'
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <div key={seller.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  {seller.image ? (
                    <Image
                      src={seller.image}
                      alt={seller.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="text-gray-400" size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {seller.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {seller.email}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href={`/buyer/book/${seller.id}`}
                    className="btn-primary w-full text-center"
                  >
                    View Availability
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}