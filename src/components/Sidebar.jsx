import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Plus, FileText, GitMerge, Package2, ShoppingCart,
  RefreshCw, Network, Building2, MessageSquare, BarChart3,
  Inbox, ClipboardList, Truck, Stethoscope, ChevronLeft, ChevronRight,
  LogOut, Settings, HelpCircle, Bell, Wrench, TrendingUp, MailOpen,
  AlertTriangle, X,
} from 'lucide-react'

const NAV_BY_ROLE = {
  medicalliance: [
    {
      section: 'Plateforme',
      items: [
        { id: 'dashboard',      label: 'Dashboard réseau',        icon: LayoutDashboard, badge: null },
        { id: 'demandes',       label: 'Demandes à piloter',      icon: FileText,        badge: '7' },
        { id: 'matching',       label: 'Matching fournisseurs',   icon: GitMerge,        badge: null },
      ],
    },
    {
      section: 'Réseau',
      items: [
        { id: 'reseau',         label: 'Réseau premium',          icon: Network,         badge: null },
        { id: 'centrales',      label: 'Centrales / Groupements', icon: Building2,       badge: '12' },
      ],
    },
    {
      section: 'Pilotage',
      items: [
        { id: 'qualite',        label: 'Suivi qualité',           icon: BarChart3,       badge: null },
        { id: 'reporting',      label: 'Reporting',               icon: FileText,        badge: null },
      ],
    },
  ],
  centrale: [
    {
      section: 'Tableau de bord',
      items: [
        { id: 'dashboard',      label: 'Dashboard acheteur',      icon: LayoutDashboard, badge: null },
      ],
    },
    {
      section: 'Organisation',
      items: [
        { id: 'etablissements', label: 'Établissements',          icon: Building2,       badge: null },
      ],
    },
    {
      section: 'Demandes & consultations',
      items: [
        { id: 'new-demande',    label: 'Création de demande',     icon: Plus,            badge: null },
        { id: 'demandes',       label: 'Consultations',           icon: FileText,        badge: null },
      ],
    },
    {
      section: 'Comparaison & suivi',
      items: [
        { id: 'compare-offers', label: 'Comparaison des offres',  icon: Inbox,           badge: null },
        { id: 'commandes',      label: 'Commandes',               icon: ShoppingCart,    badge: null },
        { id: 'locations',      label: 'Locations',               icon: RefreshCw,       badge: null },
        { id: 'budget',         label: 'Budget',                  icon: BarChart3,       badge: null },
      ],
    },
  ],
  fournisseur: [
    {
      section: 'Mon activité',
      items: [
        { id: 'dashboard',         label: 'Dashboard',               icon: LayoutDashboard, badge: null },
      ],
    },
    {
      section: 'Commercial',
      items: [
        { id: 'appels-doffres',    label: "Appels d'offres",          icon: Inbox,           badge: '3' },
        { id: 'demandes-recues',   label: 'Demandes reçues',          icon: MailOpen,        badge: '2' },
        { id: 'reponses-devis',    label: 'Réponses / Devis',         icon: ClipboardList,   badge: null },
      ],
    },
    {
      section: 'Exécution',
      items: [
        { id: 'commandes-gagnees', label: 'Commandes gagnées',        icon: ShoppingCart,    badge: null },
        { id: 'locations-gerer',   label: 'Locations à gérer',        icon: RefreshCw,       badge: null },
        { id: 'livraison',         label: 'Livraison / Installation', icon: Truck,           badge: '1' },
      ],
    },
    {
      section: 'Support & Pilotage',
      items: [
        { id: 'sav',               label: 'SAV',                      icon: Wrench,          badge: '1' },
        { id: 'performance',       label: 'Performance',              icon: TrendingUp,      badge: null },
      ],
    },
  ],
  etablissement: [
    {
      section: 'Mon espace',
      items: [
        { id: 'dashboard',          label: 'Dashboard',              icon: LayoutDashboard, badge: null },
      ],
    },
    {
      section: 'Mes demandes',
      items: [
        { id: 'mes-besoins',        label: 'Mes besoins',            icon: Package2,        badge: null },
        { id: 'new-demande',        label: 'Nouvelle demande',       icon: Plus,            badge: null },
        { id: 'suivi-demandes',     label: 'Suivi des demandes',     icon: FileText,        badge: '3' },
      ],
    },
    {
      section: 'Suivi',
      items: [
        { id: 'commandes-recues',   label: 'Commandes reçues',       icon: ShoppingCart,    badge: null },
        { id: 'locations-actives',  label: 'Locations actives',      icon: RefreshCw,       badge: '1' },
      ],
    },
    {
      section: 'Support',
      items: [
        { id: 'sav-incidents',      label: 'SAV / Incidents',        icon: AlertTriangle,   badge: '1' },
      ],
    },
  ],
}

