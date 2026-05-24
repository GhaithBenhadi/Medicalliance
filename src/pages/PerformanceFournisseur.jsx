import { motion } from 'framer-motion'
import { TrendingUp, Star, Award, Clock, CheckCircle, ShieldCheck, Package } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { ADHERENTS } from '../lib/mockData'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const MONTHLY = [
  { mois: 'Nov', reponses: 14, commandes: 8, ca: 62000 },
  { mois: 'Déc', reponses: 18, commandes: 11, ca: 78000 },
  { mois: 'Jan', reponses: 22, commandes: 14, ca: 91000 },
  { mois: 'Fév', reponses: 19, commandes: 12, ca: 84000 },
  { mois: 'Mar', reponses: 25, commandes: 16, ca: 105000 },
  { mois: 'Avr', reponses: 28, commandes: 18, ca: 118000 },
]

const QUALITE_ITEMS = [
  { label: 'Taux de réponse',      value: 97, max: 100, color: '#10b981', unit: '%' },
  { label: 'Délai moyen livraison', value: 3,  max: 10,  color: '#6366f1', unit: 'j', inverse: true },
  { label: 'Score qualité global', value: 98, max: 100, color: '#f59e0b', unit: '/100' },
  { label: 'Taux de satisfaction', value: 94, max: 100, color: '#8b5cf6', unit: '%' },
]

const BADGES = [
  { label: 'Gold Partner',       icon: Award,      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',   desc: 'Meilleur taux de réponse' },
  { label: 'Livraison express',  icon: Clock,      color: 'text-blue-700 bg-blue-50 border-blue-200',         desc: 'Délai moyen < 4 jours' },
  { label: 'Qualité certifiée',  icon: ShieldCheck,color: 'text-emerald-700 bg-emerald-50 border-emerald-200',desc: 'ISO 9001 · NF EN 62353' },
  { label: 'Top vendeur',        icon: TrendingUp, color: 'text-purple-700 bg-purple-50 border-purple-200',   desc: '342 commandes honorées' },
]

function ScoreArc({ value, color, size = 80 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const track = color + '22'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={16} fontWeight="800">{value}</text>
    </svg>
  )
}

export default function PerformanceFournisseur({ user }) {
  const orgId = user?.org_id || 'org-10'
  const adherent = ADHERENTS.find(a => a.org_id === orgId) || ADHERENTS[0]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Performance</h1>
          <p className="text-sm text-gray-400 mt-0.5">Indicateurs de performance et réputation sur le réseau</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3.5 py-2">
          <Star size={13} className="text-yellow-500" fill="currentColor" />
          <span className="text-sm font-bold text-yellow-700">Gold</span>
          <span className="text-xs text-yellow-500 font-medium">Adhérent</span>
        </div>
      </motion.div>

      {/* Score cards */}
      <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUALITE_ITEMS.map(item => (
          <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-2">
            <ScoreArc value={item.inverse ? Math.round((1 - item.value / item.max) * 100 + 10) : item.value} color={item.color} />
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">{item.value}{item.unit}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight text-center">{item.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Badges */}
      <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Distinctions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map(b => {
            const Icon = b.icon
            return (
              <div key={b.label} className={`rounded-xl border p-3 flex flex-col items-center gap-2 text-center ${b.color}`}>
                <Icon size={20} strokeWidth={1.8} />
                <div>
                  <p className="text-xs font-bold leading-tight">{b.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{b.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Charts row */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* CA mensuel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Chiffre d'affaires mensuel</p>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">+12% ce mois</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={MONTHLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`${v.toLocaleString('fr-FR')} €`, 'CA']}
                contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2} fill="url(#caGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Réponses vs Commandes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-gray-800 mb-4">Réponses vs Commandes</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={MONTHLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="reponses"  fill="#e0e7ff" radius={[4,4,0,0]} name="Réponses" />
              <Bar dataKey="commandes" fill="#6366f1" radius={[4,4,0,0]} name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Résumé activité */}
      <motion.div variants={fade} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Activité cumulée</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package,      label: 'Commandes honorées', value: adherent.total_orders, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: CheckCircle,  label: 'Taux satisfaction',  value: '94%',                color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Clock,        label: 'Délai moyen',        value: `${adherent.avg_delay_days} jours`, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: TrendingUp,   label: 'CA total réseau',    value: '52 000 €',          color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <Icon size={16} className={s.color} />
                </div>
                <div>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 leading-tight">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

    </motion.div>
  )
}
