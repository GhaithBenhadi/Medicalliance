import { motion } from 'framer-motion'
import { BedDouble, Armchair, HeartPulse, Cog, Plus, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { DEMANDES, LOCATIONS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const CATEGORIES = [
  {
    id: 'lits', label: 'Lits médicalisés', icon: BedDouble, color: 'text-indigo-600', bg: 'bg-indigo-50', accent: '#6366f1',
    en_service: 20, capacite: 24, prochain_renouvellement: '298j',
    fournisseur: 'MediPro France',
  },
  {
    id: 'fauteuils', label: 'Fauteuils roulants', icon: Armchair, color: 'text-purple-600', bg: 'bg-purple-50', accent: '#8b5cf6',
    en_service: 8, capacite: 10, prochain_renouvellement: '255j',
    fournisseur: 'SudMed Equipements',
  },
  {
    id: 'soins', label: 'Matériel de soins', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-50', accent: '#10b981',
    en_service: 6, capacite: 8, prochain_renouvellement: '6j',
    fournisseur: 'Atlantique Médical',
    alerte: true,
  },
  {
    id: 'manutention', label: 'Manutention', icon: Cog, color: 'text-amber-600', bg: 'bg-amber-50', accent: '#f59e0b',
    en_service: 3, capacite: 4, prochain_renouvellement: null,
    fournisseur: null,
  },
]

const BESOINS_IDENTIFIES = [
  { id: 'b1', label: 'Remplacement lits aile B', categorie: 'lits', quantite: 6, priorite: 'haute', statut: 'a_planifier' },
  { id: 'b2', label: 'Fauteuils douche supplémentaires', categorie: 'fauteuils', quantite: 3, priorite: 'normale', statut: 'en_cours' },
  { id: 'b3', label: 'Matelas anti-escarre renouvellement', categorie: 'soins', quantite: 6, priorite: 'urgente', statut: 'a_planifier' },
]

const PRIORITE = {
  urgente: { label: 'Urgente', color: 'bg-red-50 text-red-700 border-red-200' },
  haute:   { label: 'Haute',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  normale: { label: 'Normale', color: 'bg-gray-50 text-gray-600 border-gray-200' },
}

const STATUT_BESOIN = {
  a_planifier: { label: 'À planifier', color: 'text-amber-600', icon: Clock },
  en_cours:    { label: 'En cours',    color: 'text-indigo-600', icon: TrendingUp },
  traite:      { label: 'Traité',      color: 'text-emerald-600', icon: CheckCircle },
}

export default function MesBesoins({ onNavigate, user }) {
  const orgId = user?.org_id || 'org-20'
  const mesLocations = LOCATIONS.filter(l => l.etablissement_id === orgId && l.statut === 'actif')
  const alertes = mesLocations.filter(l => l.days_left <= 30)
  const mesDemandes = DEMANDES.filter(d => d.etablissement_id === orgId)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mes besoins</h1>
          <p className="text-sm text-gray-400 mt-0.5">Vue d'ensemble des équipements et besoins identifiés</p>
        </div>
        <button
          onClick={() => onNavigate?.('new-demande')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}
        >
          <Plus size={14} strokeWidth={2.5} /> Nouvelle demande
        </button>
      </motion.div>

      {/* Alerte renouvellement */}
      {alertes.length > 0 && (
        <motion.div variants={fade} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Renouvellements urgents</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {alertes.map(l => (
                <p key={l.id} className="text-xs text-amber-700">
                  {l.equipement} — expire dans <strong>{l.days_left} jours</strong>
                </p>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('locations-actives')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap"
          >
            Gérer →
          </button>
        </motion.div>
      )}

      {/* KPIs rapides */}
      <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Équipements actifs', value: CATEGORIES.reduce((s, c) => s + c.en_service, 0), color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Demandes en cours',  value: mesDemandes.length, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
          { label: 'Locations actives',  value: mesLocations.length, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Besoins identifiés', value: BESOINS_IDENTIFIES.length, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
        ].map(k => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg}`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{k.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Parc équipements */}
      <motion.div variants={fade}>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Parc équipements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const pct = Math.round((cat.en_service / cat.capacite) * 100)
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all overflow-hidden">
                <div className="h-[3px] mb-4 -mx-5 -mt-5" style={{ background: `linear-gradient(90deg, ${cat.accent}, ${cat.accent}22)` }} />
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
                    <Icon size={18} className={cat.color} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-gray-800">{cat.label}</p>
                      {cat.alerte && (
                        <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1">
                          <AlertTriangle size={10} /> Renouvellement
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      {cat.fournisseur ? `Fournisseur : ${cat.fournisseur}` : 'Aucun fournisseur actif'}
                      {cat.prochain_renouvellement && ` · Contrat : ${cat.prochain_renouvellement}`}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">En service</span>
                      <span className="font-bold" style={{ color: cat.accent }}>{cat.en_service} / {cat.capacite} unités</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: cat.accent }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Besoins identifiés */}
      <motion.div variants={fade}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Besoins identifiés</h2>
          <button
            onClick={() => onNavigate?.('new-demande')}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus size={12} /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {BESOINS_IDENTIFIES.map(b => {
            const pr = PRIORITE[b.priorite]
            const st = STATUT_BESOIN[b.statut]
            const StIcon = st.icon
            return (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-gray-800">{b.label}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${pr.color}`}>{pr.label}</span>
                  </div>
                  <p className="text-xs text-gray-400">{b.quantite} unités · {b.categorie}</p>
                </div>
                <span className={`text-xs flex items-center gap-1 font-semibold shrink-0 ${st.color}`}>
                  <StIcon size={12} strokeWidth={2.5} /> {st.label}
                </span>
                {b.statut === 'a_planifier' && (
                  <button
                    onClick={() => onNavigate?.('new-demande')}
                    className="text-xs px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors shrink-0"
                  >
                    Créer demande
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

    </motion.div>
  )
}