const ROLE_META = {
  medicalliance: { label: 'Medicalliance',  color: 'bg-brand-600',   textColor: 'text-brand-700',  bg: 'bg-brand-50' },
  centrale:      { label: 'Centrale',       color: 'bg-violet-600',  textColor: 'text-violet-700', bg: 'bg-violet-50' },
  fournisseur:   { label: 'Adhérent',       color: 'bg-emerald-600', textColor: 'text-emerald-700',bg: 'bg-emerald-50' },
  etablissement: { label: 'Établissement',  color: 'bg-amber-500',   textColor: 'text-amber-700',  bg: 'bg-amber-50' },
}

export default function Sidebar({ currentPage, onNavigate, onLogout, user, mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const role     = user?.role || 'medicalliance'
  const sections = NAV_BY_ROLE[role] || NAV_BY_ROLE.medicalliance
  const meta     = ROLE_META[role]   || ROLE_META.medicalliance
  const orgName  = user?.organisations?.name || 'Organisation'
  const initials = (user?.full_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleNavigate = (id) => {
    onNavigate(id)
    onMobileClose?.()
  }

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className={[
          'bg-white border-r border-surface-200 flex flex-col h-screen overflow-hidden',
          // Mobile: fixed drawer, off-screen by default
          'fixed inset-y-0 left-0 z-50',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          // Desktop: static in flow, no translate
          'lg:relative lg:z-auto lg:shrink-0 lg:translate-x-0 lg:transition-none lg:shadow-none',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-surface-100 shrink-0 relative">
          <div className={`w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center shadow-sm shrink-0`}>
            <Stethoscope className="w-4 h-4 text-white" strokeWidth={2.2} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden flex-1"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap">Medicalliance</span>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.bg} ${meta.textColor} whitespace-nowrap`}>
                  {meta.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop collapse toggle — floating pill on the edge */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-300 shadow-md items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:shadow-lg transition-all z-10"
          >
            {collapsed
              ? <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
              : <ChevronLeft  className="w-3 h-3" strokeWidth={2.5} />
            }
          </button>

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden ml-auto w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pt-4 pb-2 overflow-y-auto scrollbar-thin space-y-4">
          {sections.map(({ section, items }) => (
            <div key={section}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1.5"
                  >
                    {section}
                  </motion.p>
                )}
              </AnimatePresence>
              <ul className="space-y-0.5">
                {items.map(({ id, label, icon: Icon, badge }) => {
                  const active = currentPage === id
                  return (
                    <li key={id}>
                      <button
                        onClick={() => handleNavigate(id)}
                        title={collapsed ? label : undefined}
                        className={[
                          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                          active ? 'bg-brand-50 text-brand-700 shadow-xs' : 'text-gray-600 hover:bg-surface-50 hover:text-gray-900',
                          collapsed ? 'justify-center' : '',
                        ].join(' ')}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${active ? 'text-brand-600' : 'text-gray-400'}`}
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="flex-1 text-left whitespace-nowrap overflow-hidden"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!collapsed && badge && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Alert pill */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 pb-2"
            >
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800">Alertes renouvellement</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">Locations expirant bientôt</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom */}
        <div className="border-t border-surface-100 px-2 py-3 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <button
                title="Paramètres"
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-surface-50 hover:text-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                <span className="text-xs">Paramètres</span>
              </button>
              <button
                title="Aide"
                className="w-8 h-8 rounded-lg hover:bg-surface-50 flex items-center justify-center transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
              </button>
            </div>
          )}

          {/* User row */}
          <div className={`flex items-center gap-2.5 px-2 py-2 mt-1 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <div className={`w-7 h-7 rounded-full ${meta.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {initials}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-gray-800 truncate whitespace-nowrap">{user?.full_name}</p>
                  <p className="text-[11px] text-gray-400 truncate whitespace-nowrap">{orgName}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-1 ${meta.bg} ${meta.textColor}`}>
                    {meta.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={onLogout}
                title="Déconnexion"
                className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
