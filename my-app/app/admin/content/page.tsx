'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Edit, Trash2, Save, X, 
  Image as ImageIcon, Calendar, Eye, Upload
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  gradient: string;
  active?: boolean;
  order?: number;
  partnerId?: string;
  validFrom?: string;
  validUntil?: string;
}

export default function AdminContentPage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<HeroSlide | null>(null);

  useEffect(() => {
    loadHeroSlides();
  }, []);

  const loadHeroSlides = async () => {
    try {
      const response = await fetch('/api/content/hero-slides');
      const data = await response.json();
      if (data.success) {
        setHeroSlides(data.data);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      id: `slide-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      image: '',
      cta: 'Mehr erfahren',
      ctaLink: '/events',
      gradient: 'from-blue-500 to-indigo-600',
      active: true,
      order: heroSlides.length + 1,
      partnerId: 'stadtmarketing',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: ''
    });
    setShowEditModal(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setFormData({ ...slide });
    setShowEditModal(true);
  };

  const handleDelete = async (slideId: string) => {
    if (confirm('Möchten Sie diesen Slide wirklich löschen?')) {
      const updated = heroSlides.filter(s => s.id !== slideId);
      await saveToServer(updated);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    const exists = heroSlides.find(s => s.id === formData.id);
    let updated: HeroSlide[];
    
    if (exists) {
      updated = heroSlides.map(s => s.id === formData.id ? formData : s);
    } else {
      updated = [...heroSlides, formData];
    }
    
    setShowEditModal(false);
    await saveToServer(updated);
  };

  const saveToServer = async (slides: HeroSlide[]) => {
    try {
      const response = await fetch('/api/content/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          metadata: {
            version: '1.0',
            updatedBy: 'admin-interface'
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHeroSlides(slides);
        alert('✅ Änderungen erfolgreich gespeichert!');
        loadHeroSlides(); // Reload to get fresh data
      } else {
        alert('❌ Fehler beim Speichern: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const downloadJSON = (slides: HeroSlide[]) => {
    const jsonData = {
      slides: slides,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.0',
        updatedBy: 'admin-interface'
      }
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hero-slides.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gradientOptions = [
    { value: 'from-red-500 to-pink-600', label: 'Rot/Pink', preview: 'bg-gradient-to-r from-red-500 to-pink-600' },
    { value: 'from-blue-500 to-indigo-600', label: 'Blau/Indigo', preview: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
    { value: 'from-green-500 to-emerald-600', label: 'Grün/Smaragd', preview: 'bg-gradient-to-r from-green-500 to-emerald-600' },
    { value: 'from-amber-500 to-orange-600', label: 'Bernstein/Orange', preview: 'bg-gradient-to-r from-amber-500 to-orange-600' },
    { value: 'from-purple-500 to-pink-600', label: 'Lila/Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-600' },
    { value: 'from-cyan-500 to-blue-600', label: 'Türkis/Blau', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Content Verwaltung</h1>
                <p className="text-gray-600 mt-1">Hero Slides & Featured Events verwalten</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Anleitung
            </button>
          </div>

          {/* Instructions Panel */}
          {showInstructions && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📝 Schnellanleitung</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Klicken Sie auf ein Slide, um es zu bearbeiten</li>
                <li>Bilder müssen im Format 1920x1080px (16:9) hochgeladen werden</li>
                <li>Aktivieren/Deaktivieren Sie Slides über den Toggle</li>
                <li>Sortieren Sie Slides über die Order-Nummer</li>
                <li>Setzen Sie Gültigkeitszeiträume für zeitlich begrenzte Kampagnen</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tipp:</strong> Für detaillierte Anleitungen siehe{' '}
                  <Link href="/PARTNER_CONTENT_GUIDE.md" className="underline font-semibold">
                    Partner Content Guide
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">Demo-Modus</h3>
              <p className="text-sm text-yellow-800 mb-2">
                Dies ist eine Vorschau-Version der Content-Verwaltung. Änderungen werden aktuell nur lokal gespeichert.
              </p>
              <p className="text-xs text-yellow-700">
                Für die vollständige Verwaltung mit Speicher-Funktion kontaktieren Sie bitte:{' '}
                <strong>tech@stadtmarketing-braunschweig.de</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hero Slides Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Hero Slides</h2>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Neu
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-4">Lade Slides...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {heroSlides.map((slide) => (
                  <div 
                    key={slide.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {slide.image && (
                          <img 
                            src={slide.image} 
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 truncate">{slide.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              slide.active !== false 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {slide.active !== false ? 'Aktiv' : 'Inaktiv'}
                            </span>
                            <button
                              onClick={() => handleEdit(slide)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                              title="Bearbeiten"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(slide.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                              title="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span>Order: {slide.order || '?'}</span>
                          {slide.validFrom && (
                            <>
                              <span>•</span>
                              <span>Ab {new Date(slide.validFrom).toLocaleDateString('de-DE')}</span>
                            </>
                          )}
                        </div>
                        <div className={`mt-2 h-2 rounded-full ${slide.gradient}`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pop-up Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pop-up Benachrichtigungen</h2>
              <Link
                href="/admin/notifications"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Verwalten
              </Link>
            </div>
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-700 font-medium">Wichtige Nachrichten verwalten</p>
              <p className="text-sm text-gray-500 mt-2">Erstellen Sie Pop-up Benachrichtigungen für Ihre Nutzer</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weitere Optionen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/PARTNER_CONTENT_GUIDE.md"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dokumentation</h3>
                  <p className="text-sm text-gray-500">Komplette Anleitung</p>
                </div>
              </div>
            </Link>

            <button 
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left"
              disabled
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Bilder hochladen</h3>
                  <p className="text-sm text-gray-500">Media Library</p>
                </div>
              </div>
            </button>

            <button 
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left"
              disabled
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Save className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Änderungen speichern</h3>
                  <p className="text-sm text-gray-500">Backup & Export</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Benötigen Sie Unterstützung?</h2>
          <p className="mb-4 text-blue-100">
            Unser Team hilft Ihnen gerne bei der Verwaltung Ihrer Inhalte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="mailto:tech@stadtmarketing-braunschweig.de"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
            >
              📧 E-Mail Support
            </a>
            <a 
              href="tel:+4953112345678"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold text-center"
            >
              📞 Anrufen
            </a>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && formData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {heroSlides.find(s => s.id === formData.id) ? 'Slide bearbeiten' : 'Neuer Slide'}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* ID (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Weihnachtsmarkt 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50 Zeichen</p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Untertitel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="z.B. Festliche Stimmung"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={80}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.subtitle.length}/80 Zeichen</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="z.B. Erleben Sie die festliche Atmosphäre auf dem Burgplatz"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/150 Zeichen</p>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bild URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/events/ihr-event.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Laden Sie zuerst Ihr Bild in /public/events/ hoch, dann geben Sie den Pfad ein
                </p>
                {formData.image && (
                  <div className="mt-2 border border-gray-200 rounded-lg p-2">
                    <img 
                      src={formData.image} 
                      alt="Vorschau" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EBild nicht gefunden%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button-Text
                  </label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    placeholder="Mehr erfahren"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button-Link
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    placeholder="/events"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gradient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farbverlauf
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {gradientOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, gradient: option.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gradient === option.value
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-6 rounded ${option.preview} mb-1`}></div>
                      <p className="text-xs text-gray-600">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reihenfolge
                  </label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner-ID
                  </label>
                  <input
                    type="text"
                    value={formData.partnerId || ''}
                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                    placeholder="stadtmarketing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gültig ab
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom || ''}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gültig bis
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil || ''}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active !== false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Slide aktivieren (wird öffentlich angezeigt)
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.subtitle || !formData.description || !formData.image}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Speichern & Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
