'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, Clock, User, ArrowLeft } from 'lucide-react'

interface TimeSlot {
  start: string
  end: string
}

interface Seller {
  id: string
  name: string
  email: string
  image?: string
}

export default function BookAppointment({ params }: { params: { sellerId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchSeller()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability()
    }
  }, [selectedDate])

  const fetchSeller = async () => {
    try {
      const response = await fetch('/api/sellers')
      if (response.ok) {
        const sellers = await response.json()
        const foundSeller = sellers.find((s: Seller) => s.id === params.sellerId)
        setSeller(foundSeller)
      }
    } catch (error) {
      console.error('Error fetching seller:', error)
    }
  }

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/availability?sellerId=${params.sellerId}&date=${selectedDate}`
      )
      if (response.ok) {
        const slots = await response.json()
        setAvailableSlots(slots)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
  if (!selectedSlot || !title || !session?.user?.email) return

  setBookingLoading(true)
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: params.sellerId,
        title,
        description,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        buyerEmail: session.user.email,       
        sellerEmail: seller?.email,           
      }),
    })

    if (response.ok) {
      router.push('/buyer/appointments?success=true')
    } else {
      alert('Failed to book appointment. Please try again.')
    }
  } catch (error) {
    console.error('Error booking appointment:', error)
    alert('Failed to book appointment. Please try again.')
  } finally {
    setBookingLoading(false)
  }
}

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">Please sign in to book appointments</p>
          <Link href="/buyer" className="btn-primary">
            Back to Buyer Page
          </Link>
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
              <Link href="/buyer" className="btn-secondary flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Back</span>
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
        <div className="max-w-2xl mx-auto">
          {seller && (
            <div className="card mb-6">
              <div className="flex items-center space-x-4 mb-4">
                {seller.image ? (
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="text-gray-400" size={24} />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Booking with {seller.name}
                  </h2>
                  <p className="text-gray-600">{seller.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Date & Time
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No available slots for this date
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          selectedSlot === slot
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <Clock className="inline mr-1" size={14} />
                        {formatTime(slot.start)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Business Consultation"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                    className="input-field"
                  />
                </div>

                {selectedSlot && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Booking Summary
                    </h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</p>
                      <p><strong>Duration:</strong> 1 hour</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!selectedSlot || !title || bookingLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}