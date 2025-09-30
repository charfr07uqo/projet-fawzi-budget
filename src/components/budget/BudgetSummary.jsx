/**
 * Composant de résumé budgétaire - Interface de visualisation des vues annuelles et mensuelles
 *
 * Fonctionnalités métier :
 * - Basculement entre les vues annuelles et mensuelles du budget
 * - Basculement entre les vues ménage et individuelles
 * - Affichage organisé des données budgétaires calculées
 * - Interface utilisateur intuitive avec boutons de navigation
 * - Support des budgets personnels avec couleurs individuelles
 *
 * Objectif : Fournir une vue d'ensemble claire et navigable
 * des données budgétaires, permettant aux utilisateurs de
 * comprendre leur situation financière sur différentes périodes
 * et niveaux de granularité (ménage ou individuel).
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */
import { useState } from 'react'
import { Calendar, CalendarDays, Users, User } from 'lucide-react'
import AnnualBudgetView from './AnnualBudgetView.jsx'
import MonthlyBudgetView from './MonthlyBudgetView.jsx'
import { Button } from '../ui/button.jsx'

/**
 * Composant principal de résumé budgétaire
 * Gère l'affichage des vues annuelles et mensuelles avec support ménage/individuel
 */
function BudgetSummary() {
  const [currentView, setCurrentView] = useState('annual') // 'annual' ou 'monthly'
  const [viewMode, setViewMode] = useState('household') // 'household' ou 'per-person'

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec boutons de basculement */}
      <div className="flex flex-col items-center space-y-4">
        {/* Boutons de mode de vue (Ménage/Individuel) */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={viewMode === 'household' ? 'default' : 'outline'}
            onClick={() => setViewMode('household')}
            className="min-w-[140px] transition-all duration-200 hover:scale-105"
          >
            <Users className="w-4 h-4 mr-2" />
            Vue Ménage
          </Button>
          <Button
            variant={viewMode === 'per-person' ? 'default' : 'outline'}
            onClick={() => setViewMode('per-person')}
            className="min-w-[140px] transition-all duration-200 hover:scale-105"
          >
            <User className="w-4 h-4 mr-2" />
            Vue Individuelle
          </Button>
        </div>

        {/* Boutons de période (Annuel/Mensuel) */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={currentView === 'annual' ? 'default' : 'outline'}
            onClick={() => setCurrentView('annual')}
            className="min-w-[120px] transition-all duration-200 hover:scale-105"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Vue Annuelle
          </Button>
          <Button
            variant={currentView === 'monthly' ? 'default' : 'outline'}
            onClick={() => setCurrentView('monthly')}
            className="min-w-[120px] transition-all duration-200 hover:scale-105"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Vue Mensuelle
          </Button>
        </div>
      </div>

      {/* Affichage de la vue sélectionnée */}
      <div className="mt-6">
        {currentView === 'annual' ? (
          <AnnualBudgetView viewMode={viewMode} />
        ) : (
          <MonthlyBudgetView viewMode={viewMode} />
        )}
      </div>
    </div>
  )
}

export default BudgetSummary