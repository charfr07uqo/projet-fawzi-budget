/**
 * Composant d'élément de dépense - Affichage d'une dépense individuelle
 *
 * Fonctionnalités métier :
 * - Affichage détaillé d'une dépense (nom, montant, fréquence, catégorie)
 * - Actions de modification et suppression
 * - Formatage approprié des montants
 * - Interface utilisateur cohérente
 *
 * Objectif : Présenter chaque dépense de manière claire et
 * permettre à l'utilisateur de gérer individuellement
 * ses éléments de dépenses avec des actions intuitives.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { formatExpenseAmount } from '../../utils/formatters.js'
import {
  EXPENSE_FREQUENCY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  UI_LABELS
} from '../../models/constants.js'

/**
 * Composant d'affichage d'une dépense individuelle
 * @param {object} props - Propriétés du composant
 * @param {object} props.expense - Données de la dépense
 * @returns {JSX.Element} Élément de dépense
 */
function ExpenseItem({ expense }) {
  const { deleteExpense } = useBudget()

  /**
   * Gère la suppression de la dépense
   * Demande confirmation avant suppression
   */
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${expense.name}" ?`)) {
      deleteExpense(expense.id)
    }
  }

  /**
   * Gère la modification de la dépense
   * Placeholder pour la fonctionnalité d'édition future
   */
  const handleEdit = () => {
    // TODO: Implémenter la fonctionnalité d'édition
    console.log('Édition de la dépense:', expense.id)
  }

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-medium text-foreground mb-1">
          {expense.name}
        </h4>
        <span className="text-lg font-semibold text-green-600 block mb-2">
          {formatExpenseAmount(expense.amount, expense.frequency)}
        </span>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {EXPENSE_FREQUENCY_LABELS[expense.frequency]}
          </span>

          <span className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              expense.category === 'fixed' ? 'bg-orange-500' : 'bg-purple-500'
            }`}></span>
            {EXPENSE_CATEGORY_LABELS[expense.category]}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Edit className="w-4 h-4 mr-1" />
          {UI_LABELS.EDIT}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {UI_LABELS.DELETE}
        </Button>
      </div>
    </div>
  )
}

export default ExpenseItem