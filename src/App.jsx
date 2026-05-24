import { useState } from 'react'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Shared pages
import Demandes from './pages/Demandes'
import DemandeDetail from './pages/DemandeDetail'
import NewDemande from './pages/NewDemande'
import Offres from './pages/Offres'
import Commandes from './pages/Commandes'
import Locations from './pages/Locations'
import Messagerie from './pages/Messagerie'
import Reporting from './pages/Reporting'

// Medicalliance-only
import Dashboard from './pages/Dashboard'
import Matching from './pages/Matching'
import Reseau from './pages/Reseau'
import Centrales from './pages/Centrales'
import Quality from './pages/Quality'

// Role-specific dashboards
import DashboardCentrale from './pages/DashboardCentrale'
import DashboardFournisseur from './pages/DashboardFournisseur'
import DashboardEtablissement from './pages/DashboardEtablissement'

// Fournisseur-specific
import AppelsDOffres from './pages/AppelsDOffres'
import DemandesRecues from './pages/DemandesRecues'
import LivraisonInstallation from './pages/LivraisonInstallation'
import SAV from './pages/SAV'
import PerformanceFournisseur from './pages/PerformanceFournisseur'

// Centrale-specific
import Budget from './pages/Budget'
import Etablissements from './pages/Etablissements'

// Etablissement-specific
import MesBesoins from './pages/MesBesoins'
import SAVIncidents from './pages/SAVIncidents'

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
    'new-demande': NewDemande, // Création de demande
    demandes: Demandes,        // Consultations
    'compare-offers': Offres,   // Comparaison des offres
    commandes: Commandes,
    locations: Locations,
    budget: Budget,
  },
  fournisseur: {
    dashboard:          DashboardFournisseur,
    'appels-doffres':   AppelsDOffres,
    'demandes-recues':  DemandesRecues,
    'reponses-devis':   Offres,
    'commandes-gagnees':Commandes,
    'locations-gerer':  Locations,
    livraison:          LivraisonInstallation,
    sav:                SAV,
    performance:        PerformanceFournisseur,
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
        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 lg:px-6 lg:py-6">
          <PageComponent onNavigate={navigate} params={pageParams} user={user} />
        </main>
      </div>
    </div>
  )
}
