import { useState } from 'react'
import { ArrowRight, CheckCircle, Eye, EyeOff, AlertCircle, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DEMO_ACCOUNTS = [
  {
    email: 'thomas@medicalliance.fr',
    name: 'Thomas LEONARC',
    title: 'Directeur Réseau',
    org: 'Medicalliance',
    initials: 'TL',
    roleLabel: 'Pilotage réseau',
    gradient: 'from-indigo-500 to-indigo-700',
    accentBar: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  {
    email: 'sophie@groupement-so.fr',
    name: 'Sophie Lambert',
    title: 'Responsable achats',
    org: 'Groupement Sud-Ouest',
    initials: 'SL',
    roleLabel: 'Centrale achat',
    gradient: 'from-violet-500 to-purple-700',
    accentBar: 'bg-violet-500',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
  },
  {
    email: 'pierre@medipro.fr',
    name: 'Pierre Martin',
    title: 'Directeur commercial',
    org: 'MediPro France',
    initials: 'PM',
    roleLabel: 'Adhérent',
    gradient: 'from-emerald-500 to-teal-600',
    accentBar: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  {
    email: 'isabelle@ehpad-jardins.fr',
    name: 'Isabelle Morin',
    title: 'Directrice des soins',
    org: 'EHPAD Les Jardins',
    initials: 'IM',
    roleLabel: 'Établissement',
    gradient: 'from-amber-400 to-orange-500',
    accentBar: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
]

const FEATURES = [
  'Matching intelligent fournisseurs agréés',
  'Locations médicales & renouvellements automatisés',
  'Tableau de bord unifié pour toutes les collectivités',
]

const STATS = [
  { val: '23', label: 'Établissements' },
  { val: '8',  label: 'Fournisseurs' },
  { val: '3',  label: 'Groupements' },
]

export default function Login({ onLogin }) {
  const { login } = useAuth()
  const [loadingId, setLoadingId] = useState(null)
  const [showForm,  setShowForm]  = useState(false)
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState('')

  const handleDemoLogin = async (acc) => {
    if (loadingId) return
    setLoadingId(acc.email)
    setError('')
    try {
      const user = await login(acc.email, 'demo1234')
      onLogin(user)
    } catch {
      setLoadingId(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoadingId('form')
    try {
      const user = await login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message || 'Identifiants incorrects')
      setLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ─── LEFT PANEL — Brand ───────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-[440px] shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #0f0c29 0%, #1e1b4b 45%, #0f172a 100%)' }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="mb-12">
            <div className="inline-block bg-white rounded-xl px-4 py-2 shadow-sm">
              <img src="/logo-medicalliance.jpg" alt="Medicalliance" className="h-10 w-auto object-contain" />
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-200 text-[11px] font-semibold tracking-widest uppercase">Version démo</span>
            </div>

            <h1 className="text-[28px] font-bold text-white leading-[1.3] mb-4">
              La plateforme d'achat des collectivités de santé
            </h1>
            <p className="text-slate-300/80 text-sm leading-relaxed mb-8">
              Medicalliance connecte établissements, centrales d'achat et fournisseurs agréés du réseau Occitanie pour une gestion fluide des équipements médicaux.
            </p>

            <div className="space-y-3 mb-10">
              {FEATURES.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" strokeWidth={2.2} />
                  <span className="text-slate-200/90 text-sm leading-snug">{f}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {STATS.map(s => (
                <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
                  <p className="text-2xl font-bold text-white">{s.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-600 text-xs mt-8">© 2026 Medicalliance · Tous droits réservés</p>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Login ──────────────────────────── */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-[560px]">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <img src="/logo-medicalliance.jpg" alt="Medicalliance" className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Bienvenue</h2>
            <p className="text-gray-500 text-sm mt-1">Sélectionnez votre espace pour explorer la plateforme</p>
          </div>

          {/* Demo profile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleDemoLogin(acc)}
                disabled={loadingId !== null}
                className="relative flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-4 text-left shadow-sm hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${acc.accentBar} rounded-l-2xl`} />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                  {loadingId === acc.email
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : acc.initials
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{acc.name}</p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{acc.org}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${acc.badgeBg} ${acc.badgeText}`}>
                      {acc.roleLabel}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Divider + form toggle */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium whitespace-nowrap transition-colors"
            >
              Connexion avec vos identifiants
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showForm ? 'rotate-180' : ''}`} strokeWidth={2.5} />
            </button>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Credentials form — CSS transition, no framer-motion */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: showForm ? '400px' : '0',
              opacity: showForm ? 1 : 0,
              transition: 'max-height 0.25s ease, opacity 0.2s ease',
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50 text-gray-900"
                  placeholder="vous@exemple.fr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50 text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingId !== null}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingId === 'form'
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Medicalliance · Réseau toulousain · Tous droits réservés
          </p>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-[11px] text-gray-400 leading-relaxed text-center">
              Cette version constitue un prototype de démonstration développé intégralement par{' '}
              <span className="font-semibold text-gray-500">CODE PROS</span>. L'ensemble des éléments, concepts,
              interfaces, workflows, contenus et fonctionnalités présentés demeurent la propriété exclusive de{' '}
              <span className="font-semibold text-gray-500">CODE PROS</span> et ne peuvent être reproduits, exploités,
              diffusés ou utilisés sans autorisation préalable écrite.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
