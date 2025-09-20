'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, MapPin, Clock, Users, Star, Calendar,
  Euro, Info, Camera, Heart, CheckCircle
} from 'lucide-react'

interface Tour {
  id: string
  title: string
  description: string
  duration: string
  price: number
  rating: number
  maxParticipants: number
  currentBookings: number
  highlights: string[]
  image: string
  guide: {
    name: string
    experience: string
    languages: string[]
  }
  availableDates: string[]
  category: 'historic' | 'cultural' | 'nature' | 'culinary'
}

const tours: Tour[] = [
  {
    id: 'loewenstadt-klassik',
    title: 'Löwenstadt Klassik',
    description: 'Entdecken Sie die historischen Highlights von Braunschweig mit Heinrich dem Löwen',
    duration: '2 Stunden',
    price: 15,
    rating: 4.8,
    maxParticipants: 20,
    currentBookings: 12,
    highlights: ['Dom St. Blasii', 'Burg Dankwarderode', 'Löwenstatue', 'Altstadtmarkt'],
    image: 'https://images.unsplash.com/photo-1595846352900-2b5e8db3d5cc?w=400&h=250&fit=crop',
    guide: {
      name: 'Dr. Maria Schneider',
      experience: '15 Jahre Stadtführung',
      languages: ['Deutsch', 'Englisch']
    },
    availableDates: ['2025-09-20', '2025-09-21', '2025-09-22'],
    category: 'historic'
  },
  {
    id: 'kulturmeile-tour',
    title: 'Kulturmeile & Museen',
    description: 'Kunst, Kultur und Geschichte - ein Rundgang durch Braunschweigs Kulturlandschaft',
    duration: '2.5 Stunden',
    price: 18,
    rating: 4.6,
    maxParticipants: 15,
    currentBookings: 8,
    highlights: ['Herzog Anton Ulrich-Museum', 'Staatstheater', 'Kunstverein', 'Happy Rizzi House'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=250&fit=crop',
    guide: {
      name: 'Thomas Mueller',
      experience: '12 Jahre Kulturführung',
      languages: ['Deutsch', 'Englisch', 'Französisch']
    },
    availableDates: ['2025-09-20', '2025-09-23', '2025-09-24'],
    category: 'cultural'
  },
  {
    id: 'gruen-tour',
    title: 'Grünes Braunschweig',
    description: 'Parks, Gärten und Naturerlebnisse in der Löwenstadt',
    duration: '1.5 Stunden',
    price: 12,
    rating: 4.4,
    maxParticipants: 25,
    currentBookings: 15,
    highlights: ['Bürgerpark', 'Botanischer Garten', 'Prinz-Albrecht-Park', 'Oker-Ufer'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
    guide: {
      name: 'Anna Hoffmann',
      experience: '8 Jahre Naturführung',
      languages: ['Deutsch']
    },
    availableDates: ['2025-09-21', '2025-09-22', '2025-09-25'],
    category: 'nature'
  },
  {
    id: 'kulinarik-tour',
    title: 'Kulinarisches Braunschweig',
    description: 'Genießen Sie lokale Spezialitäten und lernen Sie die Gastronomieszene kennen',
    duration: '3 Stunden',
    price: 35,
    rating: 4.9,
    maxParticipants: 12,
    currentBookings: 9,
    highlights: ['Traditionsbrauerei', 'Lokale Märkte', 'Spezialitäten-Verkostung', 'Bratwurst-Museum'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
    guide: {
      name: 'Chef Klaus Weber',
      experience: '20 Jahre Gastronomie',
      languages: ['Deutsch', 'Englisch']
    },
    availableDates: ['2025-09-22', '2025-09-24', '2025-09-26'],
    category: 'culinary'
  }
]

export default function StadtfuehrungenPage() {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [participants, setParticipants] = useState<number>(1)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')



  const filteredTours = filterCategory === 'all' 
    ? tours 
    : tours.filter(tour => tour.category === filterCategory)

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'historic': return 'bg-amber-500'
      case 'cultural': return 'bg-purple-500'
      case 'nature': return 'bg-green-500'
      case 'culinary': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'historic': return 'Historisch'
      case 'cultural': return 'Kultur'
      case 'nature': return 'Natur'
      case 'culinary': return 'Kulinarik'
      default: return category
    }
  }

  const handleBookTour = (tour: Tour) => {
    setSelectedTour(tour)
    setShowBookingForm(true)
  }

  const confirmBooking = () => {
    // Hier würde die echte Buchungslogik implementiert
    alert(`Buchung bestätigt für ${selectedTour?.title} am ${selectedDate} für ${participants} Person(en)`)
    setShowBookingForm(false)
    setSelectedTour(null)
    setSelectedDate('')
    setParticipants(1)
  }

  if (showBookingForm && selectedTour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4">
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => setShowBookingForm(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">Buchung</h1>
            </div>
          </div>

          {/* Booking Form */}
          <div className="p-4 space-y-6">
            {/* Tour Info */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-lg mb-2">{selectedTour.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTour.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4" />
                  <span>{selectedTour.price}€ pro Person</span>
                </div>
              </div>
              <p className="text-gray-700">{selectedTour.description}</p>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h4 className="font-semibold mb-3">Datum wählen</h4>
              <div className="space-y-2">
                {selectedTour.availableDates.map(date => (
                  <label key={date} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="date"
                      value={date}
                      checked={selectedDate === date}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-indigo-600"
                    />
                    <span className="font-medium">
                      {new Date(date).toLocaleDateString('de-DE', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h4 className="font-semibold mb-3">Teilnehmer</h4>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-xl font-bold">{participants}</span>
                <button
                  onClick={() => setParticipants(Math.min(selectedTour.maxParticipants - selectedTour.currentBookings, participants + 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
                <span className="text-sm text-gray-600 ml-2">
                  (max. {selectedTour.maxParticipants - selectedTour.currentBookings} verfügbar)
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Gesamtpreis:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {selectedTour.price * participants}€
                </span>
              </div>
            </div>

            {/* Booking Button */}
            <button
              onClick={confirmBooking}
              disabled={!selectedDate}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              Jetzt buchen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
          </div>
          <p className="text-indigo-100">Entdecken Sie Braunschweig mit unseren erfahrenen Guides</p>
        </div>

        {/* Filter */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                filterCategory === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle Touren
            </button>
            {['historic', 'cultural', 'nature', 'culinary'].map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  filterCategory === category 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Tours List */}
        <div className="p-4 space-y-4 pb-24">
          {filteredTours.map(tour => (
            <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tour Image */}
              <div className="relative h-48">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`${getCategoryColor(tour.category)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                    {getCategoryLabel(tour.category)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{tour.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tour Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{tour.description}</p>

                {/* Tour Details */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{tour.maxParticipants - tour.currentBookings} Plätze frei</span>
                  </div>
                </div>

                {/* Guide Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {tour.guide.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tour.guide.name}</p>
                      <p className="text-xs text-gray-500">{tour.guide.experience}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {tour.guide.languages.map(lang => (
                      <span key={lang} className="bg-white px-2 py-1 rounded text-xs text-gray-600">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Tour-Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.map(highlight => (
                      <span key={highlight} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">{tour.price}€</span>
                    <span className="text-sm text-gray-500"> pro Person</span>
                  </div>
                  <button
                    onClick={() => handleBookTour(tour)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Buchen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation Placeholder */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3">
          <div className="text-center text-sm text-gray-600">
            {filteredTours.length} {filteredTours.length === 1 ? 'Tour verfügbar' : 'Touren verfügbar'}
          </div>
        </div>
      </div>
    </div>
  )
}