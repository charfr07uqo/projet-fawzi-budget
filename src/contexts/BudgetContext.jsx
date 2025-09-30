/**
 * Contexte de gestion du budget - État global de l'application budgétaire
 *
 * Fonctionnalités métier :
 * - Gestion centralisée des personnes et de leurs salaires
 * - Gestion de la liste des dépenses avec CRUD complet et assignation
 * - État de chargement pour les opérations asynchrones
 * - Actions pour modifier l'état du budget et gérer les personnes
 * - Migration automatique des données existantes
 *
 * Objectif : Fournir un état global cohérent et réactif
 * pour la gestion du budget familial/multi-personnes, permettant
 * aux composants de partager et modifier les données
 * budgétaires de manière synchronisée.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { createContext, useContext, useReducer, useMemo } from 'react'
import { BUDGET_ACTIONS, ALL_MONTHS, DEFAULT_PEOPLE } from '../models/constants.js'
import { calculateAnnualBudget, calculateMonthlyBudget } from '../utils/calculations.js'

// État initial du budget
const initialState = {
  people: [], // Liste des personnes avec leurs salaires (vide par défaut)
  expenses: [], // Liste des dépenses
  isLoading: false // État de chargement
}

/**
 * Migre l'état existant vers la nouvelle structure avec personnes
 * Convertit un salaire unique en première personne si nécessaire
 * @param {object} state - État actuel à migrer
 * @returns {object} État migré
 */
const migrateState = (state) => {
  // Si l'état a déjà la structure people, pas de migration nécessaire
  if (state.people) {
    return state
  }

  // Migration : convertir salary en première personne
  const migratedPeople = [...DEFAULT_PEOPLE]
  if (state.salary && state.salary > 0) {
    migratedPeople[0] = {
      ...migratedPeople[0],
      salary: state.salary
    }
  }

  return {
    ...state,
    people: migratedPeople,
    // Supprimer l'ancien champ salary
    salary: undefined
  }
}

/**
 * Reducer pour gérer les actions sur l'état du budget
 * @param {object} state - État actuel
 * @param {object} action - Action à effectuer
 * @returns {object} Nouvel état
 */
function budgetReducer(state, action) {
  switch (action.type) {
    case BUDGET_ACTIONS.SET_PEOPLE:
      return {
        ...state,
        people: action.payload
      }

    case BUDGET_ACTIONS.ADD_PERSON:
      return {
        ...state,
        people: [...state.people, {
          ...action.payload,
          id: action.payload.id || `person-${Date.now()}`, // ID unique basé sur timestamp
          salary: action.payload.salary || 0
        }]
      }

    case BUDGET_ACTIONS.UPDATE_PERSON:
      return {
        ...state,
        people: state.people.map(person =>
          person.id === action.payload.id
            ? { ...person, ...action.payload }
            : person
        )
      }

    case BUDGET_ACTIONS.DELETE_PERSON:
      return {
        ...state,
        people: state.people.filter(person => person.id !== action.payload)
      }

    case BUDGET_ACTIONS.SET_PERSON_SALARY:
      return {
        ...state,
        people: state.people.map(person =>
          person.id === action.payload.personId
            ? { ...person, salary: action.payload.salary }
            : person
        )
      }

    case BUDGET_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, {
          ...action.payload,
          assignedTo: action.payload.assignedTo || state.people[0]?.id, // Défaut à première personne si non spécifié
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
      return { ...initialState }

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
  const [rawState, dispatch] = useReducer(budgetReducer, initialState)
  const state = useMemo(() => migrateState(rawState), [rawState])

  // Calculs budgétaires automatiques avec mémorisation
  const annualBudgetSummary = useMemo(() => {
    return calculateAnnualBudget(state.people, state.expenses)
  }, [state.people, state.expenses])

  const monthlyBudgetSummary = useMemo(() => {
    return calculateMonthlyBudget(state.people, state.expenses)
  }, [state.people, state.expenses])

  /**
   * Définit la liste complète des personnes
   * @param {Array} people - Liste des personnes
   */
  const setPeople = (people) => {
    dispatch({ type: BUDGET_ACTIONS.SET_PEOPLE, payload: people })
  }

  /**
   * Ajoute une nouvelle personne
   * @param {object} person - Données de la personne (sans id)
   */
  const addPerson = (person) => {
    dispatch({ type: BUDGET_ACTIONS.ADD_PERSON, payload: person })
  }

  /**
   * Met à jour une personne existante
   * @param {string} id - ID de la personne
   * @param {object} updates - Données à mettre à jour
   */
  const updatePerson = (id, updates) => {
    dispatch({
      type: BUDGET_ACTIONS.UPDATE_PERSON,
      payload: { id, ...updates }
    })
  }

  /**
   * Supprime une personne
   * @param {string} id - ID de la personne à supprimer
   */
  const deletePerson = (id) => {
    dispatch({ type: BUDGET_ACTIONS.DELETE_PERSON, payload: id })
  }

  /**
   * Définit le salaire d'une personne spécifique
   * @param {string} personId - ID de la personne
   * @param {number} salary - Salaire annuel
   */
  const setPersonSalary = (personId, salary) => {
    dispatch({
      type: BUDGET_ACTIONS.SET_PERSON_SALARY,
      payload: { personId, salary }
    })
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
    people: state.people,
    expenses: state.expenses,
    isLoading: state.isLoading,

    // Calculs budgétaires
    annualBudgetSummary,
    monthlyBudgetSummary,

    // Actions
    setPeople,
    addPerson,
    updatePerson,
    deletePerson,
    setPersonSalary,
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