/**
 * Composant de formulaire de dépense - Ajout de nouvelles dépenses avec association de mois
 *
 * Fonctionnalités métier :
 * - Saisie des détails d'une dépense (nom, montant, fréquence, catégorie)
 * - Sélection des mois associés à la dépense (par défaut tous les mois)
 * - Validation complète des données saisies
 * - Interface avec sélecteurs déroulants et cases à cocher
 * - Gestion des erreurs et feedback utilisateur
 *
 * Objectif : Permettre à l'utilisateur d'ajouter des dépenses
 * de manière structurée et validée, en associant chaque dépense
 * aux mois appropriés pour une budgétisation précise.
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
import { Plus, Receipt, DollarSign, Clock, Tag, Calendar } from 'lucide-react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { validateExpenseForm } from '../../utils/validators.js'
import {
  EXPENSE_FREQUENCIES,
  EXPENSE_FREQUENCY_LABELS,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  UI_LABELS,
  ALL_MONTHS,
  MONTH_LABELS
} from '../../models/constants.js'

/**
 * Composant de formulaire pour ajouter une nouvelle dépense
 * @returns {JSX.Element} Formulaire de dépense
 */
function ExpenseForm() {
  const { addExpense } = useBudget()
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: '',
    category: '',
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

    if (field === 'amount') {
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
        [field]: field === 'amount' ? parseFloat(processedValue) : processedValue
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
      const validation = validateExpenseForm({
        ...formData,
        amount: parseFloat(formData.amount)
      })

      if (!validation.isValid) {
        setErrors(validation.errors)
        return
      }

      // Ajout de la dépense dans le contexte
      addExpense({
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        frequency: formData.frequency,
        category: formData.category,
        months: formData.months
      })

      // Réinitialisation du formulaire
      setFormData({
        name: '',
        amount: '',
        frequency: '',
        category: '',
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
                   formData.amount &&
                   formData.frequency &&
                   formData.category &&
                   !isSubmitting

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
        <Label htmlFor="expense-amount" className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          {UI_LABELS.AMOUNT}
        </Label>
        <Input
          id="expense-amount"
          type="text"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          placeholder="Ex: 150"
          className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.amount ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.amount && (
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
            {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
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
        </div>
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