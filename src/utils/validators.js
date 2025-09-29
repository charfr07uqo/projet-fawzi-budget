/**
 * Utilitaires de validation - Contrôles de cohérence métier
 *
 * Fonctionnalités métier :
 * - Validation des montants financiers
 * - Validation des noms de dépenses
 * - Validation des formulaires de salaire et dépenses
 * - Retour d'erreurs détaillées pour l'interface utilisateur
 *
 * Objectif : Garantir la qualité et la cohérence des données
 * saisies par les utilisateurs en appliquant les règles
 * métier définies pour l'application budgétaire.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { VALIDATION_MESSAGES } from '../models/constants.js'

/**
 * Valide qu'une valeur n'est pas vide ou nulle
 * @param {*} value - Valeur à valider
 * @returns {boolean} True si valide
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

/**
 * Valide qu'une valeur est un nombre positif
 * @param {*} value - Valeur à valider
 * @returns {boolean} True si valide
 */
export const isPositiveNumber = (value) => {
  const num = Number(value)
  return !isNaN(num) && num > 0
}

/**
 * Valide qu'une chaîne a une longueur minimale
 * @param {string} value - Chaîne à valider
 * @param {number} minLength - Longueur minimale
 * @returns {boolean} True si valide
 */
export const hasMinLength = (value, minLength = 2) => {
  return typeof value === 'string' && value.trim().length >= minLength
}

/**
 * Valide un montant financier
 * @param {*} amount - Montant à valider
 * @returns {object} Objet avec isValid et error
 *
 * @example
 * // Entrée
 * validateAmount(100)
 *
 * // Sortie
 * { isValid: true, error: null }
 *
 * @example
 * // Entrée
 * validateAmount(-50)
 *
 * // Sortie
 * { isValid: false, error: 'Le montant doit être positif' }
 */
export const validateAmount = (amount) => {
  if (!isRequired(amount)) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD }
  }

  if (!isPositiveNumber(amount)) {
    return { isValid: false, error: VALIDATION_MESSAGES.POSITIVE_NUMBER }
  }

  return { isValid: true, error: null }
}

/**
 * Valide un nom de dépense
 * @param {string} name - Nom à valider
 * @returns {object} Objet avec isValid et error
 *
 * @example
 * // Entrée
 * validateExpenseName('Courses')
 *
 * // Sortie
 * { isValid: true, error: null }
 */
export const validateExpenseName = (name) => {
  if (!isRequired(name)) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD }
  }

  if (!hasMinLength(name, 2)) {
    return { isValid: false, error: VALIDATION_MESSAGES.INVALID_NAME }
  }

  return { isValid: true, error: null }
}

/**
 * Valide les données du formulaire de salaire
 * @param {object} data - Données du formulaire
 * @returns {object} Objet avec isValid, errors et firstError
 *
 * @example
 * // Entrée
 * validateSalaryForm({ salary: 50000 })
 *
 * // Sortie
 * { isValid: true, errors: {}, firstError: null }
 */
export const validateSalaryForm = (data) => {
  const errors = {}
  let firstError = null

  const amountValidation = validateAmount(data.salary)
  if (!amountValidation.isValid) {
    errors.salary = amountValidation.error
    if (!firstError) firstError = amountValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError
  }
}

/**
 * Valide les données du formulaire de dépense
 * @param {object} data - Données du formulaire
 * @returns {object} Objet avec isValid, errors et firstError
 *
 * @example
 * // Entrée
 * validateExpenseForm({ name: 'Courses', amount: 100, frequency: 'monthly', category: 'variable' })
 *
 * // Sortie
 * { isValid: true, errors: {}, firstError: null }
 */
export const validateExpenseForm = (data) => {
  const errors = {}
  let firstError = null

  const nameValidation = validateExpenseName(data.name)
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error
    if (!firstError) firstError = nameValidation.error
  }

  const amountValidation = validateAmount(data.amount)
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.error
    if (!firstError) firstError = amountValidation.error
  }

  if (!isRequired(data.frequency)) {
    errors.frequency = VALIDATION_MESSAGES.REQUIRED_FIELD
    if (!firstError) firstError = VALIDATION_MESSAGES.REQUIRED_FIELD
  }

  if (!isRequired(data.category)) {
    errors.category = VALIDATION_MESSAGES.REQUIRED_FIELD
    if (!firstError) firstError = VALIDATION_MESSAGES.REQUIRED_FIELD
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstError
  }
}