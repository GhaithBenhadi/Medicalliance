import { useState, lazy, Suspense } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

const Dashboard             = lazy(() => import('./pages/Dashboard'))
const Demandes              = lazy(() => import('./pages/Demandes'))
const DemandeDetail         = lazy(() => import('./pages/DemandeDetail'))
const NewDemande            = lazy(() => import('./pages/NewDemande'))
const Offres                = lazy(() => import('./pages/Offres'))
const Commandes             = lazy(() => import('./pages/Commandes'))
const Locations             = lazy(() => import('./pages/Locations'))
const Messagerie            = lazy(() => import('./pages/Messagerie'))
const Reporting             = lazy(() => import('./pages/Reporting'))
const Matching              = lazy(() => import('./pages/Matching'))
const Reseau                = lazy(() => import('./pages/Reseau'))
const Centrales             = lazy(() => import('./pages/Centrales'))
const Quality               = lazy(() => import('./pages/Quality'))
const DashboardCentrale     = lazy(() => import('./pages/DashboardCentrale'))
const DashboardFournisseur  = lazy(() => import('./pages/DashboardFournisseur'))
const DashboardEtablissement= lazy(() => import('./pages/DashboardEtablissement'))
const AppelsDOffres         = lazy(() => import('./pages/AppelsDOffres'))
const DemandesRecues        = lazy(() => import('./pages/DemandesRecues'))
const LivraisonInstallation = lazy(() => import('./pages/LivraisonInstallation'))
const SAV                   = lazy(() => import('./pages/SAV'))
const PerformanceFournisseur= lazy(() => import('./pages/PerformanceFournisseur'))
const Budget                = lazy(() => import('./pages/Budget'))
const Etablissements        = lazy(() => import('./pages/Etablissements'))
const MesBesoins            = lazy(() => import('./pages/MesBesoins'))
const SAVIncidents          = lazy(() => import('./pages/SAVIncidents'))

const PAGES_BY_ROLE = {
  medicalliance: {
    dashboard: Dashboard,
    demandes: Demandes,
    matching: Matching,
    reseau: Reseau,
    centrales: Centrales,
    qualite: Quality,
    reporting: Reporting,
  },
  centrale: {
    dashboard: DashboardCentrale,
    etablissements: Etablissements,
    'new-demande': NewDemande,
    demandes: Demandes,
    'compare-offers': Offres,
    commandes: Commandes,
    locations: Locations,
    budget: Budget,
  },
  fournisseur: {
    dashboard:           DashboardFournisseur,
    'appels-doffres':    AppelsDOffres,
    'demandes-recues':   DemandesRecues,
    'reponses-devis':    Offres,
    'commandes-gagnees': Commandes,
    'locations-gerer':   Locations,
    livraison:           LivraisonInstallation,
    sav:                 SAV,
    performance:         PerformanceFournisseur,
  },
  etablissement: {
    dashboard:           DashboardEtablissement,
    'mes-besoins':       MesBesoins,
    'new-demande':       NewDemande,
    'suivi-demandes':    Demandes,
    'commandes-recues':  Commandes,
    'locations-actives': Locations,
    'sav-incidents':     SAVIncidents,
  },
}

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setPage] = useState('dashboard')
  const [pageParams, setParams] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (page, params = {}) => { setPage(page); setParams(params); setSidebarOpen(false) }

  if (!user) return <Login onLogin={(u) => { setUser(u); setPage('dashboard') }} />

  const pages = PAGES_BY_ROLE[user.role] || PAGES_BY_ROLE.medicalliance
  const PageComponent = pages[currentPage] || pages.dashboard

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden w-full">
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        onLogout={() => { setUser(null); setPage('dashboard') }}
        user={user}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentPage={currentPage}
          onNavigate={navigate}
          user={user}
          onMobileMenuToggle={() => setSidebarOpen(v => !v)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 lg:px-6 lg:py-6 flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <PageComponent onNavigate={navigate} params={pageParams} user={user} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
