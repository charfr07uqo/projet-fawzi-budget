/**
 * Constantes de l'application de budget
 *
 * Fonctionnalités métier :
 * - Définition des fréquences de dépenses
 * - Définition des catégories de dépenses
 * - Constantes pour les actions du reducer
 * - Messages d'erreur et de validation
 *
 * Objectif : Centraliser toutes les constantes utilisées
 * dans l'application pour faciliter la maintenance
 * et éviter les erreurs de frappe.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

// Fréquences de dépenses
export const EXPENSE_FREQUENCIES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ANNUAL: 'annual'
}

// Labels français pour les fréquences
export const EXPENSE_FREQUENCY_LABELS = {
  [EXPENSE_FREQUENCIES.WEEKLY]: 'Hebdomadaire',
  [EXPENSE_FREQUENCIES.MONTHLY]: 'Mensuel',
  [EXPENSE_FREQUENCIES.ANNUAL]: 'Annuel'
}

// Catégories de dépenses
export const EXPENSE_CATEGORIES = {
  FIXED: 'fixed',
  VARIABLE: 'variable'
}

// Labels français pour les catégories
export const EXPENSE_CATEGORY_LABELS = {
  [EXPENSE_CATEGORIES.FIXED]: 'Fixe',
  [EXPENSE_CATEGORIES.VARIABLE]: 'Variable'
}

// Actions du reducer BudgetContext
export const BUDGET_ACTIONS = {
  SET_SALARY: 'SET_SALARY',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  SET_LOADING: 'SET_LOADING',
  RESET_BUDGET: 'RESET_BUDGET'
}

// Messages d'erreur de validation
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est obligatoire',
  INVALID_NUMBER: 'Veuillez entrer un nombre valide',
  POSITIVE_NUMBER: 'Le montant doit être positif',
  INVALID_NAME: 'Le nom doit contenir au moins 2 caractères'
}

// Labels d'interface utilisateur
export const UI_LABELS = {
  SALARY: 'Salaire annuel',
  EXPENSE_NAME: 'Nom de la dépense',
  AMOUNT: 'Montant',
  FREQUENCY: 'Fréquence',
  CATEGORY: 'Catégorie',
  SAVE: 'Enregistrer',
  ADD: 'Ajouter',
  EDIT: 'Modifier',
  DELETE: 'Supprimer',
  CANCEL: 'Annuler',
  LOADING: 'Chargement...',
  NO_EXPENSES: 'Aucune dépense enregistrée'
}

// Multiplicateurs pour les conversions de fréquence budgétaire
export const FREQUENCY_MULTIPLIERS = {
  [EXPENSE_FREQUENCIES.WEEKLY]: 52, // 52 semaines par an
  [EXPENSE_FREQUENCIES.MONTHLY]: 12, // 12 mois par an
  [EXPENSE_FREQUENCIES.ANNUAL]: 1 // 1 an
}

// Mois de l'année (format YYYY-MM)
export const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')}`)

// Labels français pour les mois
export const MONTH_LABELS = {
  '2025-01': 'Janvier',
  '2025-02': 'Février',
  '2025-03': 'Mars',
  '2025-04': 'Avril',
  '2025-05': 'Mai',
  '2025-06': 'Juin',
  '2025-07': 'Juillet',
  '2025-08': 'Août',
  '2025-09': 'Septembre',
  '2025-10': 'Octobre',
  '2025-11': 'Novembre',
  '2025-12': 'Décembre'
}