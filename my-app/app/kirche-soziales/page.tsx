'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, Heart, MapPin, Clock, Phone, Mail, 
  Users, Calendar, Info, Star, ExternalLink,
  Cross, HandHeart, Baby, GraduationCap, Home,
  Shield, Globe, BookOpen, Music, Coffee, Play,
  Bell, MessageSquare, UserPlus, Video, Radio
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  category: 'kirche' | 'sozial' | 'bildung' | 'beratung'
  contact: {
    phone?: string
    email?: string
    address: string
  }
  openingHours: string[]
  image: string
  isEmergency?: boolean
  website?: string
}

const services: Service[] = [
  {
    id: 'dom-gottesdienst',
    title: 'Dom St. Blasii - Gottesdienste',
    description: 'Zentrale Gottesdienste im historischen Braunschweiger Dom mit jahrhundertelanger Tradition',
    category: 'kirche',
    contact: {
      phone: '0531 24320',
      email: 'info@dom-braunschweig.de',
      address: 'Domplatz 5, 38100 Braunschweig'
    },
    openingHours: [
      'Sonntag: 10:00 - 11:30 Uhr (Gottesdienst)',
      'Mittwoch: 19:00 - 19:30 Uhr (Abendandacht)',
      'Täglich: 9:00 - 18:00 Uhr (Besichtigung)'
    ],
    image: '/dom st blasii.jpeg'
  },
  {
    id: 'st-magni-gemeinde',
    title: 'St. Magni Gemeinde',
    description: 'Lebendige Kirchengemeinde mit vielfältigen Angeboten für alle Altersgruppen',
    category: 'kirche',
    contact: {
      phone: '0531 45678',
      email: 'gemeinde@st-magni.de',
      address: 'Magnitorwall 8, 38100 Braunschweig'
    },
    openingHours: [
      'Sonntag: 9:30 - 10:30 Uhr (Gottesdienst)',
      'Dienstag: 15:00 - 17:00 Uhr (Seniorenkreis)',
      'Donnerstag: 19:00 - 20:30 Uhr (Jugendgruppe)'
    ],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=250&fit=crop'
  },
  {
    id: 'caritas-beratung',
    title: 'Caritas Beratungszentrum',
    description: 'Professionelle Sozialberatung, Schuldnerberatung und Familienhilfe',
    category: 'beratung',
    contact: {
      phone: '0531 70050',
      email: 'beratung@caritas-braunschweig.de',
      address: 'Steinweg 5, 38100 Braunschweig'
    },
    openingHours: [
      'Mo-Fr: 8:00 - 17:00 Uhr',
      'Notfall-Hotline: 0531 70050 (24h)'
    ],
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=250&fit=crop',
    isEmergency: true
  },
  {
    id: 'diakonie-tafel',
    title: 'Braunschweiger Tafel',
    description: 'Lebensmittelausgabe für bedürftige Menschen und Familien',
    category: 'sozial',
    contact: {
      phone: '0531 61234',
      email: 'info@tafel-braunschweig.de',
      address: 'Wilhelmitorwall 15, 38100 Braunschweig'
    },
    openingHours: [
      'Dienstag: 14:00 - 16:00 Uhr',
      'Donnerstag: 14:00 - 16:00 Uhr',
      'Samstag: 10:00 - 12:00 Uhr'
    ],
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop'
  },
  {
    id: 'familienzentrum',
    title: 'Ev. Familienzentrum Weststadt',
    description: 'Kinderbetreuung, Eltern-Kind-Gruppen und Familienberatung',
    category: 'bildung',
    contact: {
      phone: '0531 87654',
      email: 'familienzentrum@kirche-bs.de',
      address: 'Weststraße 25, 38100 Braunschweig'
    },
    openingHours: [
      'Mo-Fr: 7:00 - 17:00 Uhr (Kita)',
      'Mittwoch: 15:00 - 17:00 Uhr (Beratung)',
      'Samstag: 10:00 - 12:00 Uhr (Familiengruppe)'
    ],
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop'
  },
  {
    id: 'telefonseelsorge',
    title: 'Telefonseelsorge Braunschweig',
    description: '24-Stunden-Beratung bei persönlichen Krisen und Problemen',
    category: 'beratung',
    contact: {
      phone: '0800 111 0 111',
      email: 'info@telefonseelsorge-bs.de',
      address: 'Vertraulich'
    },
    openingHours: [
      '24 Stunden täglich erreichbar',
      'Kostenlos aus allen deutschen Netzen'
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    isEmergency: true
  }
]

export default function KircheSozialesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'services' | 'gottesdienst' | 'hilfe'>('services')

  // Beispiel Live-Gottesdienst Daten
  const liveService = {
    title: 'Sonntagsgottesdienst',
    church: 'Dom St. Blasii',
    isLive: true,
    viewers: 142,
    nextService: '2025-09-29 10:00'
  }

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'kirche': return 'bg-blue-500'
      case 'sozial': return 'bg-green-500'
      case 'bildung': return 'bg-purple-500'
      case 'beratung': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'kirche': return 'Kirche'
      case 'sozial': return 'Soziale Hilfe'
      case 'bildung': return 'Bildung & Familie'
      case 'beratung': return 'Beratung'
      default: return category
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'kirche': return <Cross className="w-4 h-4" />
      case 'sozial': return <HandHeart className="w-4 h-4" />
      case 'bildung': return <GraduationCap className="w-4 h-4" />
      case 'beratung': return <Shield className="w-4 h-4" />
      default: return <Heart className="w-4 h-4" />
    }
  }

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  const makePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-teal-600 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
          </div>
          <div className="text-center">
            <Heart className="w-8 h-8 mx-auto mb-2" />
            <h1 className="text-2xl font-bold mb-2">Kirche & Soziales</h1>
            <p className="text-teal-100">Gemeinde, Hilfe und Beratung in Braunschweig</p>
          </div>
        </div>

        {/* Emergency Hotline */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-r-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Notfall-Hilfe</h3>
              <p className="text-sm text-red-600">24h Telefonseelsorge: 0800 111 0 111</p>
            </div>
            <button
              onClick={() => makePhoneCall('0800 111 0 111')}
              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
            >
              Anrufen
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 pt-4">
          <div className="flex gap-1 overflow-x-auto pb-4">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-teal-100 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              Services
            </button>
            <button
              onClick={() => setActiveTab('gottesdienst')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'gottesdienst'
                  ? 'bg-teal-100 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Music className="w-4 h-4" />
              Gottesdienste
            </button>
            <button
              onClick={() => setActiveTab('hilfe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'hilfe'
                  ? 'bg-teal-100 text-teal-700 border border-teal-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HandHeart className="w-4 h-4" />
              Nachbarschaftshilfe
            </button>
          </div>
        </div>

        {/* Services Tab Content */}
        {activeTab === 'services' && (
          <>
            {/* Filter */}
            <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === 'all' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              Alle Angebote
            </button>
            {['kirche', 'sozial', 'bildung', 'beratung'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === category 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryIcon(category)}
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="p-4 space-y-4 pb-24">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Service Image */}
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`${getCategoryColor(service.category)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                    {getCategoryIcon(service.category)}
                    {getCategoryLabel(service.category)}
                  </span>
                </div>
                {service.isEmergency && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      24h Hilfe
                    </div>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{service.contact.address}</span>
                  </div>
                  {service.contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">{service.contact.phone}</span>
                    </div>
                  )}
                  {service.contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">{service.contact.email}</span>
                    </div>
                  )}
                </div>

                {/* Opening Hours */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Öffnungszeiten:
                  </h4>
                  <div className="space-y-1">
                    {service.openingHours.map((hours, index) => (
                      <p key={index} className="text-xs text-gray-600">{hours}</p>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {service.contact.phone && (
                    <button
                      onClick={() => makePhoneCall(service.contact.phone!)}
                      className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      Anrufen
                    </button>
                  )}
                  <button
                    onClick={() => openGoogleMaps(service.contact.address)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    Route
                  </button>
                  {service.contact.email && (
                    <button
                      onClick={() => sendEmail(service.contact.email!)}
                      className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3">
          <div className="text-center text-sm text-gray-600">
            {filteredServices.length} {filteredServices.length === 1 ? 'Angebot verfügbar' : 'Angebote verfügbar'}
          </div>
        </div>
          </>
        )}

        {/* Gottesdienst Tab Content */}
        {activeTab === 'gottesdienst' && (
          <div className="p-4 space-y-4">
            {/* Live Gottesdienst */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600">LIVE</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {liveService.viewers} Zuschauer
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{liveService.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{liveService.church}</p>
              
              <div className="flex gap-2">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-700">
                  <Play className="w-4 h-4" />
                  Live ansehen
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-300">
                  <Bell className="w-4 h-4" />
                  Erinnerung
                </button>
              </div>
            </div>

            {/* Kommende Gottesdienste */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Kommende Gottesdienste</h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Abendandacht</h4>
                    <p className="text-sm text-gray-600">St. Magni Kirche</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">Morgen</p>
                    <p className="text-sm text-gray-600">19:00 Uhr</p>
                  </div>
                </div>
                <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                  Erinnerung setzen
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Jugendgottesdienst</h4>
                    <p className="text-sm text-gray-600">Christuskirche</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">Samstag</p>
                    <p className="text-sm text-gray-600">18:00 Uhr</p>
                  </div>
                </div>
                <button className="w-full bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100">
                  Teilnehmen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hilfe Tab Content */}
        {activeTab === 'hilfe' && (
          <div className="p-4 space-y-4">
            {/* Hilfe anbieten Button */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 text-center">
              <HandHeart className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-800 mb-2">Helfen Sie mit!</h3>
              <p className="text-sm text-gray-600 mb-3">Bieten Sie Ihre Hilfe in der Nachbarschaft an</p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                Hilfe anbieten
              </button>
            </div>

            {/* Aktuelle Hilfe-Anfragen */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Aktuelle Hilfe-Anfragen</h3>
              
              <div className="bg-white border border-orange-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">Einkaufshilfe benötigt</h4>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Mittel</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Weststadt • 0.8 km entfernt</p>
                    <p className="text-sm text-gray-700 mb-3">Benötige Hilfe beim Wocheneinkauf für ältere Dame</p>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Helfen
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Nachfragen
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">Fahrt zum Arzttermin</h4>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Hoch</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Innenstadt • 1.2 km entfernt</p>
                    <p className="text-sm text-gray-700 mb-3">Benötige Fahrt zum Hausarzt morgen um 14:00</p>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Helfen
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Anrufen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verfügbare Helfer */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Helfer in Ihrer Nähe</h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Thomas B.</h4>
                    <p className="text-sm text-gray-600">0.5 km • 23 mal geholfen</p>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-500 rounded-full mb-1"></div>
                    <p className="text-xs text-gray-600">Verfügbar</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Hilft bei: Einkaufen, Transport, Gartenarbeit</p>
                <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                  Kontaktieren
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}