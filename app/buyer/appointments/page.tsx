'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, LogOut, User, Clock, ExternalLink, CheckCircle } from 'lucide-react'

interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  status: string
  meetingLink?: string
  seller: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export default function BuyerAppointments() {
  const { data: session, status } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Check for success parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }

    if (session) {
      fetchAppointments()
    }
  }, [session])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Please sign in to view appointments</p>
          <Link href="/buyer" className="btn-primary">
            Go to Buyer Page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSuccess && (
        <div className="bg-green-500 text-white px-4 py-3">
          <div className="container mx-auto flex items-center justify-center space-x-2">
            <CheckCircle size={20} />
            <span>Appointment booked successfully! Check your Google Calendar.</span>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="text-green-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">
                My Appointments
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/buyer" className="btn-secondary">
                Book New
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Scheduled Appointments
          </h2>
          <p className="text-gray-600">
            View and manage your upcoming appointments
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments booked yet
            </h3>
            <p className="text-gray-600 mb-6">
              Browse available sellers and book your first appointment
            </p>
            <Link href="/buyer" className="btn-primary">
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const startDateTime = formatDateTime(appointment.startTime)
              const endDateTime = formatDateTime(appointment.endTime)
              
              return (
                <div key={appointment.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {appointment.title}
                          </h3>
                          {appointment.description && (
                            <p className="text-gray-600 mb-3">
                              {appointment.description}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-400" size={16} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {startDateTime.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              {startDateTime.time} - {endDateTime.time}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="text-gray-400" size={16} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.seller.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.seller.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {appointment.meetingLink && (
                        <div className="pt-4 border-t border-gray-200">
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700"
                          >
                            <ExternalLink size={16} />
                            <span className="text-sm font-medium">
                              Join Google Meet
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}