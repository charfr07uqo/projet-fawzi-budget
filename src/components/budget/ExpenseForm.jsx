/**
 * Composant de formulaire de dépense - Ajout de nouvelles dépenses avec assignation et association de mois
 *
 * Fonctionnalités métier :
 * - Saisie des détails d'une dépense (nom, montant, fréquence, catégorie)
 * - Assignation de la dépense à une personne ou aux deux (commun)
 * - Sélection des mois associés à la dépense (par défaut tous les mois)
 * - Validation complète des données saisies
 * - Interface avec sélecteurs déroulants et cases à cocher
 * - Gestion des erreurs et feedback utilisateur
 *
 * Objectif : Permettre à l'utilisateur d'ajouter des dépenses
 * de manière structurée et validée, en assignant chaque dépense
 * à la bonne personne et aux mois appropriés pour une budgétisation
 * précise et partagée.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Plus, Receipt, DollarSign, Clock, Tag, Calendar, Users,
  Home, UtensilsCrossed, Car, Zap, Heart, Gamepad2, ShoppingBag,
  GraduationCap, Shield, PiggyBank, MoreHorizontal, Plane } from 'lucide-react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { validateExpenseForm } from '../../utils/validators.js'

// Mapping des icônes pour les catégories
const CATEGORY_ICONS = {
  [COMMON_EXPENSE_CATEGORIES.HOUSING]: Home,
  [COMMON_EXPENSE_CATEGORIES.FOOD]: UtensilsCrossed,
  [COMMON_EXPENSE_CATEGORIES.TRANSPORTATION]: Car,
  [COMMON_EXPENSE_CATEGORIES.UTILITIES]: Zap,
  [COMMON_EXPENSE_CATEGORIES.HEALTHCARE]: Heart,
  [COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT]: Gamepad2,
  [COMMON_EXPENSE_CATEGORIES.SHOPPING]: ShoppingBag,
  [COMMON_EXPENSE_CATEGORIES.EDUCATION]: GraduationCap,
  [COMMON_EXPENSE_CATEGORIES.INSURANCE]: Shield,
  [COMMON_EXPENSE_CATEGORIES.SAVINGS]: PiggyBank,
  [COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS]: MoreHorizontal,
  [COMMON_EXPENSE_CATEGORIES.TRAVEL]: Plane
}
import {
    EXPENSE_FREQUENCIES,
    EXPENSE_FREQUENCY_LABELS,
    COMMON_EXPENSE_CATEGORIES,
    COMMON_EXPENSE_CATEGORY_LABELS,
    EXPENSE_CATEGORY_ICONS,
    EXPENSE_CATEGORY_COLORS,
    ASSIGNMENT_OPTIONS,
    ASSIGNMENT_LABELS,
    AMOUNT_MODES,
    AMOUNT_MODE_LABELS,
    UI_LABELS,
    ALL_MONTHS,
    MONTH_LABELS
  } from '../../models/constants.js'

/**
 * Composant de formulaire pour ajouter une nouvelle dépense
 * @returns {JSX.Element} Formulaire de dépense
 */
