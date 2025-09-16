import Link from 'next/link'
import { Calendar, Users, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Next.js Scheduler
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seamlessly connect buyers and sellers through Google Calendar integration
          </p>
          <div className="flex justify-center space-x-4">
            <Calendar className="text-blue-600" size={32} />
            <Users className="text-green-600" size={32} />
            <Clock className="text-purple-600" size={32} />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                I'm a Seller
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Google Calendar and let buyers schedule appointments with you
              </p>
            </div>
            <Link href="/seller" className="btn-primary inline-block">
              Seller Dashboard
            </Link>
          </div>
          
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                I'm a Buyer
              </h2>
              <p className="text-gray-600 mb-6">
                Find available sellers and book appointments that fit your schedule
              </p>
            </div>
            <Link href="/buyer" className="btn-primary inline-block">
              Book Appointment
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <Calendar className="text-blue-600 mx-auto mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Google Calendar Sync</h4>
              <p className="text-sm text-gray-600">Real-time availability</p>
            </div>
            <div className="text-center">
              <Users className="text-green-600 mx-auto mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Easy Booking</h4>
              <p className="text-sm text-gray-600">Simple appointment scheduling</p>
            </div>
            <div className="text-center">
              <Clock className="text-purple-600 mx-auto mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Google Meet Integration</h4>
              <p className="text-sm text-gray-600">Automatic meeting links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}