import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, MapPin, Clock, ChevronRight, CheckCircle, Send } from 'lucide-react'
import { DEMANDES, DIFFUSIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const STATUT_CONFIG = {
  envoyee:  { label: 'Nouvelle',     color: 'bg-blue-50 text-blue-700 border-blue-200',   dot: 'bg-blue-400' },
  repondue: { label: 'Répondue',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  expiree:  { label: 'Expirée',      color: 'bg-gray-100 text-gray-500 border-gray-200',  dot: 'bg-gray-400' },
}

const URGENCE_CONFIG = {
  urgent:   { label: 'Urgent',   color: 'bg-red-50 text-red-600 border-red-200' },
  standard: { label: 'Standard', color: 'bg-gray-50 text-gray-500 border-gray-200' },
}

const MOCK_EXTRA = [
  {
    id: 'dif-x1', demande_id: 'dem-02', fournisseur_id: 'org-10', statut: 'envoyee',
    fournisseur: { id: 'org-10', name: 'MediPro France' },
  },
  {
    id: 'dif-x2', demande_id: 'dem-04', fournisseur_id: 'org-10', statut: 'expiree',
    fournisseur: { id: 'org-10', name: 'MediPro France' },
  },
]

export default function DemandesRecues({ user }) {
  const orgId = user?.org_id || 'org-10'
  const [filter, setFilter] = useState('all')

  const all = [...DIFFUSIONS, ...MOCK_EXTRA]
    .filter(d => d.fournisseur_id === orgId)
    .map(dif => ({ ...dif, demande: DEMANDES.find(d => d.id === dif.demande_id) }))
    .filter(d => d.demande)

  const filtered = filter === 'all' ? all : all.filter(d => d.statut === filter)

  const counts = {
    all:      all.length,
    envoyee:  all.filter(d => d.statut === 'envoyee').length,
    repondue: all.filter(d => d.statut === 'repondue').length,
    expiree:  all.filter(d => d.statut === 'expiree').length,
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Demandes reçues</h1>
          <p className="text-sm text-gray-400 mt-0.5">Consultations diffusées par les centrales d'achats</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm font-bold text-blue-700">{counts.envoyee}</span>
          <span className="text-xs text-blue-400 font-medium">nouvelles</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fade} className="flex gap-1.5 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'all',      label: `Toutes (${counts.all})` },
          { key: 'envoyee',  label: `Nouvelles (${counts.envoyee})` },
          { key: 'repondue', label: `Répondues (${counts.repondue})` },
          { key: 'expiree',  label: `Expirées (${counts.expiree})` },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(({ id, statut, demande: d }) => {
          const st = STATUT_CONFIG[statut] || STATUT_CONFIG.expiree
          const urg = URGENCE_CONFIG[d.urgence] || URGENCE_CONFIG.standard
          return (
            <motion.div key={id} variants={fade}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5">
              <div className="flex items-start gap-4">
                {/* Left accent */}
                <div className={`w-1 self-stretch rounded-full ${st.dot}`} />

                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-600">{d.ref}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${st.color}`}>{st.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${urg.color}`}>{urg.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">{d.centrale?.name}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-2">{d.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package size={11} /> {d.quantite} × {d.categorie}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {d.site_name} — {d.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {d.type_demande === 'achat' ? 'Achat direct' : 'Location'}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  {statut === 'envoyee' && (
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                      <Send size={12} strokeWidth={2.5} /> Répondre
                    </button>
                  )}
                  {statut === 'repondue' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <CheckCircle size={13} strokeWidth={2.5} /> Devis envoyé
                    </span>
                  )}
                  {statut === 'expiree' && (
                    <span className="text-xs text-gray-400">Expirée</span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <p className="text-sm font-semibold text-gray-700">Aucune demande dans cette catégorie</p>
        </motion.div>
      )}

    </motion.div>
  )
}
