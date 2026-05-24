import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Wrench, Plus, Clock, CheckCircle, ChevronDown, ChevronUp, X, Send } from 'lucide-react'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const today = new Date()
const daysAgo = (n) => new Date(today - n * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

const INCIDENTS = [
  {
    id: 'inc-01', ref: 'INC-2024-018',
    equipement: 'Lit médicalisé électrique', ref_eq: 'LIT-MP-4821',
    type: 'Panne électrique', priorite: 'haute',
    description: 'Le relevé de tête ne fonctionne plus sur le lit de la chambre 12. Moteur non réactif.',
    statut: 'en_cours', date: daysAgo(1),
    technicien: 'MediPro France — Rémi Durand',
    historique: [
      { date: daysAgo(1), texte: 'Incident signalé' },
      { date: daysAgo(0), texte: 'Technicien affecté — intervention prévue demain' },
    ],
  },
  {
    id: 'inc-02', ref: 'INC-2024-014',
    equipement: 'Fauteuil roulant', ref_eq: 'FR-MS-3301',
    type: 'Usure anormale', priorite: 'normale',
    description: "Usure prématurée des roues arrière après 4 mois d'utilisation. Remplacement demandé sous garantie.",
    statut: 'planifie', date: daysAgo(4),
    technicien: 'SudMed Equipements',
    historique: [
      { date: daysAgo(4), texte: 'Incident signalé' },
      { date: daysAgo(3), texte: 'Diagnostic confirmé — prise en charge sous garantie' },
      { date: daysAgo(2), texte: 'Intervention planifiée dans 4 jours' },
    ],
  },
  {
    id: 'inc-03', ref: 'INC-2024-009',
    equipement: 'Matelas anti-escarre', ref_eq: 'MAT-AL-1102',
    type: 'Fuite air', priorite: 'haute',
    description: 'Fuite détectée sur la cellule n°3. Compresseur en surchauffe intermittente.',
    statut: 'nouveau', date: daysAgo(0),
    technicien: null,
    historique: [
      { date: daysAgo(0), texte: 'Incident signalé — en attente d\'affectation' },
    ],
  },
  {
    id: 'inc-04', ref: 'INC-2024-006',
    equipement: 'Lève-personne', ref_eq: 'LP-HM-2204',
    type: 'Maintenance préventive', priorite: 'basse',
    description: 'Révision annuelle réglementaire effectuée. Rapport de conformité disponible.',
    statut: 'resolu', date: daysAgo(10),
    technicien: 'MediPro France — Pierre Moreau',
    historique: [
      { date: daysAgo(10), texte: 'Planification révision annuelle' },
      { date: daysAgo(8), texte: 'Intervention réalisée' },
      { date: daysAgo(7), texte: 'Clôturé — conformité validée' },
    ],
  },
]

const STATUT = {
  nouveau:  { label: 'Nouveau',    color: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500',    accent: '#3b82f6' },
  en_cours: { label: 'En cours',   color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', accent: '#6366f1' },
  planifie: { label: 'Planifié',   color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', accent: '#8b5cf6' },
  resolu:   { label: 'Résolu',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', accent: '#10b981' },
}

const PRIORITE = {
  haute:   { label: 'Haute',   color: 'bg-red-50 text-red-700 border-red-200' },
  normale: { label: 'Normale', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  basse:   { label: 'Basse',   color: 'bg-green-50 text-green-700 border-green-200' },
}

function NewIncidentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ equipement: '', type: '', priorite: 'normale', description: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
      >
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Signaler un incident / SAV</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Équipement concerné</label>
            <input value={form.equipement} onChange={e => set('equipement', e.target.value)}
              placeholder="Ex : Lit médicalisé, Fauteuil roulant…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Type d'incident</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-400 outline-none">
              <option value="">Sélectionner…</option>
              <option>Panne / dysfonctionnement</option>
              <option>Usure / dégradation</option>
              <option>Défaut produit</option>
              <option>Maintenance préventive</option>
              <option>Autre</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Priorité</label>
            <div className="flex gap-2">
              {['basse', 'normale', 'haute'].map(p => (
                <button key={p} onClick={() => set('priorite', p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${
                    form.priorite === p ? PRIORITE[p].color + ' ring-1 ring-current' : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Décrivez le problème constaté…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-400 outline-none resize-none" />
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium">
            Annuler
          </button>
          <button onClick={() => { onSubmit(form); onClose() }}
            disabled={!form.equipement || !form.type}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            <Send size={13} strokeWidth={2.5} /> Envoyer
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function SAVIncidents() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [incidents, setIncidents] = useState(INCIDENTS)

  const counts = {
    all:      incidents.length,
    nouveau:  incidents.filter(t => t.statut === 'nouveau').length,
    en_cours: incidents.filter(t => t.statut === 'en_cours').length,
    planifie: incidents.filter(t => t.statut === 'planifie').length,
    resolu:   incidents.filter(t => t.statut === 'resolu').length,
  }

  const filtered = filter === 'all' ? incidents : incidents.filter(t => t.statut === filter)

  const handleSubmit = (form) => {
    const newInc = {
      id: `inc-${Date.now()}`,
      ref: `INC-2024-0${incidents.length + 5}`,
      equipement: form.equipement, ref_eq: '—',
      type: form.type, priorite: form.priorite,
      description: form.description,
      statut: 'nouveau', date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      technicien: null,
      historique: [{ date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), texte: 'Incident signalé' }],
    }
    setIncidents(prev => [newInc, ...prev])
  }

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

        {/* Header */}
        <motion.div variants={fade} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SAV / Incidents</h1>
            <p className="text-sm text-gray-400 mt-0.5">Signalement et suivi des incidents sur vos équipements</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
            <Plus size={14} strokeWidth={2.5} /> Signaler un incident
          </button>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'nouveau',  label: 'Nouveaux',   v: counts.nouveau,  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
            { key: 'en_cours', label: 'En cours',   v: counts.en_cours, color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
            { key: 'planifie', label: 'Planifiés',  v: counts.planifie, color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
            { key: 'resolu',   label: 'Résolus',    v: counts.resolu,   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          ].map(k => (
            <button key={k.key} onClick={() => setFilter(filter === k.key ? 'all' : k.key)}
              className={`rounded-xl border p-4 text-center transition-all hover:shadow-sm ${k.bg} ${filter === k.key ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
              <p className={`text-2xl font-bold ${k.color}`}>{k.v}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{k.label}</p>
            </button>
          ))}
        </motion.div>

        {/* Incidents */}
        <div className="space-y-3">
          {filtered.map(t => {
            const st = STATUT[t.statut]
            const pr = PRIORITE[t.priorite]
            const isOpen = expanded === t.id
            return (
              <motion.div key={t.id} variants={fade}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${st.accent}, ${st.accent}22)` }} />
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      {t.statut === 'resolu'
                        ? <CheckCircle size={16} className="text-emerald-500" />
                        : <AlertTriangle size={16} className="text-gray-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-600">{t.ref}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${st.color}`}>{st.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${pr.color}`}>{pr.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mb-0.5">{t.type}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1"><Wrench size={9} /> {t.equipement} · {t.ref_eq}</span>
                        <span className="flex items-center gap-1"><Clock size={9} /> {t.date}</span>
                        {t.technicien && <span className="text-indigo-500 font-medium">{t.technicien}</span>}
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
                      className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                    >
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700">{t.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Historique</p>
                        <div className="space-y-2">
                          {t.historique.map((h, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${i === t.historique.length - 1 ? st.dot : 'bg-gray-300'}`} />
                              <div>
                                <p className="text-xs text-gray-400">{h.date}</p>
                                <p className="text-xs text-gray-700 font-medium">{h.texte}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">Aucun incident dans cette catégorie</p>
          </motion.div>
        )}

      </motion.div>

      <AnimatePresence>
        {showModal && <NewIncidentModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
      </AnimatePresence>
    </>
  )
}
