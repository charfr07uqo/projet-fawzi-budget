/**
 * Utilitaires de formatage - Fonctions de formatage réutilisables
 *
 * Fonctionnalités métier :
 * - Formatage des montants en dollars américains avec séparateurs
 * - Formatage des nombres avec précision contrôlée
 * - Formatage des dates en français
 * - Fonctions utilitaires pour l'affichage des données budgétaires
 *
 * Objectif : Fournir des fonctions de formatage cohérentes
 * et réutilisables dans toute l'application pour
 * améliorer la lisibilité des données financières.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

/**
 * Formate un montant en dollars américains
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté en dollars américains
 *
 * @example
 * // Entrée
 * formatCurrency(1234.56)
 *
 * // Sortie
 * "$1,234.56"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Formate un nombre avec séparateur de milliers
 * @param {number} number - Nombre à formater
 * @param {number} decimals - Nombre de décimales (défaut: 2)
 * @returns {string} Nombre formaté
 *
 * @example
 * // Entrée
 * formatNumber(1234.567, 2)
 *
 * // Sortie
 * "1 234,57"
 */
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0'
  }

  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
}

/**
 * Formate une date en français
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée en français
 *
 * @example
 * // Entrée
 * formatDate(new Date('2025-09-29'))
 *
 * // Sortie
 * "29/09/2025"
 */
export const formatDate = (date) => {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

/**
 * Calcule le montant annuel d'une dépense selon sa fréquence
 * @param {number} amount - Montant de base
 * @param {string} frequency - Fréquence (weekly, monthly, annual)
 * @returns {number} Montant annuel
 *
 * @example
 * // Entrée
 * calculateAnnualAmount(100, 'monthly')
 *
 * // Sortie
 * 1200
 */
export const calculateAnnualAmount = (amount, frequency) => {
  if (!amount || isNaN(amount)) return 0

  switch (frequency) {
    case 'weekly':
      return amount * 52
    case 'monthly':
      return amount * 12
    case 'annual':
    default:
      return amount
  }
}

/**
 * Formate le montant d'une dépense avec sa fréquence
 * @param {number} amount - Montant
 * @param {string} frequency - Fréquence
 * @returns {string} Montant formaté avec fréquence
 *
 * @example
 * // Entrée
 * formatExpenseAmount(100, 'monthly')
 *
 * // Sortie
 * "$100.00 / mois"
 */
export const formatExpenseAmount = (amount, frequency) => {
  if (!amount || isNaN(amount)) return '$0.00'

  const formattedAmount = formatCurrency(amount)

  switch (frequency) {
    case 'weekly':
      return `${formattedAmount} / semaine`
    case 'monthly':
      return `${formattedAmount} / mois`
    case 'annual':
      return `${formattedAmount} / an`
    default:
      return formattedAmount
  }
}