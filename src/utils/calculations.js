/**
 * Utilitaires de calcul budgétaire - Fonctions de calcul pour le budget personnel
 *
 * Fonctionnalités métier :
 * - Conversion des montants selon les fréquences de dépenses
 * - Calcul des montants mensuels et annuels
 * - Calcul des budgets annuels et mensuels avec soldes
 * - Gestion des multiplicateurs de fréquence pour les conversions
 *
 * Objectif : Fournir des calculs précis et cohérents pour
 * l'analyse budgétaire, permettant aux utilisateurs de comprendre
 * leur situation financière sur différentes périodes.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { EXPENSE_FREQUENCIES } from '../models/constants.js'

// Multiplicateurs pour convertir vers une base annuelle
export const FREQUENCY_MULTIPLIERS = {
  [EXPENSE_FREQUENCIES.WEEKLY]: 52, // 52 semaines par an
  [EXPENSE_FREQUENCIES.MONTHLY]: 12, // 12 mois par an
  [EXPENSE_FREQUENCIES.ANNUAL]: 1 // 1 an
}

/**
 * Convertit un montant d'une fréquence à une autre
 * @param {number} amount - Montant à convertir
 * @param {string} fromFrequency - Fréquence source
 * @param {string} toFrequency - Fréquence cible
 * @returns {number} Montant converti
 *
 * @example
 * // Entrée
 * convertAmount(100, 'weekly', 'monthly')
 *
 * // Sortie
 * 433.33 (100 * 52 / 12)
 */
export const convertAmount = (amount, fromFrequency, toFrequency) => {
  if (!amount || amount <= 0) return 0

  // Convertir d'abord vers annuel
  const annualAmount = amount * FREQUENCY_MULTIPLIERS[fromFrequency]

  // Puis convertir vers la fréquence cible
  return annualAmount / FREQUENCY_MULTIPLIERS[toFrequency]
}

/**
 * Convertit un montant vers un montant mensuel
 * @param {number} amount - Montant à convertir
 * @param {string} frequency - Fréquence actuelle
 * @returns {number} Montant mensuel équivalent
 *
 * @example
 * // Entrée
 * getMonthlyAmount(100, 'weekly')
 *
 * // Sortie
 * 433.33
 */
export const getMonthlyAmount = (amount, frequency) => {
  return convertAmount(amount, frequency, EXPENSE_FREQUENCIES.MONTHLY)
}

/**
 * Convertit un montant vers un montant annuel
 * @param {number} amount - Montant à convertir
 * @param {string} frequency - Fréquence actuelle
 * @returns {number} Montant annuel équivalent
 *
 * @example
 * // Entrée
 * getAnnualAmount(100, 'monthly')
 *
 * // Sortie
 * 1200
 */
export const getAnnualAmount = (amount, frequency) => {
  return convertAmount(amount, frequency, EXPENSE_FREQUENCIES.ANNUAL)
}

/**
 * Calcule le résumé budgétaire annuel
 * Compare le salaire annuel avec les dépenses annuelles totales
 * @param {number|null} annualSalary - Salaire annuel
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire annuel
 *
 * @example
 * // Entrée
 * calculateAnnualBudget(50000, [{amount: 100, frequency: 'monthly', ...}])
 *
 * // Sortie
 * {
 *   totalExpenses: 1200,
 *   remainingBudget: 48800,
 *   budgetRatio: 0.024,
 *   isPositive: true
 * }
 */
export const calculateAnnualBudget = (annualSalary, expenses) => {
  const totalExpenses = expenses.reduce((total, expense) => {
    return total + getAnnualAmount(expense.amount, expense.frequency)
  }, 0)

  const remainingBudget = annualSalary ? annualSalary - totalExpenses : -totalExpenses
  const budgetRatio = annualSalary ? totalExpenses / annualSalary : 0
  const isPositive = remainingBudget >= 0

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100, // Arrondi à 2 décimales
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    budgetRatio: Math.round(budgetRatio * 1000) / 1000, // Ratio en pourcentage
    isPositive
  }
}

/**
 * Calcule le résumé budgétaire mensuel
 * Compare le salaire mensuel avec les dépenses mensuelles totales
 * @param {number|null} annualSalary - Salaire annuel
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire mensuel
 *
 * @example
 * // Entrée
 * calculateMonthlyBudget(50000, [{amount: 100, frequency: 'monthly', ...}])
 *
 * // Sortie
 * {
 *   totalExpenses: 100,
 *   remainingBudget: 4066.67,
 *   budgetRatio: 0.024,
 *   isPositive: true
 * }
 */
export const calculateMonthlyBudget = (annualSalary, expenses) => {
  const monthlySalary = annualSalary ? annualSalary / 12 : 0

  const totalExpenses = expenses.reduce((total, expense) => {
    return total + getMonthlyAmount(expense.amount, expense.frequency)
  }, 0)

  const remainingBudget = monthlySalary - totalExpenses
  const budgetRatio = monthlySalary ? totalExpenses / monthlySalary : 0
  const isPositive = remainingBudget >= 0

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    budgetRatio: Math.round(budgetRatio * 1000) / 1000,
    isPositive
  }
}