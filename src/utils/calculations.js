/**
 * Utilitaires de calcul budgétaire - Fonctions de calcul pour le budget personnel
 *
 * Fonctionnalités métier :
 * - Conversion des montants selon les fréquences de dépenses
 * - Calcul des montants mensuels et annuels
 * - Calcul des budgets annuels et mensuels avec soldes
 * - Gestion des multiplicateurs de fréquence pour les conversions
 * - Suivi budgétaire par personne avec dépenses individuelles et partagées
 * - Calcul des budgets personnels annuels et mensuels
 * - Filtrage des dépenses par personne et des dépenses communes
 *
 * Objectif : Fournir des calculs précis et cohérents pour
 * l'analyse budgétaire, permettant aux utilisateurs de comprendre
 * leur situation financière sur différentes périodes, y compris
 * le suivi individuel des budgets personnels.
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
 * Compare les salaires annuels totaux avec les dépenses annuelles totales
 * @param {Array} people - Liste des personnes avec leurs salaires
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire annuel
 *
 * @example
 * // Entrée
 * calculateAnnualBudget([{salary: 30000}, {salary: 25000}], [{amount: 100, frequency: 'monthly', ...}])
 *
 * // Sortie
 * {
 *   totalExpenses: 1200,
 *   remainingBudget: 53800,
 *   budgetRatio: 0.021,
 *   isPositive: true
 * }
 */
export const calculateAnnualBudget = (people, expenses) => {
  const totalAnnualSalary = people.reduce((total, person) => total + (person.salary || 0), 0)

  const totalExpenses = expenses.reduce((total, expense) => {
    return total + getAnnualAmount(expense.amount, expense.frequency)
  }, 0)

  const remainingBudget = totalAnnualSalary - totalExpenses
  const budgetRatio = totalAnnualSalary ? totalExpenses / totalAnnualSalary : 0
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
 * Compare les salaires mensuels totaux avec les dépenses mensuelles totales
 * @param {Array} people - Liste des personnes avec leurs salaires
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire mensuel
 *
 * @example
 * // Entrée
 * calculateMonthlyBudget([{salary: 30000}, {salary: 25000}], [{amount: 100, frequency: 'monthly', ...}])
 *
 * // Sortie
 * {
 *   totalExpenses: 100,
 *   remainingBudget: 4483.33,
 *   budgetRatio: 0.021,
 *   isPositive: true
 * }
 */
export const calculateMonthlyBudget = (people, expenses) => {
  const totalAnnualSalary = people.reduce((total, person) => total + (person.salary || 0), 0)
  const totalMonthlySalary = totalAnnualSalary / 12

  const totalExpenses = expenses.reduce((total, expense) => {
    return total + getMonthlyAmount(expense.amount, expense.frequency)
  }, 0)

  const remainingBudget = totalMonthlySalary - totalExpenses
  const budgetRatio = totalMonthlySalary ? totalExpenses / totalMonthlySalary : 0
  const isPositive = remainingBudget >= 0

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    budgetRatio: Math.round(budgetRatio * 1000) / 1000,
    isPositive
  }
}

/**
 * Filtre les dépenses assignées à une personne spécifique
 * @param {string} personId - ID de la personne
 * @param {Array} expenses - Liste des dépenses
 * @returns {Array} Dépenses assignées à la personne
 *
 * @example
 * // Entrée
 * getPersonExpenses('person-a', [{assignedTo: 'person-a', ...}, {assignedTo: 'commun', ...}])
 *
 * // Sortie
 * [{assignedTo: 'person-a', ...}]
 */
export const getPersonExpenses = (personId, expenses) => {
  return expenses.filter(expense => expense.assignedTo === personId)
}

/**
 * Filtre les dépenses communes (partagées)
 * @param {Array} expenses - Liste des dépenses
 * @returns {Array} Dépenses communes
 *
 * @example
 * // Entrée
 * getSharedExpenses([{assignedTo: 'person-a', ...}, {assignedTo: 'commun', ...}])
 *
 * // Sortie
 * [{assignedTo: 'commun', ...}]
 */
export const getSharedExpenses = (expenses) => {
  return expenses.filter(expense => expense.assignedTo === 'commun')
}

/**
 * Calcule le budget annuel pour une personne spécifique
 * Inclut les dépenses personnelles et la part des dépenses communes
 * @param {string} personId - ID de la personne
 * @param {Array} people - Liste des personnes avec leurs salaires
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire annuel pour la personne
 *
 * @example
 * // Entrée
 * calculatePersonAnnualBudget('person-a', [{id: 'person-a', salary: 30000}], [...expenses])
 *
 * // Sortie
 * {
 *   personalExpenses: 5000,
 *   sharedExpenses: 2000,
 *   totalExpenses: 7000,
 *   remainingBudget: 23000,
 *   budgetRatio: 0.233,
 *   isPositive: true
 * }
 */
export const calculatePersonAnnualBudget = (personId, people, expenses) => {
  const person = people.find(p => p.id === personId)
  if (!person) return null

  const personSalary = person.salary || 0
  const personExpenses = getPersonExpenses(personId, expenses)
  const sharedExpenses = getSharedExpenses(expenses)

  // Calcul des dépenses personnelles annuelles
  const personalExpensesTotal = personExpenses.reduce((total, expense) => {
    return total + getAnnualAmount(expense.amount, expense.frequency)
  }, 0)

  // Calcul de la part des dépenses communes (réparties équitablement)
  const numberOfPeople = people.length
  const sharedExpensesTotal = sharedExpenses.reduce((total, expense) => {
    return total + getAnnualAmount(expense.amount, expense.frequency)
  }, 0) / numberOfPeople

  const totalExpenses = personalExpensesTotal + sharedExpensesTotal
  const remainingBudget = personSalary - totalExpenses
  const budgetRatio = personSalary ? totalExpenses / personSalary : 0
  const isPositive = remainingBudget >= 0

  return {
    personalExpenses: Math.round(personalExpensesTotal * 100) / 100,
    sharedExpenses: Math.round(sharedExpensesTotal * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    budgetRatio: Math.round(budgetRatio * 1000) / 1000,
    isPositive
  }
}

/**
 * Calcule le budget mensuel pour une personne spécifique
 * Inclut les dépenses personnelles et la part des dépenses communes
 * @param {string} personId - ID de la personne
 * @param {Array} people - Liste des personnes avec leurs salaires
 * @param {Array} expenses - Liste des dépenses
 * @returns {object} Résumé budgétaire mensuel pour la personne
 *
 * @example
 * // Entrée
 * calculatePersonMonthlyBudget('person-a', [{id: 'person-a', salary: 30000}], [...expenses])
 *
 * // Sortie
 * {
 *   personalExpenses: 416.67,
 *   sharedExpenses: 166.67,
 *   totalExpenses: 583.33,
 *   remainingBudget: 1916.67,
 *   budgetRatio: 0.233,
 *   isPositive: true
 * }
 */
export const calculatePersonMonthlyBudget = (personId, people, expenses) => {
  const person = people.find(p => p.id === personId)
  if (!person) return null

  const personMonthlySalary = (person.salary || 0) / 12
  const personExpenses = getPersonExpenses(personId, expenses)
  const sharedExpenses = getSharedExpenses(expenses)

  // Calcul des dépenses personnelles mensuelles
  const personalExpensesTotal = personExpenses.reduce((total, expense) => {
    return total + getMonthlyAmount(expense.amount, expense.frequency)
  }, 0)

  // Calcul de la part des dépenses communes (réparties équitablement)
  const numberOfPeople = people.length
  const sharedExpensesTotal = sharedExpenses.reduce((total, expense) => {
    return total + getMonthlyAmount(expense.amount, expense.frequency)
  }, 0) / numberOfPeople

  const totalExpenses = personalExpensesTotal + sharedExpensesTotal
  const remainingBudget = personMonthlySalary - totalExpenses
  const budgetRatio = personMonthlySalary ? totalExpenses / personMonthlySalary : 0
  const isPositive = remainingBudget >= 0

  return {
    personalExpenses: Math.round(personalExpensesTotal * 100) / 100,
    sharedExpenses: Math.round(sharedExpensesTotal * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    budgetRatio: Math.round(budgetRatio * 1000) / 1000,
    isPositive
  }
}