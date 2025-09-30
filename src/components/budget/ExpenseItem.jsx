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
import {
  Edit,
  Trash2,
  Home,
  UtensilsCrossed,
  Car,
  Zap,
  Heart,
  Gamepad2,
  ShoppingBag,
  GraduationCap,
  Shield,
  PiggyBank,
  MoreHorizontal,
  Plane,
  AlertTriangle,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { formatExpenseAmount } from '../../utils/formatters.js'
import {
  EXPENSE_FREQUENCY_LABELS,
  COMMON_EXPENSE_CATEGORY_LABELS,
  UI_LABELS,
  MONTH_LABELS,
  ALL_MONTHS,
  ASSIGNMENT_LABELS,
  ASSIGNMENT_OPTIONS,
  EXPENSE_CATEGORY_COLORS,
  COMMON_EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS,
  PERSON_COLORS
} from '../../models/constants.js'

/**
 * Composant d'affichage d'une dépense individuelle
 * @param {object} props - Propriétés du composant
 * @param {object} props.expense - Données de la dépense
 * @returns {JSX.Element} Élément de dépense
 */
function ExpenseItem({ expense }) {
  const { deleteExpense, people } = useBudget()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isDeleting, setIsDeleting] = useState(false)

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
    * Obtient l'icône appropriée pour une catégorie de dépense
    * @param {string} category - Catégorie de la dépense
    * @returns {JSX.Element} Composant d'icône Lucide React avec label d'accessibilité
    */
   const getCategoryIcon = (category) => {
     const iconName = EXPENSE_CATEGORY_ICONS[category]
     const iconClass = `w-5 h-5 ${getCategoryColors(category).icon} flex-shrink-0`

     const iconMap = {
       [COMMON_EXPENSE_CATEGORIES.HOUSING]: (
         <Home className={iconClass} aria-label="Logement" />
       ),
       [COMMON_EXPENSE_CATEGORIES.FOOD]: (
         <UtensilsCrossed className={iconClass} aria-label="Alimentation" />
       ),
       [COMMON_EXPENSE_CATEGORIES.TRANSPORTATION]: (
         <Car className={iconClass} aria-label="Transport" />
       ),
       [COMMON_EXPENSE_CATEGORIES.UTILITIES]: (
         <Zap className={iconClass} aria-label="Services publics" />
       ),
       [COMMON_EXPENSE_CATEGORIES.HEALTHCARE]: (
         <Heart className={iconClass} aria-label="Santé" />
       ),
       [COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT]: (
         <Gamepad2 className={iconClass} aria-label="Divertissement" />
       ),
       [COMMON_EXPENSE_CATEGORIES.SHOPPING]: (
         <ShoppingBag className={iconClass} aria-label="Shopping" />
       ),
       [COMMON_EXPENSE_CATEGORIES.EDUCATION]: (
         <GraduationCap className={iconClass} aria-label="Éducation" />
       ),
       [COMMON_EXPENSE_CATEGORIES.INSURANCE]: (
         <Shield className={iconClass} aria-label="Assurance" />
       ),
       [COMMON_EXPENSE_CATEGORIES.SAVINGS]: (
         <PiggyBank className={iconClass} aria-label="Épargne" />
       ),
       [COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS]: (
         <MoreHorizontal className={iconClass} aria-label="Divers" />
       ),
       [COMMON_EXPENSE_CATEGORIES.TRAVEL]: (
         <Plane className={iconClass} aria-label="Voyage" />
       )
     }

     return iconMap[category] || (
       <MoreHorizontal className={iconClass} aria-label="Autre" />
     )
   }

  /**
   * Gère le début de la suppression de la dépense
   * Démarre le compte à rebours intégré
   */
  const handleDelete = () => {
    setShowDeleteConfirmation(true)
    setCountdown(5)
    setIsDeleting(false)
  }

  /**
   * Effect du compte à rebours pour la suppression
   */
  useEffect(() => {
    let interval = null

    if (showDeleteConfirmation && countdown > 0 && !isDeleting) {
      interval = setInterval(() => {
        setCountdown((time) => time - 1)
      }, 1000)
    } else if (showDeleteConfirmation && countdown === 0 && !isDeleting) {
      // Auto-suppression quand le compte à rebours arrive à zéro
      performDelete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showDeleteConfirmation, countdown, isDeleting])

  /**
   * Effectue la suppression réelle de la dépense
   */
  const performDelete = () => {
    setIsDeleting(true)
    deleteExpense(expense.id)
    // Petite pause pour montrer le feedback visuel
    setTimeout(() => {
      setShowDeleteConfirmation(false)
      setCountdown(5)
      setIsDeleting(false)
    }, 500)
  }

  /**
   * Confirme manuellement la suppression
   */
  const handleConfirmDelete = () => {
    performDelete()
  }

  /**
   * Annule la suppression
   */
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setCountdown(5)
    setIsDeleting(false)
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
      [PERSON_COLORS.PINK]: {
        badge: 'bg-pink-500 text-white border-pink-600',
        dot: 'bg-pink-200'
      },
      [PERSON_COLORS.BLUE]: {
        badge: 'bg-blue-500 text-white border-blue-600',
        dot: 'bg-blue-200'
      },
      [PERSON_COLORS.GREEN]: {
        badge: 'bg-green-500 text-white border-green-600',
        dot: 'bg-green-200'
      },
      [PERSON_COLORS.PURPLE]: {
        badge: 'bg-purple-500 text-white border-purple-600',
        dot: 'bg-purple-200'
      },
      [PERSON_COLORS.ORANGE]: {
        badge: 'bg-orange-500 text-white border-orange-600',
        dot: 'bg-orange-200'
      },
      [PERSON_COLORS.RED]: {
        badge: 'bg-red-500 text-white border-red-600',
        dot: 'bg-red-200'
      },
      [PERSON_COLORS.TEAL]: {
        badge: 'bg-teal-500 text-white border-teal-600',
        dot: 'bg-teal-200'
      },
      [PERSON_COLORS.INDIGO]: {
        badge: 'bg-indigo-500 text-white border-indigo-600',
        dot: 'bg-indigo-200'
      },
      [PERSON_COLORS.YELLOW]: {
        badge: 'bg-yellow-500 text-black border-yellow-600',
        dot: 'bg-yellow-200'
      },
      [PERSON_COLORS.CYAN]: {
        badge: 'bg-cyan-500 text-white border-cyan-600',
        dot: 'bg-cyan-200'
      },
      [PERSON_COLORS.EMERALD]: {
        badge: 'bg-emerald-500 text-white border-emerald-600',
        dot: 'bg-emerald-200'
      },
      [PERSON_COLORS.ROSE]: {
        badge: 'bg-rose-500 text-white border-rose-600',
        dot: 'bg-rose-200'
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
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
            {EXPENSE_FREQUENCY_LABELS[expense.frequency]}
          </span>

          <span className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: 'rgba(var(--color-primary-500-rgb), 0.1)' }}>
              {getCategoryIcon(expense.category)}
            </div>
            <span className="font-medium">{COMMON_EXPENSE_CATEGORY_LABELS[expense.category]}</span>
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

      {/* Interface de suppression intégrée avec compte à rebours */}
      {showDeleteConfirmation && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Confirmer la suppression
                </p>
                <p className="text-sm text-red-600">
                  {isDeleting ? (
                    'Suppression en cours...'
                  ) : countdown > 0 ? (
                    `Suppression automatique dans ${countdown} seconde${countdown > 1 ? 's' : ''}`
                  ) : (
                    'Suppression automatique...'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Cercle de progression pour le compte à rebours */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-red-200 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-red-600">
                    {countdown}
                  </span>
                </div>
                {/* Cercle de progression SVG */}
                <svg className="absolute top-0 left-0 w-8 h-8 -rotate-90" viewBox="0 0 20 20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="50.27"
                    className="text-red-200"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${((5 - countdown) / 5) * 50.27}, 50.27`}
                    className="text-red-600 transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
                disabled={isDeleting || countdown === 0}
                className="text-gray-600 hover:text-gray-800 border-gray-300"
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseItem