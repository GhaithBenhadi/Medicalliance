import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign, PieChart as PieChartIcon, BarChart3 } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

// Budget mensuel
const MONTHLY_BUDGET = [
  { mois: 'Jan', depense: 145000, budget: 180000 },
  { mois: 'Fév', depense: 162000, budget: 180000 },
  { mois: 'Mar', depense: 178000, budget: 180000 },
  { mois: 'Avr', depense: 171000, budget: 180000 },
  { mois: 'Mai', depense: 188000, budget: 200000 },
  { mois: 'Juin', depense: 195000, budget: 200000 },
]

// Répartition par catégorie
const BUDGET_BY_CATEGORY = [
  { name: 'Lits médicalisés',      budget: 420000, used: 385000, color: '#6366f1' },
  { name: 'Fauteuils roulants',    budget: 280000, used: 245000, color: '#8b5cf6' },
  { name: 'Équipements de soins',  budget: 180000, used: 162000, color: '#06b6d4' },
  { name: 'Manutention / Levage',  budget: 120000, used: 95000,  color: '#10b981' },
]

// Pie chart données
const CATEGORY_PIE = BUDGET_BY_CATEGORY.map(c => ({
  name: c.name,
  value: c.budget,
  color: c.color,
}))

// Achats majeurs récents
const MAJOR_PURCHASES = [
  {
    id: 'ACH-2024-0247',
    etablissement: 'EHPAD Les Jardins',
    item: '12 × Lits médicalisés électriques',
    amount: 48000,
    date: '2024-06-15',
    status: 'Livré',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'ACH-2024-0246',
    etablissement: 'Clinique Saint-Joseph',
    item: '8 × Fauteuils roulants motorisés',
    amount: 32000,
    date: '2024-06-10',
    status: 'En livraison',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'ACH-2024-0245',
    etablissement: 'HAD Sud-Ouest',
    item: '5 × Lève-patients fixes',
    amount: 18500,
    date: '2024-06-05',
    status: 'Livré',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'ACH-2024-0244',
    etablissement: 'EHPAD Bellevue',
    item: '20 × Matelas anti-escarre',
    amount: 8400,
    date: '2024-05-28',
    status: 'Livré',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
]

// Budget par établissement
const BUDGET_BY_ETAB = [
  { name: 'EHPAD Les Jardins',      allocated: 120000, used: 95000, forecast: 15000 },
  { name: 'Clinique Saint-Joseph',  allocated: 85000,  used: 68000, forecast: 12000 },
  { name: 'HAD Sud-Ouest',          allocated: 65000,  used: 52000, forecast: 8000 },
  { name: 'EHPAD Bellevue',         allocated: 55000,  used: 38000, forecast: 6000 },
]

export default function Budget() {
  const totalBudget = BUDGET_BY_CATEGORY.reduce((sum, c) => sum + c.budget, 0)
  const totalUsed = BUDGET_BY_CATEGORY.reduce((sum, c) => sum + c.used, 0)
  const totalRemaining = totalBudget - totalUsed
  const usagePercent = Math.round((totalUsed / totalBudget) * 100)

  const stats = [
    { 
      label: 'Budget annuel', 
      value: `${(totalBudget / 1000).toFixed(0)}k€`,
      sub: 'Total alloué',
      icon: DollarSign,
      color: 'from-violet-500 to-purple-600',
    },
    { 
      label: 'Dépenses engagées',
      value: `${(totalUsed / 1000).toFixed(0)}k€`,
      sub: `${usagePercent}% utilisé`,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
    },
    { 
      label: 'Budget restant',
      value: `${(totalRemaining / 1000).toFixed(0)}k€`,
      sub: `${100 - usagePercent}% disponible`,
      icon: TrendingDown,
      color: 'from-emerald-500 to-green-600',
    },
  ]

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

      {/* KPIs */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="surface rounded-xl p-5 flex items-start gap-4 shadow-card">
              <div className={`bg-gradient-to-br ${s.color} rounded-lg p-3 shadow-glow`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Alertes budgétaires */}
      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl p-4 border flex items-center gap-3 text-amber-700 bg-amber-50 border-amber-200">
          <AlertCircle size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">2 catégories proches du seuil</p>
            <p className="text-xs opacity-80 mt-0.5">Lits médicalisés à 92% · Fauteuils roulants à 87%</p>
          </div>
        </div>
        <div className="rounded-xl p-4 border flex items-center gap-3 text-emerald-700 bg-emerald-50 border-emerald-200">
          <CheckCircle size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">Prévisions Q3 favorables</p>
            <p className="text-xs opacity-80 mt-0.5">Trajectoire budgétaire alignée : +2.3%</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area chart dépenses */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-1">Dépenses mensuelles</h2>
          <p className="text-xs text-gray-500 mb-4">Suivi vs Budget alloué</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_BUDGET}>
              <defs>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }} 
                itemStyle={{ color: '#a5b4fc' }}
                formatter={v => [`${(v/1000).toFixed(0)}k€`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="depense" stroke="#f59e0b" strokeWidth={2} fill="url(#budgetGrad)" name="Dépenses" />
              <Area type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Budget" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie répartition */}
        <motion.div variants={fade} className="surface rounded-xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-1">Répartition</h2>
          <p className="text-xs text-gray-500 mb-4">Par catégorie d'équipement</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CATEGORY_PIE} cx="50%" cy="50%" outerRadius={60}
                paddingAngle={2} dataKey="value">
                {CATEGORY_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                itemStyle={{ color: '#e2e8f0' }} 
                formatter={v => `${(v/1000).toFixed(0)}k€`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Budgets par catégorie */}
      <motion.div variants={fade} className="surface rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-surface-100">
          <h2 className="font-semibold text-gray-900">Budgets par catégorie</h2>
        </div>
        <div className="divide-y divide-surface-100">
          {BUDGET_BY_CATEGORY.map(cat => {
            const usagePercentCat = Math.round((cat.used / cat.budget) * 100)
            const remaining = cat.budget - cat.used
            return (
              <div key={cat.name} className="px-6 py-4 hover:bg-surface-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{usagePercentCat}% utilisé · {(remaining/1000).toFixed(0)}k€ restant</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{(cat.used/1000).toFixed(0)}k€</p>
                    <p className="text-xs text-gray-400">sur {(cat.budget/1000).toFixed(0)}k€</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${usagePercentCat}%`,
                      background: usagePercentCat > 90 ? '#ef4444' : usagePercentCat > 75 ? '#f59e0b' : '#10b981'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Achats majeurs */}
        <motion.div variants={fade} className="lg:col-span-2 surface rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-surface-100">
            <h2 className="font-semibold text-gray-900">Achats majeurs (derniers 30j)</h2>
          </div>
          <div className="divide-y divide-surface-100">
            {MAJOR_PURCHASES.map(p => (
              <div key={p.id} className="px-6 py-4 hover:bg-surface-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-gray-400">{p.id}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{p.item}</p>
                    <p className="text-xs text-gray-500 mt-1">{p.etablissement}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-bold text-gray-900">{(p.amount/1000).toFixed(0)}k€</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span></span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Budget par établissement */}
        <motion.div variants={fade} className="surface rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-surface-100">
            <h2 className="font-semibold text-gray-900 text-sm">Budget par établissement</h2>
          </div>
          <div className="divide-y divide-surface-50">
            {BUDGET_BY_ETAB.map(etab => {
              const usagePercent = Math.round((etab.used / etab.allocated) * 100)
              return (
                <div key={etab.name} className="px-4 py-3">
                  <p className="text-xs font-semibold text-gray-900 truncate">{etab.name}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{usagePercent}% utilisé</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="h-full transition-all"
                      style={{
                        width: `${usagePercent}%`,
                        background: usagePercent > 90 ? '#ef4444' : usagePercent > 75 ? '#f59e0b' : '#06b6d4'
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-gray-400">{(etab.used/1000).toFixed(0)}k€</span>
                    <span className="text-[10px] text-gray-400">{(etab.allocated/1000).toFixed(0)}k€</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}
