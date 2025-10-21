'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, Home, MapPin, Euro, Bed, Bath, 
  Square, Heart, Phone, Mail, ExternalLink,
  Filter, Search, Star, Calendar, Key,
  TrendingUp, TrendingDown, Users, Car,
  Wifi, Thermometer, Shield, CheckCircle
} from 'lucide-react'

interface Property {
  id: string
  title: string
  type: 'rent' | 'buy' | 'sell'
  category: 'apartment' | 'house' | 'commercial'
  price: number
  priceType: '€/Monat' | '€' | 'VB'
  address: string
  district: string
  size: number
  rooms: number
  bathrooms?: number
  features: string[]
  description: string
  images: string[]
  contact: {
    name: string
    phone: string
    email: string
    company?: string
  }
  isNew?: boolean
  isFeatured?: boolean
  rating?: number
  available: string
}

const properties: Property[] = [
  {
    id: 'apartment-weststadt-1',
    title: 'Moderne 3-Zimmer-Wohnung in der Weststadt',
    type: 'rent',
    category: 'apartment',
    price: 890,
    priceType: '€/Monat',
    address: 'Wilhelmstraße 45, 38100 Braunschweig',
    district: 'Weststadt',
    size: 85,
    rooms: 3,
    bathrooms: 1,
    features: ['Balkon', 'Einbauküche', 'Parkett', 'Zentralheizung'],
    description: 'Helle und moderne Wohnung in beliebter Wohnlage mit guter Anbindung an die Innenstadt.',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop'],
    contact: {
      name: 'Sarah Weber',
      phone: '0531 123456',
      email: 'weber@immobilien-bs.de',
      company: 'Immobilien Weber'
    },
    isNew: true,
    available: 'Sofort verfügbar'
  },
  {
    id: 'house-riddagshausen-1',
    title: 'Einfamilienhaus mit Garten in Riddagshausen',
    type: 'buy',
    category: 'house',
    price: 485000,
    priceType: '€',
    address: 'Am Riddagshäuser Teich 12, 38110 Braunschweig',
    district: 'Riddagshausen',
    size: 140,
    rooms: 5,
    bathrooms: 2,
    features: ['Garten', 'Garage', 'Keller', 'Terrasse', 'Kamin'],
    description: 'Gepflegtes Einfamilienhaus in ruhiger Lage nahe dem Naturschutzgebiet Riddagshausen.',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop'],
    contact: {
      name: 'Michael Schmidt',
      phone: '0531 789012',
      email: 'schmidt@hausverkauf-bs.de',
      company: 'Braunschweiger Immobilien'
    },
    isFeatured: true,
    rating: 4.8,
    available: 'Nach Vereinbarung'
  },
  {
    id: 'apartment-innenstadt-2',
    title: '2-Zimmer-Wohnung in der Altstadt',
    type: 'rent',
    category: 'apartment',
    price: 650,
    priceType: '€/Monat',
    address: 'Kohlmarkt 8, 38100 Braunschweig',
    district: 'Innenstadt',
    size: 55,
    rooms: 2,
    bathrooms: 1,
    features: ['Altbau-Charme', 'Hohe Decken', 'Zentrale Lage'],
    description: 'Charmante Altbauwohnung im Herzen der Stadt, wenige Gehminuten vom Dom entfernt.',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop'],
    contact: {
      name: 'Anna Müller',
      phone: '0531 345678',
      email: 'mueller@altstadt-wohnen.de'
    },
    available: 'Ab 01.11.2025'
  },
  {
    id: 'commercial-downtown-1',
    title: 'Ladenfläche in bester Innenstadtlage',
    type: 'rent',
    category: 'commercial',
    price: 1800,
    priceType: '€/Monat',
    address: 'Damm 15, 38100 Braunschweig',
    district: 'Innenstadt',
    size: 120,
    rooms: 3,
    features: ['Schaufenster', 'Lager', 'Kundentoilette', 'Klimaanlage'],
    description: 'Attraktive Gewerbefläche in der Fußgängerzone, ideal für Einzelhandel oder Dienstleistung.',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop'],
    contact: {
      name: 'Thomas Klein',
      phone: '0531 567890',
      email: 'klein@gewerbe-bs.de',
      company: 'City Immobilien'
    },
    isFeatured: true,
    available: 'Sofort verfügbar'
  },
  {
    id: 'house-lehndorf-sell',
    title: 'Verkaufe Reihenhaus in Lehndorf',
    type: 'sell',
    category: 'house',
    price: 320000,
    priceType: 'VB',
    address: 'Lehndorfer Straße 67, 38116 Braunschweig',
    district: 'Lehndorf',
    size: 110,
    rooms: 4,
    bathrooms: 1,
    features: ['Renoviert', 'Carport', 'Garten', 'Keller'],
    description: 'Liebevoll renoviertes Reihenhaus in familienfreundlicher Umgebung mit guter Infrastruktur.',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop'],
    contact: {
      name: 'Familie Hoffmann',
      phone: '0531 234567',
      email: 'hoffmann.family@email.de'
    },
    available: 'Nach Vereinbarung'
  },
  {
    id: 'apartment-viewegs-garten',
    title: 'Penthouse mit Dachterrasse',
    type: 'buy',
    category: 'apartment',
    price: 280000,
    priceType: '€',
    address: 'Viewegs Garten 25, 38100 Braunschweig',
    district: 'Viewegs Garten',
    size: 95,
    rooms: 3,
    bathrooms: 2,
    features: ['Dachterrasse', 'Aufzug', 'TG-Stellplatz', 'Fußbodenheizung'],
    description: 'Exklusives Penthouse mit großer Dachterrasse und Blick über die Stadt.',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop'],
    contact: {
      name: 'Dr. Petra Lange',
      phone: '0531 876543',
      email: 'lange@premium-immobilien.de',
      company: 'Premium Immobilien Braunschweig'
    },
    isFeatured: true,
    rating: 4.9,
    available: 'Sofort verfügbar'
  }
]

