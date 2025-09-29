/**
 * Hook personnalisé pour les calculs budgétaires - Accès aux calculs du contexte
 *
 * Fonctionnalités métier :
 * - Accès direct aux résumés budgétaires calculés automatiquement
 * - Mise à jour réactive lors des changements de salaire ou dépenses
 * - Calculs optimisés dans le contexte pour éviter les recalculs inutiles
 *
 * Objectif : Fournir aux composants un accès simple et performant
 * aux calculs budgétaires pré-calculés, permettant d'afficher
 * les informations financières sans recalculer à chaque rendu.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { useBudget } from '../contexts/BudgetContext.jsx'

/**
 * Hook personnalisé pour obtenir les calculs budgétaires
 * Retourne les résumés pré-calculés depuis le contexte de budget
 * @returns {object} Résumés budgétaires annuels et mensuels
 */
export function useBudgetCalculations() {
  const { annualBudgetSummary, monthlyBudgetSummary } = useBudget()

  return {
    annualBudgetSummary,
    monthlyBudgetSummary
  }
}