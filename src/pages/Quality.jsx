import { motion } from 'framer-motion'
import { Star, TrendingUp, AlertCircle, CheckCircle, BarChart3, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

// Score qualité par adhérent
const QUALITY_SCORES = [
  { name: 'MediPro France',          score: 98, orders: 342, avg_delay: 3, tier: 'Gold' },
  { name: 'SudMed Equipements',      score: 94, orders: 218, avg_delay: 4, tier: 'Premium' },
  { name: 'Atlantique Médical',      score: 91, orders: 267, avg_delay: 4, tier: 'Premium' },
  { name: 'HealthCare Sud',          score: 88, orders: 195, avg_delay: 5, tier: 'Standard' },
  { name: 'Méditec PSDM',            score: 85, orders: 142, avg_delay: 6, tier: 'Standard' },
  { name: 'Nord Médical Services',   score: 82, orders: 156, avg_delay: 7, tier: 'Standard' },
]

// Évolution qualité
const QUALITY_TREND = [
  { month: 'Jan', avg_score: 82.5 },
  { month: 'Fév', avg_score: 84.2 },
  { month: 'Mar', avg_score: 85.8 },
  { month: 'Avr', avg_score: 87.1 },
  { month: 'Mai', avg_score: 88.4 },
  { month: 'Juin', avg_score: 89.2 },
]

// Critères de qualité
const QUALITY_METRICS = [
  { label: 'Score moyen adhérents',  value: '88.2', sub: 'tous les fournisseurs' },
  { label: 'Respect délais',         value: '94%', sub: 'conformité aux SLA' },
  { label: 'Taux satisfaction',      value: '91%', sub: 'établissements' },
  { label: 'Non-conformités',        value: '12', sub: 'signalées ce mois' },
]

// Incidents récents
const RECENT_INCIDENTS = [
  {
    id: 'INC-2024-156',
    fournisseur: 'Méditec PSDM',
    type: 'Retard livraison',
    severity: 'Majeur',
    severityColor: 'bg-red-50 text-red-700 border-red-200',
    date: '2024-06-18',
    status: 'En investigation',
  },
  {
    id: 'INC-2024-155',
    fournisseur: 'Nord Médical Services',
    type: 'Produit défectueux',
    severity: 'Mineur',
    severityColor: 'bg-amber-50 text-amber-700 border-amber-200',
    date: '2024-06-15',
    status: 'Résolu',
  },
  {
    id: 'INC-2024-154',
    fournisseur: 'HealthCare Sud',
    type: 'Documentation incomplète',
    severity: 'Mineur',
    severityColor: 'bg-amber-50 text-amber-700 border-amber-200',
    date: '2024-06-12',
    status: 'Résolu',
  },
]

// Certifications
const CERTIFICATIONS = [
  { name: 'ISO 9001', fournisseurs: 14, coverage: '87%' },
  { name: 'NF EN 62353', fournisseurs: 12, coverage: '75%' },
  { name: 'QUALISAN', fournisseurs: 11, coverage: '69%' },
]

export default function Quality() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      {/* KPIs */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUALITY_METRICS.map(m => (
          <div key={m.label} className="surface rounded-xl p-5 shadow-card">
            <p className="text-xs text-gray-500 mb-2">{m.label}</p>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-2">{m.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Alertes */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl p-4 border flex items-center gap-3 text-emerald-700 bg-emerald-50 border-emerald-200">
          <CheckCircle size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">Score qualité en hausse</p>
            <p className="text-xs opacity-80 mt-0.5">+0.8 points vs mai · Tendance positive</p>
          </div>
        </div>
        <div className="rounded-xl p-4 border flex items-center gap-3 text-amber-700 bg-amber-50 border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">1 adhérent en surveillance</p>
            <p className="text-xs opacity-80 mt-0.5">Méditec PSDM : 2 incidents en 2 mois</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Trend line chart */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-1">Évolution du score qualité</h2>
          <p className="text-xs text-gray-500 mb-4">Moyenne mensuelle des adhérents</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={QUALITY_TREND}>
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 92]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#a5b4fc' }}
                formatter={v => [`${v.toFixed(1)}/100`, 'Score']}
              />
              <Line type="monotone" dataKey="avg_score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Certifications */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-1">Certifications</h2>
          <p className="text-xs text-gray-500 mb-4">Couverture réseau</p>
          <div className="space-y-3">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.name}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-400">{cert.coverage}</p>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                    style={{ width: cert.coverage }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{cert.fournisseurs} fournisseurs</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scores détaillés */}
      <motion.div variants={fade} className="surface rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-surface-100">
          <h2 className="font-semibold text-gray-900">Scores qualité adhérents</h2>
        </div>
        <div className="divide-y divide-surface-100">
          {QUALITY_SCORES.map(adhérent => (
            <div key={adhérent.name} className="px-6 py-4 hover:bg-surface-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{adhérent.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      adhérent.tier === 'Gold' ? 'bg-yellow-50 text-yellow-700' :
                      adhérent.tier === 'Premium' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {adhérent.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{adhérent.orders} commandes · Délai moy. {adhérent.avg_delay}j</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">{adhérent.score}</span>
                  </div>
                  <p className="text-xs text-gray-400">/100</p>
                </div>
              </div>
              {/* Score bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all"
                  style={{
                    width: `${adhérent.score}%`,
                    background: adhérent.score >= 95 ? '#10b981' : adhérent.score >= 85 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Incidents récents */}
      <motion.div variants={fade} className="surface rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-surface-100">
          <h2 className="font-semibold text-gray-900">Incidents signalés (derniers 30j)</h2>
        </div>
        <div className="divide-y divide-surface-100">
          {RECENT_INCIDENTS.map(incident => (
            <div key={incident.id} className="px-6 py-4 hover:bg-surface-50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-400">{incident.id}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{incident.fournisseur}</p>
                  <p className="text-xs text-gray-500 mt-1">{incident.type}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border mb-1 inline-block ${incident.severityColor}`}>
                    {incident.severity}
                  </span>
                  <p className="text-xs text-gray-400">{new Date(incident.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-medium">Status: {incident.status}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  )
}
