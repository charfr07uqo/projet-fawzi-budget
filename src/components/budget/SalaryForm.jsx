/**
 * Composant de formulaire de salaire - Saisie automatique du salaire annuel
 *
 * Fonctionnalités métier :
 * - Saisie du salaire annuel avec validation en temps réel
 * - Sauvegarde automatique lors de changements valides
 * - Interface utilisateur en français
 * - Gestion des erreurs de validation
 *
 * Objectif : Permettre à l'utilisateur de saisir son salaire annuel
 * de manière intuitive avec sauvegarde automatique, offrant
 * une expérience utilisateur fluide sans action manuelle.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign } from 'lucide-react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { validateSalaryForm } from '../../utils/validators.js'
import { UI_LABELS } from '../../models/constants.js'

/**
 * Composant de formulaire pour saisir le salaire annuel avec sauvegarde automatique
 * @returns {JSX.Element} Formulaire de salaire
 */
function SalaryForm() {
  const { salary, setSalary } = useBudget()
  const [formData, setFormData] = useState({
    salary: salary || ''
  })
  const [errors, setErrors] = useState({})

  // Synchronise formData avec le salaire du contexte
  useEffect(() => {
    setFormData({ salary: salary || '' })
  }, [salary])

  /**
   * Gère les changements dans le champ salaire
   * Met à jour l'état local, valide et sauvegarde automatiquement si valide
   */
  const handleInputChange = (event) => {
    const { value } = event.target
    const numericValue = value.replace(/[^0-9.,]/g, '').replace(',', '.')

    setFormData({ salary: numericValue })

    // Validation en temps réel
    if (numericValue) {
      const validation = validateSalaryForm({ salary: parseFloat(numericValue) })
      setErrors(validation.errors)

      // Sauvegarde automatique si valide et différent du salaire actuel
      if (validation.isValid) {
        const newSalary = parseFloat(numericValue)
        if (newSalary !== salary) {
          setSalary(newSalary)
        }
      }
    } else {
      setErrors({})
      // Si le champ est vide, on peut remettre le salaire à null
      if (salary !== null) {
        setSalary(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="salary" className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          {UI_LABELS.SALARY}
        </Label>
        <Input
          id="salary"
          type="text"
          value={formData.salary}
          onChange={handleInputChange}
          placeholder="Ex: 35000"
          className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.salary ? 'border-red-500' : ''}`}
        />
        {errors.salary && (
          <p className="text-sm text-red-600">
            {errors.salary}
          </p>
        )}
      </div>

      {errors.general && (
        <p className="text-sm text-red-600">
          {errors.general}
        </p>
      )}
    </div>
  )
}

export default SalaryForm