export default function WohnenPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')



  const filteredProperties = properties.filter(property => {
    const matchesType = selectedType === 'all' || property.type === selectedType
    const matchesCategory = selectedCategory === 'all' || property.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.district.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesCategory && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'rent': return 'bg-blue-500'
      case 'buy': return 'bg-green-500'
      case 'sell': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'rent': return 'Mieten'
      case 'buy': return 'Kaufen'
      case 'sell': return 'Verkaufen'
      default: return type
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'apartment': return '🏠'
      case 'house': return '🏡'
      case 'commercial': return '🏢'
      default: return '🏠'
    }
  }

  const formatPrice = (price: number, priceType: string) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ${priceType}`
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k ${priceType}`
    }
    return `${price} ${priceType}`
  }

  const makePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self')
  }

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
          </div>
          <div className="text-center">
            <Home className="w-8 h-8 mx-auto mb-2" />
            <h1 className="text-2xl font-bold mb-2">Wohnen in Braunschweig</h1>
            <p className="text-amber-100">Finden Sie Ihr neues Zuhause</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Stadtteil oder Objekt suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedType === 'all' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle Angebote
            </button>
            <button
              onClick={() => setSelectedType('rent')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedType === 'rent' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mieten
            </button>
            <button
              onClick={() => setSelectedType('buy')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedType === 'buy' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kaufen
            </button>
            <button
              onClick={() => setSelectedType('sell')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedType === 'sell' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verkaufen
            </button>
          </div>
        </div>

        {/* Properties List */}
        <div className="p-4 space-y-4 pb-24">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Property Image */}
              <div className="relative h-48">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`${getTypeColor(property.type)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                    {getTypeLabel(property.type)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {property.isNew && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      NEU
                    </div>
                  )}
                  {property.isFeatured && (
                    <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      TOP
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                    {formatPrice(property.price, property.priceType)}
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg flex-1">{property.title}</h3>
                  <span className="text-lg ml-2">{getCategoryIcon(property.category)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.district}</span>
                  {property.rating && (
                    <>
                      <Star className="w-4 h-4 text-yellow-500 fill-current ml-2" />
                      <span>{property.rating}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{property.description}</p>

                {/* Property Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    <span>{property.size}m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.rooms} Zimmer</span>
                  </div>
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} Bad</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map(feature => (
                      <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{property.features.length - 3} weitere
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{property.contact.name}</p>
                      {property.contact.company && (
                        <p className="text-xs text-gray-500">{property.contact.company}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.available}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => makePhoneCall(property.contact.phone)}
                      className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      Anrufen
                    </button>
                    <button
                      onClick={() => sendEmail(property.contact.email)}
                      className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openGoogleMaps(property.address)}
                      className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3">
          <div className="text-center text-sm text-gray-600">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'Immobilie gefunden' : 'Immobilien gefunden'}
          </div>
        </div>
      </div>
    </div>
  )
}