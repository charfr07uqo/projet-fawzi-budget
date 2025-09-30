/**
 * Composant de formulaire de salaire - Gestion des informations des personnes
 *
 * Fonctionnalités métier :
 * - Saisie du nom, salaire et couleur pour chaque personne
 * - Validation en temps réel des données saisies
 * - Sauvegarde automatique lors de changements valides
 * - Interface utilisateur en français avec sélecteur de couleur
 * - Gestion des erreurs de validation par personne
 *
 * Objectif : Permettre aux utilisateurs de gérer les informations
 * de chaque personne (nom, salaire, couleur) de manière intuitive
 * avec validation et sauvegarde automatique.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, User, Palette } from 'lucide-react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { validatePersonForm } from '../../utils/validators.js'
import { UI_LABELS } from '../../models/constants.js'

/**
 * Composant de formulaire pour gérer les informations des personnes
 * @returns {JSX.Element} Formulaires des personnes
 */
function SalaryForm() {
  const { people, updatePerson } = useBudget()
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  // Initialisation des données de formulaire pour chaque personne
  useEffect(() => {
    const initialFormData = {}
    people.forEach(person => {
      initialFormData[person.id] = {
        name: person.name || '',
        salary: person.salary || '',
        color: person.color || 'pink'
      }
    })
    setFormData(initialFormData)
  }, [people])

  /**
   * Gère les changements dans les champs d'une personne
   * Met à jour l'état local, valide et sauvegarde automatiquement si valide
   */
  const handleInputChange = (personId, field, value) => {
    const updatedFormData = {
      ...formData,
      [personId]: {
        ...formData[personId],
        [field]: value
      }
    }
    setFormData(updatedFormData)

    // Validation en temps réel
    const personData = updatedFormData[personId]
    if (personData.name && personData.salary && personData.color) {
      const validation = validatePersonForm({
        name: personData.name,
        salary: parseFloat(personData.salary) || 0,
        color: personData.color
      })

      setErrors(prev => ({
        ...prev,
        [personId]: validation.errors
      }))

      // Sauvegarde automatique si valide
      if (validation.isValid) {
        const person = people.find(p => p.id === personId)
        const hasChanged = person.name !== personData.name ||
                          person.salary !== parseFloat(personData.salary) ||
                          person.color !== personData.color

        if (hasChanged) {
          updatePerson(personId, {
            name: personData.name,
            salary: parseFloat(personData.salary),
            color: personData.color
          })
        }
      }
    } else {
      setErrors(prev => ({
        ...prev,
        [personId]: {}
      }))
    }
  }

  /**
   * Gère les changements dans le sélecteur de couleur
   */
  const handleColorChange = (personId, color) => {
    handleInputChange(personId, 'color', color)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {people.map(person => (
        <div key={person.id} className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold flex items-center">
            <User className="w-5 h-5 mr-2" />
            {person.name || `Personne ${person.id.split('-')[1]}`}
          </h3>

          {/* Champ nom */}
          <div className="space-y-2">
            <Label htmlFor={`name-${person.id}`} className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Nom
            </Label>
            <Input
              id={`name-${person.id}`}
              type="text"
              value={formData[person.id]?.name || ''}
              onChange={(e) => handleInputChange(person.id, 'name', e.target.value)}
              placeholder="Ex: Jean Dupont"
              className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors[person.id]?.name ? 'border-red-500' : ''}`}
            />
            {errors[person.id]?.name && (
              <p className="text-sm text-red-600">
                {errors[person.id].name}
              </p>
            )}
          </div>

          {/* Champ salaire */}
          <div className="space-y-2">
            <Label htmlFor={`salary-${person.id}`} className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              {UI_LABELS.SALARY}
            </Label>
            <Input
              id={`salary-${person.id}`}
              type="text"
              value={formData[person.id]?.salary || ''}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
                handleInputChange(person.id, 'salary', numericValue)
              }}
              placeholder="Ex: 35000"
              className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors[person.id]?.salary ? 'border-red-500' : ''}`}
            />
            {errors[person.id]?.salary && (
              <p className="text-sm text-red-600">
                {errors[person.id].salary}
              </p>
            )}
          </div>

          {/* Sélecteur de couleur */}
          <div className="space-y-2">
            <Label htmlFor={`color-${person.id}`} className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Couleur
            </Label>
            <Select
              value={formData[person.id]?.color || 'pink'}
              onValueChange={(value) => handleColorChange(person.id, value)}
            >
              <SelectTrigger className={`transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors[person.id]?.color ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Choisir une couleur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pink">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                    Rose
                  </div>
                </SelectItem>
                <SelectItem value="blue">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    Bleu
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors[person.id]?.color && (
              <p className="text-sm text-red-600">
                {errors[person.id].color}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SalaryForm