function ExpenseForm() {
  const { addExpense, people } = useBudget()
  const [formData, setFormData] = useState({
    name: '',
    amountMode: AMOUNT_MODES.FIXED, // Mode par défaut : montant fixe
    amount: '', // Montant fixe
    minAmount: '', // Montant minimum pour fourchette
    maxAmount: '', // Montant maximum pour fourchette
    frequency: '',
    category: '',
    assignedTo: ASSIGNMENT_OPTIONS.BOTH, // Défaut à 'Commun'
    months: ALL_MONTHS // Tous les mois sélectionnés par défaut
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Gère les changements dans les champs texte
   * Met à jour l'état local et valide en temps réel
   */
  const handleInputChange = (field, value) => {
    let processedValue = value

    if (field === 'amount' || field === 'minAmount' || field === 'maxAmount') {
      // Nettoie la saisie pour n'accepter que les nombres
      processedValue = value.replace(/[^0-9.,]/g, '').replace(',', '.')
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))

    // Validation en temps réel pour ce champ
    if (processedValue) {
      const validation = validateExpenseForm({
        ...formData,
        [field]: (field === 'amount' || field === 'minAmount' || field === 'maxAmount')
          ? parseFloat(processedValue)
          : processedValue
      })
      setErrors(prev => ({
        ...prev,
        [field]: validation.errors[field] || null
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  /**
   * Gère les changements dans les sélecteurs
   */
  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validation en temps réel
    const validation = validateExpenseForm({
      ...formData,
      [field]: value
    })
    setErrors(prev => ({
      ...prev,
      [field]: validation.errors[field] || null
    }))
  }

  /**
   * Gère le changement de mode de montant
   */
  const handleAmountModeChange = (mode) => {
    setFormData(prev => ({
      ...prev,
      amountMode: mode,
      // Réinitialiser les champs montant selon le mode
      amount: mode === AMOUNT_MODES.FIXED ? prev.amount : '',
      minAmount: mode === AMOUNT_MODES.RANGE ? prev.minAmount : '',
      maxAmount: mode === AMOUNT_MODES.RANGE ? prev.maxAmount : ''
    }))

    // Effacer les erreurs de montant
    setErrors(prev => ({
      ...prev,
      amount: null,
      minAmount: null,
      maxAmount: null
    }))
  }

  /**
   * Gère les changements dans la sélection des mois
   */
  const handleMonthChange = (month, checked) => {
    setFormData(prev => ({
      ...prev,
      months: checked
        ? [...prev.months, month]
        : prev.months.filter(m => m !== month)
    }))
  }

  /**
   * Sélectionne/désélectionne tous les mois
   */
  const handleSelectAllMonths = (selectAll) => {
    setFormData(prev => ({
      ...prev,
      months: selectAll ? ALL_MONTHS : []
    }))
  }

  /**
   * Gère la soumission du formulaire
   * Valide toutes les données et ajoute la dépense
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // Préparation des données pour validation selon le mode
      const validationData = {
        ...formData,
        amount: formData.amountMode === AMOUNT_MODES.FIXED && formData.amount
          ? parseFloat(formData.amount)
          : undefined,
        minAmount: formData.amountMode === AMOUNT_MODES.RANGE && formData.minAmount
          ? parseFloat(formData.minAmount)
          : undefined,
        maxAmount: formData.amountMode === AMOUNT_MODES.RANGE && formData.maxAmount
          ? parseFloat(formData.maxAmount)
          : undefined
      }

      const validation = validateExpenseForm(validationData)

      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }

      // Préparation des données pour l'ajout selon le mode
      const expenseData = {
        name: formData.name.trim(),
        amountMode: formData.amountMode,
        frequency: formData.frequency,
        category: formData.category,
        assignedTo: formData.assignedTo,
        months: formData.months
      }

      // Ajout du montant selon le mode
      if (formData.amountMode === AMOUNT_MODES.FIXED) {
        expenseData.amount = parseFloat(formData.amount)
      } else {
        expenseData.minAmount = parseFloat(formData.minAmount)
        expenseData.maxAmount = parseFloat(formData.maxAmount)
      }

      // Ajout de la dépense dans le contexte
      addExpense(expenseData)

      // Réinitialisation du formulaire
      setFormData({
        name: '',
        amountMode: AMOUNT_MODES.FIXED,
        amount: '',
        minAmount: '',
        maxAmount: '',
        frequency: '',
        category: '',
        assignedTo: ASSIGNMENT_OPTIONS.BOTH,
        months: ALL_MONTHS
      })
      setErrors({})

      // Feedback de succès (optionnel)
      console.log('Dépense ajoutée avec succès')

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error)
      setErrors({ general: 'Une erreur est survenue' })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Vérifie si le formulaire peut être soumis
   */
  const canSubmit = formData.name.trim() &&
                    formData.frequency &&
                    formData.category &&
                    formData.assignedTo &&
                    !isSubmitting &&
                    (
                      (formData.amountMode === AMOUNT_MODES.FIXED && formData.amount) ||
                      (formData.amountMode === AMOUNT_MODES.RANGE && formData.minAmount && formData.maxAmount)
                    )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="expense-name" className="flex items-center">
          <Receipt className="w-4 h-4 mr-2" />
          {UI_LABELS.EXPENSE_NAME}
        </Label>
        <Input
          id="expense-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ex: Courses alimentaires"
          className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.name ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Mode de montant
        </Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="amountMode"
              value={AMOUNT_MODES.FIXED}
              checked={formData.amountMode === AMOUNT_MODES.FIXED}
              onChange={(e) => handleAmountModeChange(e.target.value)}
              className="text-primary focus:ring-primary"
              disabled={isSubmitting}
            />
            <span className="text-sm">{AMOUNT_MODE_LABELS[AMOUNT_MODES.FIXED]}</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="amountMode"
              value={AMOUNT_MODES.RANGE}
              checked={formData.amountMode === AMOUNT_MODES.RANGE}
              onChange={(e) => handleAmountModeChange(e.target.value)}
              className="text-primary focus:ring-primary"
              disabled={isSubmitting}
            />
            <span className="text-sm">{AMOUNT_MODE_LABELS[AMOUNT_MODES.RANGE]}</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          {formData.amountMode === AMOUNT_MODES.FIXED ? 'Montant fixe' : 'Fourchette de montant'}
        </Label>

        {formData.amountMode === AMOUNT_MODES.FIXED ? (
          <Input
            id="expense-amount"
            type="text"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="Ex: 150"
            className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.amount ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="expense-min-amount"
                type="text"
                value={formData.minAmount}
                onChange={(e) => handleInputChange('minAmount', e.target.value)}
                placeholder="Min"
                className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.minAmount ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.minAmount && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.minAmount}
                </p>
              )}
            </div>
            <div>
              <Input
                id="expense-max-amount"
                type="text"
                value={formData.maxAmount}
                onChange={(e) => handleInputChange('maxAmount', e.target.value)}
                placeholder="Max"
                className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.maxAmount ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.maxAmount && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.maxAmount}
                </p>
              )}
            </div>
          </div>
        )}

        {formData.amountMode === AMOUNT_MODES.FIXED && errors.amount && (
          <p className="text-sm text-red-600">
            {errors.amount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          {UI_LABELS.FREQUENCY}
        </Label>
        <Select
          value={formData.frequency}
          onValueChange={(value) => handleSelectChange('frequency', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`select-trigger ${errors.frequency ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Sélectionner une fréquence" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EXPENSE_FREQUENCY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-sm text-red-600">
            {errors.frequency}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Mois associés
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="select-all-months"
              checked={formData.months.length === ALL_MONTHS.length}
              onChange={(e) => handleSelectAllMonths(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="select-all-months" className="text-sm font-medium">
              Tous les mois
            </Label>
          </div>
          {formData.months.length !== ALL_MONTHS.length && (
            <div className="grid grid-cols-3 gap-2">
              {ALL_MONTHS.map(month => (
                <div key={month} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`month-${month}`}
                    checked={formData.months.includes(month)}
                    onChange={(e) => handleMonthChange(month, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`month-${month}`} className="text-sm">
                    {MONTH_LABELS[month]}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <Tag className="w-4 h-4 mr-2" />
          {UI_LABELS.CATEGORY}
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange('category', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`select-trigger ${errors.category ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COMMON_EXPENSE_CATEGORY_LABELS).map(([value, label]) => {
              const IconComponent = CATEGORY_ICONS[value]
              const colors = EXPENSE_CATEGORY_COLORS[value]

              return (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                      <IconComponent className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    <span className={`font-medium ${colors.text}`}>
                      {label}
                    </span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Assignation
        </Label>
        <Select
          value={formData.assignedTo}
          onValueChange={(value) => handleSelectChange('assignedTo', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`select-trigger ${errors.assignedTo ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Sélectionner une assignation" />
          </SelectTrigger>
          <SelectContent>
            {people.map(person => (
              <SelectItem key={person.id} value={person.id}>
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: person.color }}
                  />
                  {person.name}
                </div>
              </SelectItem>
            ))}
            <SelectItem value={ASSIGNMENT_OPTIONS.BOTH}>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-400" />
                Commun
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.assignedTo && (
          <p className="text-sm text-red-600">
            {errors.assignedTo}
          </p>
        )}
      </div>

      {errors.general && (
        <p className="text-sm text-red-600">
          {errors.general}
        </p>
      )}

      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        {isSubmitting ? UI_LABELS.LOADING : UI_LABELS.ADD}
      </Button>
    </form>
  )
}

export default ExpenseForm