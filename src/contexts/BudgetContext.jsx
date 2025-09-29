/**
 * Contexte de gestion du budget - État global de l'application budgétaire
 *
 * Fonctionnalités métier :
 * - Gestion centralisée du salaire annuel
 * - Gestion de la liste des dépenses avec CRUD complet
 * - État de chargement pour les opérations asynchrones
 * - Actions pour modifier l'état du budget
 *
 * Objectif : Fournir un état global cohérent et réactif
 * pour la gestion du budget personnel, permettant
 * aux composants de partager et modifier les données
 * budgétaires de manière synchronisée.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { createContext, useContext, useReducer, useMemo } from 'react'
import { BUDGET_ACTIONS, ALL_MONTHS } from '../models/constants.js'
import { calculateAnnualBudget, calculateMonthlyBudget } from '../utils/calculations.js'

// État initial du budget
const initialState = {
  salary: null, // Salaire annuel (null si non défini)
  expenses: [], // Liste des dépenses
  isLoading: false // État de chargement
}

/**
 * Reducer pour gérer les actions sur l'état du budget
 * @param {object} state - État actuel
 * @param {object} action - Action à effectuer
 * @returns {object} Nouvel état
 */
function budgetReducer(state, action) {
  switch (action.type) {
    case BUDGET_ACTIONS.SET_SALARY:
      return {
        ...state,
        salary: action.payload
      }

    case BUDGET_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, {
          ...action.payload,
          months: action.payload.months || ALL_MONTHS, // Défaut à tous les mois si non spécifié
          id: Date.now().toString(), // ID unique basé sur timestamp
          createdAt: new Date()
        }]
      }

    case BUDGET_ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload }
            : expense
        )
      }

    case BUDGET_ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      }

    case BUDGET_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case BUDGET_ACTIONS.RESET_BUDGET:
      return initialState

    default:
      return state
  }
}

// Création du contexte
const BudgetContext = createContext()

/**
 * Provider du contexte de budget
 * Fournit l'état et les actions aux composants enfants
 */
export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState)

  // Calculs budgétaires automatiques avec mémorisation
  const annualBudgetSummary = useMemo(() => {
    return calculateAnnualBudget(state.salary, state.expenses)
  }, [state.salary, state.expenses])

  const monthlyBudgetSummary = useMemo(() => {
    return calculateMonthlyBudget(state.salary, state.expenses)
  }, [state.salary, state.expenses])

  /**
   * Définit le salaire annuel
   * @param {number} salary - Salaire annuel
   */
  const setSalary = (salary) => {
    dispatch({ type: BUDGET_ACTIONS.SET_SALARY, payload: salary })
  }

  /**
   * Ajoute une nouvelle dépense
   * @param {object} expense - Données de la dépense (sans id et createdAt)
   */
  const addExpense = (expense) => {
    dispatch({ type: BUDGET_ACTIONS.ADD_EXPENSE, payload: expense })
  }

  /**
   * Met à jour une dépense existante
   * @param {string} id - ID de la dépense
   * @param {object} updates - Données à mettre à jour
   */
  const updateExpense = (id, updates) => {
    dispatch({
      type: BUDGET_ACTIONS.UPDATE_EXPENSE,
      payload: { id, ...updates }
    })
  }

  /**
   * Supprime une dépense
   * @param {string} id - ID de la dépense à supprimer
   */
  const deleteExpense = (id) => {
    dispatch({ type: BUDGET_ACTIONS.DELETE_EXPENSE, payload: id })
  }

  /**
   * Définit l'état de chargement
   * @param {boolean} loading - État de chargement
   */
  const setLoading = (loading) => {
    dispatch({ type: BUDGET_ACTIONS.SET_LOADING, payload: loading })
  }

  /**
   * Réinitialise tout le budget
   */
  const resetBudget = () => {
    dispatch({ type: BUDGET_ACTIONS.RESET_BUDGET })
  }

  // Valeur fournie par le contexte
  const value = {
    // État
    salary: state.salary,
    expenses: state.expenses,
    isLoading: state.isLoading,

    // Calculs budgétaires
    annualBudgetSummary,
    monthlyBudgetSummary,

    // Actions
    setSalary,
    addExpense,
    updateExpense,
    deleteExpense,
    setLoading,
    resetBudget
  }

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  )
}

/**
 * Hook personnalisé pour utiliser le contexte de budget
 * @returns {object} État et actions du budget
 */
export function useBudget() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useBudget doit être utilisé dans un BudgetProvider')
  }
  return context
}