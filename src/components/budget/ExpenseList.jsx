/**
 * Composant de liste des dépenses - Affichage de toutes les dépenses
 *
 * Fonctionnalités métier :
 * - Affichage de la liste complète des dépenses
 * - Tri et organisation des dépenses
 * - Gestion des états vides
 * - Interface claire pour la visualisation
 *
 * Objectif : Fournir une vue d'ensemble organisée des dépenses
 * enregistrées, permettant à l'utilisateur de consulter
 * facilement toutes ses charges financières.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { useBudget } from '../../contexts/BudgetContext.jsx'
import { Receipt } from 'lucide-react'
import { UI_LABELS } from '../../models/constants.js'
import ExpenseItem from './ExpenseItem.jsx'
import { useEffect, useRef } from 'react'

/**
 * Composant d'affichage de la liste des dépenses
 * @returns {JSX.Element} Liste des dépenses
 */
function ExpenseList() {
  const { expenses } = useBudget()
  const previousExpensesRef = useRef()

  // Track changes in expenses for debugging (can be removed in production)
  useEffect(() => {
    previousExpensesRef.current = expenses
  }, [expenses])

  // Tri des dépenses par date de création (plus récentes en premier)
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Dépenses ({expenses.length})
      </h3>

      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg mb-2 font-medium">{UI_LABELS.NO_EXPENSES}</p>
          <p className="text-sm">
            Utilisez le formulaire ci-dessus pour ajouter vos premières dépenses
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpenseList
