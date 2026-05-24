import { Search, Bell, Plus, Inbox, Menu } from 'lucide-react'
import { useState } from 'react'

const ROLE_META = {
  medicalliance: { label: 'Medicalliance', bg: 'bg-brand-50', text: 'text-brand-700' },
  centrale:      { label: 'Centrale',      bg: 'bg-violet-50', text: 'text-violet-700' },
  fournisseur:   { label: 'Adhérent',      bg: 'bg-emerald-50', text: 'text-emerald-700' },
  etablissement: { label: 'Établissement', bg: 'bg-amber-50', text: 'text-amber-700' },
}

const PAGE_TITLES = {
  dashboard:           { title: 'Dashboard',              sub: "Vue d'ensemble de votre activité" },
  demandes:            { title: 'Demandes',               sub: "Toutes les demandes d'équipements" },
  'demande-detail':    { title: 'Détail demande',         sub: 'Informations complètes et suivi' },
  'new-demande':       { title: 'Nouvelle demande',       sub: "Créez et diffusez une demande d'équipement" },
  matching:            { title: 'Matching',               sub: 'Matching intelligent avec vos fournisseurs premium' },
  offres:              { title: 'Offres & Devis',         sub: 'Comparez et sélectionnez les meilleures offres' },
  commandes:           { title: 'Commandes',              sub: 'Suivi des commandes passées' },
  'commandes-recues':  { title: 'Commandes reçues',       sub: 'Commandes en cours et historique' },
  'commandes-gagnees': { title: 'Commandes gagnées',      sub: 'Vos commandes remportées' },
  locations:           { title: 'Locations',              sub: 'Contrats de location en cours' },
  'locations-actives': { title: 'Locations actives',      sub: 'Vos contrats de location' },
  'locations-gerer':   { title: 'Locations à gérer',      sub: 'Gestion de vos locations' },
  reseau:              { title: 'Réseau premium',         sub: 'Adhérents certifiés Medicalliance' },
  centrales:           { title: 'Centrales',              sub: "Centrales d'achat et groupements actifs" },
  etablissements:      { title: 'Établissements',         sub: 'Établissements de santé membres' },
  messagerie:          { title: 'Messagerie',             sub: 'Communications et échanges' },
  reporting:           { title: 'Reporting',              sub: 'Analyses et indicateurs de performance' },
  'appels-doffres':    { title: "Appels d'offres",        sub: 'Demandes diffusées correspondant à votre profil' },
  'demandes-recues':   { title: 'Demandes reçues',        sub: 'Nouvelles demandes à traiter' },
  'reponses-devis':    { title: 'Réponses / Devis',       sub: 'Vos devis envoyés' },
  livraison:           { title: 'Livraison / Installation', sub: 'Suivi des livraisons' },
  sav:                 { title: 'SAV',                    sub: 'Tickets et demandes de support' },
  'sav-incidents':     { title: 'SAV / Incidents',        sub: 'Signalement et suivi des incidents' },
  performance:         { title: 'Performance',            sub: 'Indicateurs et évaluation' },
  'mes-besoins':       { title: 'Mes besoins',            sub: "Vue d'ensemble des équipements" },
  'suivi-demandes':    { title: 'Suivi des demandes',     sub: 'État de vos demandes en cours' },
  'compare-offers':    { title: 'Comparaison des offres', sub: 'Analyse comparative des devis' },
  budget:              { title: 'Budget',                 sub: 'Suivi budgétaire et prévisions' },
  qualite:             { title: 'Suivi qualité',          sub: 'Indicateurs qualité du réseau' },
}

const ROLE_CTA = {
  medicalliance: { label: 'Nouvelle demande', page: 'new-demande',    icon: Plus,  color: 'bg-brand-600 hover:bg-brand-700' },
  centrale:      { label: 'Nouvelle demande', page: 'new-demande',    icon: Plus,  color: 'bg-violet-600 hover:bg-violet-700' },
  fournisseur:   { label: "Appels d'offres",  page: 'appels-doffres', icon: Inbox, color: 'bg-emerald-600 hover:bg-emerald-700' },
  etablissement: { label: 'Nouvelle demande', page: 'new-demande',    icon: Plus,  color: 'bg-amber-500 hover:bg-amber-600' },
}

export default function Header({ currentPage, onNavigate, user, onMobileMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const role = user?.role || 'medicalliance'
  const { title, sub } = PAGE_TITLES[currentPage] || PAGE_TITLES.dashboard
  const cta    = ROLE_CTA[role]
  const CtaIcon = cta?.icon || Plus

  return (
    <header className="h-14 shrink-0 bg-white border-b border-surface-200 flex items-center px-3 lg:px-6 gap-3">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-9 h-9 rounded-lg hover:bg-surface-50 flex items-center justify-center shrink-0 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" strokeWidth={2} />
      </button>

      {/* Page title */}
      <div className="min-w-0 flex-1 lg:flex-none">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900 truncate">{title}</h1>
          {user?.role && (
            <span className={`hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-[0.25em] px-2 py-1 rounded-full ${ROLE_META[user.role]?.bg || 'bg-surface-50'} ${ROLE_META[user.role]?.text || 'text-gray-700'}`}>
              {ROLE_META[user.role]?.label}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate hidden lg:block mt-0.5">{sub}</p>
      </div>

      {/* Search bar — hidden on mobile */}
      <div className={`hidden md:flex flex-1 max-w-sm relative transition-all duration-200 ${searchFocused ? 'max-w-md' : ''}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher…"
          className="w-full pl-9 pr-10 py-1.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-mono hidden lg:block">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="relative w-8 h-8 rounded-lg hover:bg-surface-50 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-gray-500" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
        </button>

        {cta && (
          <button
            onClick={() => onNavigate(cta.page)}
            className={`hidden sm:flex items-center gap-1.5 ${cta.color} text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm`}
          >
            <CtaIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="hidden md:inline">{cta.label}</span>
          </button>
        )}
      </div>
    </header>
  )
}
