/**
 * Composant d'élément de dépense - Affichage d'une dépense individuelle avec assignation
 *
 * Fonctionnalités métier :
 * - Affichage détaillé d'une dépense (nom, montant, fréquence, catégorie)
 * - Indicateur visuel d'assignation avec codage couleur (Personne A, B ou Commun)
 * - Actions de modification et suppression
 * - Formatage approprié des montants
 * - Interface utilisateur cohérente avec badges colorés
 *
 * Objectif : Présenter chaque dépense de manière claire avec
 * son assignation visuelle, permettant à l'utilisateur de gérer
 * individuellement ses éléments de dépenses avec des actions intuitives.
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
  UI_LABELS,
  MONTH_LABELS,
  ALL_MONTHS,
  ASSIGNMENT_LABELS,
  ASSIGNMENT_OPTIONS,
  EXPENSE_CATEGORY_COLORS,
  COMMON_EXPENSE_CATEGORIES
} from '../../models/constants.js'

/**
 * Composant d'affichage d'une dépense individuelle
 * @param {object} props - Propriétés du composant
 * @param {object} props.expense - Données de la dépense
 * @returns {JSX.Element} Élément de dépense
 */
function ExpenseItem({ expense }) {
  const { deleteExpense, people } = useBudget()

  /**
   * Obtient le schéma de couleurs pour une catégorie de dépense
   * @param {string} category - Catégorie de la dépense
   * @returns {object} Objet contenant les classes de couleur
   */
  const getCategoryColors = (category) => {
    return EXPENSE_CATEGORY_COLORS[category] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    }
  }

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

  /**
   * Génère l'indicateur visuel d'assignation de la dépense
   * @returns {JSX.Element} Badge coloré selon l'assignation
   */
  const renderAssignmentBadge = () => {
    // Vérifier si c'est une dépense commune
    if (expense.assignedTo === ASSIGNMENT_OPTIONS.BOTH) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ml-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white border-transparent shadow-sm">
          <span className="w-2 h-2 rounded-full mr-2 bg-white opacity-80"></span>
          Commun
        </span>
      )
    }

    // Trouver la personne assignée pour les dépenses individuelles
    const assignedPerson = people.find(person => person.id === expense.assignedTo)

    if (!assignedPerson) {
      return null
    }

    // Classes de couleur selon la personne avec couleurs uniques et vibrantes
    const colorClasses = {
      pink: {
        badge: 'bg-pink-500 text-white border-pink-600',
        dot: 'bg-pink-200'
      },
      blue: {
        badge: 'bg-blue-500 text-white border-blue-600',
        dot: 'bg-blue-200'
      }
    }

    const classes = colorClasses[assignedPerson.color] || {
      badge: 'bg-gray-500 text-white border-gray-600',
      dot: 'bg-gray-200'
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ml-2 ${classes.badge} shadow-sm`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${classes.dot}`}></span>
        {assignedPerson.name}
      </span>
    )
  }

  /**
   * Obtient le nom d'affichage de l'assignation pour le haut de la carte
   * @returns {string|null} Nom de la personne ou "Commun"
   */
  const getAssignedDisplayName = () => {
    if (expense.assignedTo === ASSIGNMENT_OPTIONS.BOTH) {
      return ASSIGNMENT_LABELS[expense.assignedTo]
    }

    const assignedPerson = people.find(person => person.id === expense.assignedTo)
    return assignedPerson ? assignedPerson.name : null
  }

  const assignedDisplayName = getAssignedDisplayName()
  const categoryColors = getCategoryColors(expense.category)

  return (
    <div className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] ${categoryColors.bg} ${categoryColors.border}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className={`text-lg font-medium ${categoryColors.text}`}>
          {expense.name}
        </h4>
        {renderAssignmentBadge()}
      </div>

      <div className="mb-2">
        <span className="text-lg font-semibold text-green-600 block">
          {formatExpenseAmount(expense.amount, expense.frequency)}
        </span>
      </div>

      <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {EXPENSE_FREQUENCY_LABELS[expense.frequency]}
          </span>

          <span className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${categoryColors.icon}`}></span>
            {EXPENSE_CATEGORY_LABELS[expense.category]}
          </span>
        </div>

        {expense.months && expense.months.length !== ALL_MONTHS.length && (
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-xs">
              Mois: {expense.months.map(month => MONTH_LABELS[month]).join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
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
    </div>
  )
}

export default ExpenseItem