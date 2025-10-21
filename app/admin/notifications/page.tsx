'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Edit, Trash2, Save, X, Bell, Eye,
  Info, AlertTriangle, CheckCircle, AlertCircle
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  icon?: string;
  active?: boolean;
  priority?: number;
  partnerId?: string;
  validFrom?: string;
  validUntil?: string;
  displaySettings?: {
    showOnPages: string[];
    showOnce: boolean;
    dismissible: boolean;
    autoCloseAfter: number;
    position: 'top' | 'bottom' | 'center';
  };
  style?: {
    background: string;
    textColor: string;
  };
  action?: {
    text: string;
    link: string;
  };
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Notification | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/content/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      id: `notification-${Date.now()}`,
      title: '',
      message: '',
      type: 'info',
      icon: '📢',
      active: true,
      priority: notifications.length + 1,
      partnerId: 'stadtmarketing',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      displaySettings: {
        showOnPages: ['home'],
        showOnce: false,
        dismissible: true,
        autoCloseAfter: 0,
        position: 'top'
      },
      style: {
        background: 'from-blue-500 to-indigo-600',
        textColor: 'white'
      },
      action: {
        text: 'Mehr erfahren',
        link: '/events'
      }
    });
    setShowEditModal(true);
  };

  const handleEdit = (notification: Notification) => {
    setFormData({ ...notification });
    setShowEditModal(true);
  };

  const handleDelete = async (notificationId: string) => {
    if (confirm('Möchten Sie diese Benachrichtigung wirklich löschen?')) {
      const updated = notifications.filter(n => n.id !== notificationId);
      await saveToServer(updated);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    const exists = notifications.find(n => n.id === formData.id);
    let updated: Notification[];
    
    if (exists) {
      updated = notifications.map(n => n.id === formData.id ? formData : n);
    } else {
      updated = [...notifications, formData];
    }
    
    setShowEditModal(false);
    await saveToServer(updated);
  };

  const saveToServer = async (notificationList: Notification[]) => {
    try {
      const response = await fetch('/api/content/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: notificationList,
          metadata: {
            version: '1.0',
            updatedBy: 'admin-interface'
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNotifications(notificationList);
        alert('✅ Änderungen erfolgreich gespeichert!');
        loadNotifications(); // Reload to get fresh data
      } else {
        alert('❌ Fehler beim Speichern: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('❌ Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const downloadJSON = (notifications: Notification[]) => {
    const jsonData = {
      notifications: notifications,
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
    a.download = 'notifications.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const gradientOptions = [
    { value: 'from-blue-500 to-indigo-600', label: 'Blau/Indigo' },
    { value: 'from-red-500 to-pink-600', label: 'Rot/Pink' },
    { value: 'from-orange-500 to-red-600', label: 'Orange/Rot' },
    { value: 'from-green-500 to-emerald-600', label: 'Grün/Smaragd' },
    { value: 'from-purple-500 to-pink-600', label: 'Lila/Pink' },
    { value: 'from-yellow-500 to-orange-600', label: 'Gelb/Orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Bell className="w-8 h-8 text-blue-600" />
                  Pop-up Benachrichtigungen
                </h1>
                <p className="text-gray-600 mt-1">Wichtige Nachrichten für Nutzer verwalten</p>
              </div>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Neue Benachrichtigung
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Lade Benachrichtigungen...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Keine Benachrichtigungen vorhanden</p>
              <p className="text-sm mt-2">Erstellen Sie Ihre erste Pop-up Benachrichtigung</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {notification.icon ? (
                        <span className="text-3xl">{notification.icon}</span>
                      ) : (
                        getTypeIcon(notification.type)
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.active !== false 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {notification.active !== false ? 'Aktiv' : 'Inaktiv'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.type === 'info' ? 'bg-blue-100 text-blue-700' :
                            notification.type === 'warning' ? 'bg-orange-100 text-orange-700' :
                            notification.type === 'success' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3">
                        <span>Priorität: {notification.priority || '?'}</span>
                        {notification.validFrom && (
                          <>
                            <span>•</span>
                            <span>Ab {new Date(notification.validFrom).toLocaleDateString('de-DE')}</span>
                          </>
                        )}
                        {notification.validUntil && (
                          <>
                            <span>•</span>
                            <span>Bis {new Date(notification.validUntil).toLocaleDateString('de-DE')}</span>
                          </>
                        )}
                        {notification.displaySettings?.showOnPages && (
                          <>
                            <span>•</span>
                            <span>Seiten: {notification.displaySettings.showOnPages.join(', ')}</span>
                          </>
                        )}
                      </div>

                      {/* Gradient Preview */}
                      {notification.style?.background && (
                        <div className={`mt-3 h-2 rounded-full bg-gradient-to-r ${notification.style.background}`}></div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(notification)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        title="Bearbeiten"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && formData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">
                {notifications.find(n => n.id === formData.id) ? 'Benachrichtigung bearbeiten' : 'Neue Benachrichtigung'}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Typ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warnung</option>
                    <option value="success">Erfolg</option>
                    <option value="error">Fehler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📢 🎄 ⚠️ ✅"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    maxLength={2}
                  />
                </div>
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
                  placeholder="z.B. Wichtige Ankündigung"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nachricht <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ihre Nachricht an die Nutzer..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/300 Zeichen</p>
              </div>

              {/* Action Button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button-Text
                  </label>
                  <input
                    type="text"
                    value={formData.action?.text || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      action: { ...formData.action!, text: e.target.value }
                    })}
                    placeholder="Mehr erfahren"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button-Link
                  </label>
                  <input
                    type="text"
                    value={formData.action?.link || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      action: { ...formData.action!, link: e.target.value }
                    })}
                    placeholder="/events"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Gradient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farbverlauf
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {gradientOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ 
                        ...formData, 
                        style: { ...formData.style!, background: option.value }
                      })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.style?.background === option.value
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-6 rounded bg-gradient-to-r ${option.value} mb-1`}></div>
                      <p className="text-xs text-gray-600">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzeige auf Seiten
                </label>
                <div className="flex flex-wrap gap-2">
                  {['home', 'events', 'parking', 'navigation', 'vouchers', 'shopping'].map((page) => (
                    <label key={page} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={formData.displaySettings?.showOnPages.includes(page)}
                        onChange={(e) => {
                          const pages = formData.displaySettings?.showOnPages || [];
                          const updated = e.target.checked
                            ? [...pages, page]
                            : pages.filter(p => p !== page);
                          setFormData({
                            ...formData,
                            displaySettings: { ...formData.displaySettings!, showOnPages: updated }
                          });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{page}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorität
                  </label>
                  <input
                    type="number"
                    value={formData.priority || 1}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Benachrichtigung aktivieren
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.displaySettings?.dismissible !== false}
                    onChange={(e) => setFormData({
                      ...formData,
                      displaySettings: { ...formData.displaySettings!, dismissible: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Kann geschlossen werden
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.displaySettings?.showOnce}
                    onChange={(e) => setFormData({
                      ...formData,
                      displaySettings: { ...formData.displaySettings!, showOnce: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Nur einmal anzeigen (nach Schließen nicht wieder zeigen)
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || !formData.message}
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
