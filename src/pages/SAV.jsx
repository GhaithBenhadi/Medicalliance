import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wrench, MapPin, Clock, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const today = new Date()
const daysAgo = (n) => new Date(today - n * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

const TICKETS = [
  {
    id: 'sav-01', ref: 'SAV-2024-018',
    client: 'EHPAD Les Jardins', ville: 'Toulouse',
    equipement: 'Lit médicalisé électrique', ref_equipement: 'LIT-MP-4821',
    type: 'Panne électrique', priorite: 'haute',
    description: 'Le relevé de tête ne fonctionne plus. Moteur non réactif à la télécommande.',
    statut: 'en_cours', date_ouverture: daysAgo(1), technicien: 'Rémi Durand',
    historique: [
      { date: daysAgo(1), action: 'Ticket ouvert par le client' },
      { date: daysAgo(0), action: 'Technicien affecté — intervention prévue demain matin' },
    ],
  },
  {
    id: 'sav-02', ref: 'SAV-2024-015',
    client: 'Clinique Saint-Joseph', ville: 'Lyon',
    equipement: 'Fauteuil roulant motorisé', ref_equipement: 'FR-MS-3301',
    type: 'Usure prématurée', priorite: 'normale',
    description: 'Usure anormale des roues arrière après 4 mois d\'utilisation. Remplacement souhaité sous garantie.',
    statut: 'planifie', date_ouverture: daysAgo(3), technicien: 'Sophie Lefebvre',
    historique: [
      { date: daysAgo(3), action: 'Ticket ouvert' },
      { date: daysAgo(2), action: 'Diagnostic confirmé sous garantie — pièces commandées' },
      { date: daysAgo(1), action: 'Intervention planifiée dans 4 jours' },
    ],
  },
  {
    id: 'sav-03', ref: 'SAV-2024-012',
    client: 'HAD Sud-Ouest', ville: 'Bordeaux',
    equipement: 'Lève-personne mobile', ref_equipement: 'LP-HM-2204',
    type: 'Maintenance préventive', priorite: 'basse',
    description: 'Révision annuelle et contrôle de conformité réglementaire.',
    statut: 'resolu', date_ouverture: daysAgo(8), technicien: 'Pierre Moreau',
    historique: [
      { date: daysAgo(8), action: 'Planification révision annuelle' },
      { date: daysAgo(6), action: 'Intervention réalisée — rapport émis' },
      { date: daysAgo(5), action: 'Ticket clôturé · Conformité validée' },
    ],
  },
  {
    id: 'sav-04', ref: 'SAV-2024-009',
    client: 'EHPAD Les Jardins', ville: 'Toulouse',
    equipement: 'Matelas anti-escarre', ref_equipement: 'MAT-AL-1102',
    type: 'Défaut produit', priorite: 'haute',
    description: 'Fuite d\'air détectée sur la cellule n°3. Compresseur en surchauffe.',
    statut: 'en_attente', date_ouverture: daysAgo(0), technicien: null,
    historique: [
      { date: daysAgo(0), action: 'Ticket ouvert — affectation en cours' },
    ],
  },
]

const STATUT_CONFIG = {
  en_attente: { label: 'En attente',  color: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-400',   accent: '#f59e0b' },
  en_cours:   { label: 'En cours',    color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-500',    accent: '#3b82f6' },
  planifie:   { label: 'Planifié',    color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500',  accent: '#8b5cf6' },
  resolu:     { label: 'Résolu',      color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', accent: '#10b981' },
}

const PRIORITE_CONFIG = {
  haute:   { label: 'Priorité haute',   color: 'text-red-600 bg-red-50 border-red-200' },
  normale: { label: 'Priorité normale', color: 'text-gray-600 bg-gray-50 border-gray-200' },
  basse:   { label: 'Basse priorité',   color: 'text-green-600 bg-green-50 border-green-200' },
}

export default function SAV() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  const counts = {
    all: TICKETS.length,
    en_attente: TICKETS.filter(t => t.statut === 'en_attente').length,
    en_cours:   TICKETS.filter(t => t.statut === 'en_cours').length,
    planifie:   TICKETS.filter(t => t.statut === 'planifie').length,
    resolu:     TICKETS.filter(t => t.statut === 'resolu').length,
  }

  const filtered = filter === 'all' ? TICKETS : TICKETS.filter(t => t.statut === filter)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">SAV</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tickets de service après-vente et maintenance</p>
        </div>
        {counts.en_attente > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
            <AlertCircle size={13} className="text-amber-500" />
            <span className="text-sm font-bold text-amber-700">{counts.en_attente}</span>
            <span className="text-xs text-amber-500 font-medium">en attente</span>
          </div>
        )}
      </motion.div>

      {/* KPIs */}
      <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'en_attente', label: 'En attente',  v: counts.en_attente, color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
          { key: 'en_cours',   label: 'En cours',    v: counts.en_cours,   color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
          { key: 'planifie',   label: 'Planifiés',   v: counts.planifie,   color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
          { key: 'resolu',     label: 'Résolus',     v: counts.resolu,     color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(k => (
          <button key={k.key} onClick={() => setFilter(filter === k.key ? 'all' : k.key)}
            className={`rounded-xl border p-4 text-center transition-all hover:shadow-sm ${k.bg} ${filter === k.key ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.v}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{k.label}</p>
          </button>
        ))}
      </motion.div>

      {/* Tickets */}
      <div className="space-y-3">
        {filtered.map(t => {
          const st = STATUT_CONFIG[t.statut]
          const pr = PRIORITE_CONFIG[t.priorite]
          const isOpen = expanded === t.id
          return (
            <motion.div key={t.id} variants={fade}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${st.accent}, ${st.accent}22)` }} />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Wrench size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-600">{t.ref}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${st.color}`}>{st.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${pr.color}`}>{pr.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{t.type}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={9} />{t.client} — {t.ville}</span>
                      <span className="flex items-center gap-1"><Wrench size={9} />{t.equipement} · {t.ref_equipement}</span>
                      <span className="flex items-center gap-1"><Clock size={9} />{t.date_ouverture}</span>
                    </p>
                  </div>
                  <button onClick={() => setExpanded(isOpen ? null : t.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all shrink-0">
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-100 space-y-4"
                  >
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Description</p>
                      <p className="text-sm text-gray-700">{t.description}</p>
                    </div>
                    {t.technicien && (
                      <p className="text-xs text-gray-500">
                        Technicien affecté : <span className="font-semibold text-gray-700">{t.technicien}</span>
                      </p>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Historique</p>
                      <div className="space-y-2">
                        {t.historique.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              i === t.historique.length - 1 ? `${st.dot}` : 'bg-gray-300'
                            }`} />
                            <div>
                              <p className="text-xs text-gray-400">{h.date}</p>
                              <p className="text-xs text-gray-700 font-medium">{h.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {t.statut !== 'resolu' && (
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                        <CheckCircle size={12} strokeWidth={2.5} /> Marquer comme résolu
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

    </motion.div>
  )
}
