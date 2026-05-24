import { motion } from 'framer-motion'
import { Truck, MapPin, Package, CalendarDays, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const today = new Date()
const inDays = (n) => new Date(today.getTime() + n * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
const pastDays = (n) => new Date(today.getTime() - n * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

const LIVRAISONS = [
  {
    id: 'liv-01', ref: 'LIV-2024-041', commande: 'CMD-874',
    client: 'EHPAD Les Jardins', ville: 'Toulouse', adresse: '12 rue des Lilas, 31000',
    equipement: 'Lits médicalisés électriques 3 plans', quantite: 20,
    date_prevue: inDays(2), statut: 'planifiee',
    etapes: ['Préparation', 'Expédition', 'Livraison', 'Installation', 'Réception'],
    etape_actuelle: 1,
    contact: 'Isabelle Morin · 06 12 34 56 78',
    notes: "Accès par l'entrée principale, ascenseur disponible. Appeler 1h avant.",
  },
  {
    id: 'liv-02', ref: 'LIV-2024-039', commande: 'CMD-869',
    client: 'Clinique Saint-Joseph', ville: 'Lyon', adresse: '8 avenue Berthelot, 69007',
    equipement: 'Fauteuils roulants propulsion manuelle', quantite: 8,
    date_prevue: inDays(5), statut: 'en_transit',
    etapes: ['Préparation', 'Expédition', 'Livraison', 'Installation', 'Réception'],
    etape_actuelle: 2,
    contact: 'Marc Dupont · 04 72 34 56 78',
    notes: 'Livraison en matinée uniquement (8h-12h).',
  },
  {
    id: 'liv-03', ref: 'LIV-2024-035', commande: 'CMD-861',
    client: 'HAD Sud-Ouest', ville: 'Bordeaux', adresse: '5 quai des Chartrons, 33000',
    equipement: 'Lève-personnes mobiles', quantite: 3,
    date_prevue: pastDays(3), statut: 'installee',
    etapes: ['Préparation', 'Expédition', 'Livraison', 'Installation', 'Réception'],
    etape_actuelle: 4,
    contact: 'Claire Roux · 05 56 78 90 12',
    notes: 'Formation du personnel effectuée. PV signé.',
  },
  {
    id: 'liv-04', ref: 'LIV-2024-033', commande: 'CMD-855',
    client: 'EHPAD Val Fleuri', ville: 'Montpellier', adresse: '22 boulevard Gambetta, 34000',
    equipement: 'Matelas anti-escarre thérapeutiques', quantite: 6,
    date_prevue: pastDays(1), statut: 'retard',
    etapes: ['Préparation', 'Expédition', 'Livraison', 'Installation', 'Réception'],
    etape_actuelle: 2,
    contact: 'Henri Blanc · 04 67 89 01 23',
    notes: 'Retard transporteur. Nouvelle date estimée : dans 2 jours.',
  },
]

const STATUT_CONFIG = {
  planifiee:  { label: 'Planifiée',   color: 'bg-blue-50 text-blue-700 border-blue-200',   accent: '#3b82f6' },
  en_transit: { label: 'En transit',  color: 'bg-purple-50 text-purple-700 border-purple-200', accent: '#8b5cf6' },
  installee:  { label: 'Installée',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200', accent: '#10b981' },
  retard:     { label: 'Retard',      color: 'bg-red-50 text-red-700 border-red-200',      accent: '#ef4444' },
}

function ProgressBar({ etapes, current }) {
  return (
    <div className="flex items-center gap-0">
      {etapes.map((etape, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                done   ? 'bg-emerald-500 border-emerald-500' :
                active ? 'bg-indigo-500 border-indigo-500 ring-2 ring-indigo-200' :
                         'bg-white border-gray-200'
              }`}>
                {done
                  ? <CheckCircle size={12} strokeWidth={3} style={{ color: 'white' }} />
                  : active
                  ? <div className="w-2 h-2 rounded-full bg-white" />
                  : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                }
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${
                done ? 'text-emerald-600' : active ? 'text-indigo-600' : 'text-gray-400'
              }`}>{etape}</span>
            </div>
            {i < etapes.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-0.5 ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function LivraisonInstallation() {
  const stats = {
    total: LIVRAISONS.length,
    en_cours: LIVRAISONS.filter(l => ['planifiee', 'en_transit'].includes(l.statut)).length,
    installee: LIVRAISONS.filter(l => l.statut === 'installee').length,
    retard: LIVRAISONS.filter(l => l.statut === 'retard').length,
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Livraison / Installation</h1>
          <p className="text-sm text-gray-400 mt-0.5">Suivi des livraisons et mises en service</p>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: stats.total,    color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200' },
          { label: 'En cours',     value: stats.en_cours, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
          { label: 'Installées',   value: stats.installee, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Retards',      value: stats.retard,   color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 text-center ${k.bg}`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{k.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Cards */}
      <div className="space-y-4">
        {LIVRAISONS.map(l => {
          const st = STATUT_CONFIG[l.statut]
          return (
            <motion.div key={l.id} variants={fade}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${st.accent}, ${st.accent}22)` }} />
              <div className="p-5">
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Truck size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-bold text-gray-900">{l.client}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${st.color}`}>{st.label}</span>
                        {l.statut === 'retard' && <AlertCircle size={13} className="text-red-500" />}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={9} /> {l.adresse}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs text-gray-400 font-mono">{l.ref}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                      <CalendarDays size={10} /> {l.date_prevue}
                    </p>
                  </div>
                </div>

                {/* Equipment */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Package size={13} className="text-gray-400 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{l.equipement}</span>
                  <span className="text-xs text-gray-400 ml-auto shrink-0">× {l.quantite} unités</span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <ProgressBar etapes={l.etapes} current={l.etape_actuelle} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {l.contact}
                  </p>
                  {l.notes && (
                    <p className="text-xs text-gray-500 italic max-w-xs text-right">{l.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

    </motion.div>
  )
}
