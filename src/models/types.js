/**
 * Définitions des types et interfaces pour l'application de budget
 *
 * Fonctionnalités métier :
 * - Définition des structures de données pour salaire et dépenses
 * - Interfaces pour les formulaires et l'état global
 * - Types pour les catégories et fréquences de dépenses
 *
 * Objectif : Fournir une structure de données cohérente
 * et type-safe pour la gestion du budget personnel.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

// Définition des types comme objets JavaScript pour la documentation
export const ExpenseType = {
  id: 'string', // Identifiant unique de la dépense
  name: 'string', // Nom de la dépense
  amount: 'number', // Montant de la dépense
  frequency: 'string', // Fréquence (weekly, monthly, annual)
  category: 'string', // Catégorie (fixed, variable)
  months: 'Array<string>', // Mois associés (format YYYY-MM, défaut tous les mois)
  createdAt: 'Date' // Date de création
}

export const BudgetStateType = {
  salary: 'number', // Salaire annuel (peut être null)
  expenses: 'Array<ExpenseType>', // Liste des dépenses
  isLoading: 'boolean' // État de chargement
}

export const SalaryFormDataType = {
  salary: 'number' // Données du formulaire de salaire
}

export const ExpenseFormDataType = {
  name: 'string', // Nom de la dépense
  amount: 'number', // Montant
  frequency: 'string', // Fréquence
  category: 'string', // Catégorie
  months: 'Array<string>' // Mois sélectionnés
}

export const BudgetSummaryType = {
  totalExpenses: 'number', // Total des dépenses pour la période
  remainingBudget: 'number', // Budget restant (positif ou négatif)
  budgetRatio: 'number', // Ratio dépenses/salaire (0-1)
  isPositive: 'boolean' // Si le budget est positif
}