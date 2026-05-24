import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, CheckCircle, MapPin, X, Send, UserPlus, SlidersHorizontal, Users } from 'lucide-react'
import { ADHERENTS, DEMANDES } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const TIER_CONFIG = {
  gold:    { label: 'Gold',    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',   accent: '#f59e0b', avatarBg: '#fef3c7', avatarText: '#92400e' },
  premium: { label: 'Premium', color: 'text-purple-700 bg-purple-50 border-purple-200',   accent: '#8b5cf6', avatarBg: '#ede9fe', avatarText: '#5b21b6' },
  silver:  { label: 'Silver',  color: 'text-slate-600 bg-slate-50 border-slate-200',      accent: '#94a3b8', avatarBg: '#f1f5f9', avatarText: '#475569' },
  partner: { label: 'Partner', color: 'text-blue-700 bg-blue-50 border-blue-200',         accent: '#3b82f6', avatarBg: '#dbeafe', avatarText: '#1d4ed8' },
  bronze:  { label: 'Bronze',  color: 'text-orange-700 bg-orange-50 border-orange-200',   accent: '#f97316', avatarBg: '#ffedd5', avatarText: '#9a3412' },
}

function ScoreRing({ score, size = 52 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 95 ? '#10b981' : score >= 85 ? '#6366f1' : '#f59e0b'
  const track = score >= 95 ? '#d1fae5' : score >= 85 ? '#e0e7ff' : '#fef3c7'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={5.5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5.5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={11} fontWeight="700">{score}</text>
    </svg>
  )
}

function Avatar({ name, tier }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.bronze
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
      style={{ background: cfg.avatarBg, color: cfg.avatarText, border: `1.5px solid ${cfg.accent}55` }}
    >
      {initials}
    </div>
  )
}

function InviteModal({ demande, preselected, invited, onConfirm, onClose }) {
  const [selected, setSelected] = useState(preselected)
  const alreadyInvited = (id) => invited[`${demande?.id}-${id}`]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
      >
        {/* Modal header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Sélectionner un fournisseur</h3>
              {demande && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {demande.ref} · {demande.categorie} · {demande.quantite} unités · {demande.city}
                </p>
              )}
            </div>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all ml-3">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-4 py-3 space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin">
          {ADHERENTS.map(a => {
            const tier = TIER_CONFIG[a.tier] || TIER_CONFIG.bronze
            const isSelected = selected === a.org_id
            const done = alreadyInvited(a.org_id)
            return (
              <button key={a.org_id} disabled={done}
                onClick={() => !done && setSelected(a.org_id)}
                className={`w-full text-left rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  done       ? 'border-emerald-200 bg-emerald-50/40 opacity-60 cursor-not-allowed'
                  : isSelected ? 'border-indigo-300 bg-indigo-50/80'
                               : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Avatar name={a.org.name} tier={a.tier} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-gray-800">{a.org.name}</span>
                    <span className={`text-xs px-1.5 py-px rounded-md border font-semibold ${tier.color}`}>{tier.label}</span>
                    {done && <span className="text-xs text-emerald-600 flex items-center gap-0.5 font-medium"><CheckCircle size={10} /> Invité</span>}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={9} />{a.org.city} · {a.org.region}
                    <span className="mx-1 text-gray-200">|</span>{a.response_rate}% répond
                    <span className="mx-1 text-gray-200">|</span>{a.avg_delay_days}j délai
                  </p>
                </div>
                <ScoreRing score={a.score_qualite} size={36} />
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  isSelected && !done ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                }`}>
                  {isSelected && !done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-3">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all">
            Annuler
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => selected && !alreadyInvited(selected) && onConfirm(selected)}
            disabled={!selected || alreadyInvited(selected)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white' }}
          >
            <Send size={13} strokeWidth={2.5} /> Envoyer la demande
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Matching() {
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterSpec,   setFilterSpec]   = useState('all')
  const [selectedDemande, setSelectedDemande] = useState('dem-01')
  const [invited, setInvited] = useState({})
  const [modal,   setModal]   = useState(null)

  const demande = DEMANDES.find(d => d.id === selectedDemande)

  const openModal  = (orgId) => setModal({ preselected: orgId })
  const closeModal = () => setModal(null)
  const handleConfirm = (orgId) => {
    setInvited(prev => ({ ...prev, [`${selectedDemande}-${orgId}`]: true }))
    setModal(null)
  }

  let adherents = ADHERENTS
  if (filterRegion !== 'all') adherents = adherents.filter(a => a.regions?.includes(filterRegion))
  if (filterSpec   !== 'all') adherents = adherents.filter(a => a.specialites?.includes(filterSpec))

  const regions = [...new Set(ADHERENTS.flatMap(a => a.regions    || []))]
  const specs   = [...new Set(ADHERENTS.flatMap(a => a.specialites || []))]

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

        {/* Page header */}
        <motion.div variants={fade} className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Matching fournisseurs</h1>
            <p className="text-sm text-gray-400 mt-0.5">Identifiez et invitez les partenaires les plus adaptés à vos demandes</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2">
            <Users size={13} className="text-indigo-500" />
            <span className="text-sm font-bold text-indigo-700">{ADHERENTS.length}</span>
            <span className="text-xs text-indigo-400 font-medium">dans le réseau</span>
          </div>
        </motion.div>

        {/* Demande selector */}
        <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center gap-2">
            <Zap size={12} className="text-indigo-400" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Demande ciblée</p>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {DEMANDES.map(d => {
              const active = selectedDemande === d.id
              return (
                <button key={d.id} onClick={() => setSelectedDemande(d.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    active
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {active && <span className="absolute inset-0 rounded-xl ring-1 ring-indigo-300/40 pointer-events-none" />}
                  <span className="font-bold">{d.ref}</span>
                  <span className="text-gray-300">—</span>
                  <span className="capitalize">{d.categorie}</span>
                  {d.urgence === 'urgent' && (
                    <span className="text-xs bg-red-50 text-red-500 border border-red-100 px-1.5 py-px rounded-md font-bold">Urgent</span>
                  )}
                </button>
              )
            })}
          </div>
          {demande && (
            <div className="px-5 py-2.5 bg-gray-50/40 border-t border-gray-50 flex items-center gap-5 flex-wrap">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                <strong className="text-gray-700">{demande.quantite} unités</strong>
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                {demande.type_demande === 'achat' ? 'Achat direct' : 'Location'}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={10} />{demande.site_name} — {demande.city}
              </span>
            </div>
          )}
        </motion.div>

        {/* Filter bar */}
        <motion.div variants={fade} className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
            <SlidersHorizontal size={12} className="text-gray-400 shrink-0" />
            <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-700 focus:outline-none cursor-pointer">
              <option value="all">Toutes les régions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
            <Shield size={12} className="text-gray-400 shrink-0" />
            <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-700 focus:outline-none cursor-pointer">
              <option value="all">Toutes les spécialités</option>
              {specs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={`ml-auto text-xs font-bold px-3.5 py-2 rounded-xl border ${
            adherents.length > 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}>
            {adherents.length} fournisseur{adherents.length > 1 ? 's' : ''} compatible{adherents.length > 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adherents.map(a => {
            const tier = TIER_CONFIG[a.tier] || TIER_CONFIG.bronze
            const wasInvited = invited[`${selectedDemande}-${a.org_id}`]
            return (
              <motion.div key={a.org_id} variants={fade}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden">

                {/* Tier accent top strip */}
                <div className="h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}22)` }} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar name={a.org.name} tier={a.tier} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <p className="text-sm font-bold text-gray-900 leading-none">{a.org.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-bold ${tier.color}`}>{tier.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin size={9} />{a.org.city} · {a.org.region}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <ScoreRing score={a.score_qualite} />
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        a.status === 'disponible'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {a.status === 'disponible' ? 'Disponible' : 'Occupé'}
                      </span>
                    </div>
                  </div>

                  {/* Specialites */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {a.specialites.map(s => (
                      <span key={s} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-medium">{s}</span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 bg-gray-50 rounded-xl border border-gray-100 divide-x divide-gray-100 mb-4">
                    <div className="py-2.5 text-center">
                      <p className="text-base font-bold" style={{ color: tier.accent }}>{a.response_rate}%</p>
                      <p className="text-xs text-gray-400 mt-0.5">Réponses</p>
                    </div>
                    <div className="py-2.5 text-center">
                      <p className="text-base font-bold text-gray-700">{a.avg_delay_days}j</p>
                      <p className="text-xs text-gray-400 mt-0.5">Délai moy.</p>
                    </div>
                    <div className="py-2.5 text-center">
                      <p className="text-base font-bold text-gray-700">{a.total_orders}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Commandes</p>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {a.certifications.map(c => (
                      <span key={c} className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                        <Shield size={9} strokeWidth={2.5} />{c}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {wasInvited ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-bold text-center flex items-center justify-center gap-2 border border-emerald-200"
                    >
                      <CheckCircle size={14} strokeWidth={2.5} /> Invitation envoyée
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.015, boxShadow: `0 6px 20px ${tier.accent}44` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(a.org_id)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-shadow"
                      style={{ background: `linear-gradient(135deg, ${tier.accent}ee, ${tier.accent}bb)`, color: 'white' }}
                    >
                      <UserPlus size={14} strokeWidth={2.5} />
                      Inviter à répondre
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty state */}
        {adherents.length === 0 && (
          <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Aucun fournisseur trouvé</p>
            <p className="text-xs text-gray-400 mt-1">Essayez d'élargir vos critères de filtrage</p>
          </motion.div>
        )}

      </motion.div>

      <AnimatePresence>
        {modal && (
          <InviteModal
            demande={demande}
            preselected={modal.preselected}
            invited={invited}
            onConfirm={handleConfirm}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  )
}
