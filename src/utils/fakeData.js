/**
 * Fonctions de génération de données fictives pour l'application de budget
 *
 * Fonctionnalités métier :
 * - Génération d'expenses personnalisées avec configurations variées
 * - Combinaisons réalistes de montants, fréquences et catégories
 * - Dépenses saisonnières et récurrentes représentatives
 *
 * Objectif : Fournir un ensemble de données de test complet
 * pour démontrer les fonctionnalités de l'application et
 * faciliter le développement et les tests utilisateur.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { EXPENSE_FREQUENCIES, COMMON_EXPENSE_CATEGORIES, ALL_MONTHS, DEFAULT_PEOPLE, ASSIGNMENT_OPTIONS } from '../models/constants.js'

/**
 * Génère un ensemble complet de données fictives pour les dépenses
 * Inclut une variété représentative d'expenses courantes
 *
 * @returns {Array<Object>} Liste d'objets expense prêts à être ajoutés
 */
export function generateFakeExpenses() {
  const fakeExpenses = [
    // Housing expenses
    {
      name: 'Loyer',
      amount: 1200,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.HOUSING,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },

    // Utilities expenses
    {
      name: 'Internet',
      amount: 45,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.UTILITIES,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },
    {
      name: 'Électricité',
      amount: 85,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.UTILITIES,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },
    {
      name: 'Téléphone mobile',
      amount: 25,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.UTILITIES,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_A
    },

    // Insurance expenses
    {
      name: 'Assurance habitation',
      amount: 35,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.INSURANCE,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },
    {
      name: 'Assurance voiture',
      amount: 70,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.INSURANCE,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_A
    },

    // Food expenses
    {
      name: 'Courses alimentaires',
      amount: 350,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.FOOD,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },
    {
      name: 'Restaurant',
      amount: 200,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.FOOD,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_B
    },
    {
      name: 'Café/restaurant',
      amount: 25,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: COMMON_EXPENSE_CATEGORIES.FOOD,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_A
    },

    // Transportation expenses
    {
      name: 'Carburant',
      amount: 120,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.TRANSPORTATION,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_A
    },
    {
      name: 'Transport en commun',
      amount: 30,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: COMMON_EXPENSE_CATEGORIES.TRANSPORTATION,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_B
    },

    // Shopping expenses
    {
      name: 'Shopping vêtements',
      amount: 150,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.SHOPPING,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_B
    },

    // Entertainment expenses
    {
      name: 'Loisirs',
      amount: 50,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },
    {
      name: 'Sport (abonnement annuel)',
      amount: 300,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT,
      assignedTo: ASSIGNMENT_OPTIONS.PERSON_A
    },

    // Travel expenses
    {
      name: 'Vacances',
      amount: 2500,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: COMMON_EXPENSE_CATEGORIES.TRAVEL,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },

    // Miscellaneous expenses
    {
      name: 'Impôts locaux',
      amount: 800,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH
    },

    // Seasonal utilities (heating and cooling)
    {
      name: 'Climatisation été',
      amount: 60,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.UTILITIES,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH,
      months: ['2025-06', '2025-07', '2025-08'] // Juin à août
    },
    {
      name: 'Chauffage hiver',
      amount: 150,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: COMMON_EXPENSE_CATEGORIES.UTILITIES,
      assignedTo: ASSIGNMENT_OPTIONS.BOTH,
      months: ['2025-12', '2025-01', '2025-02', '2025-03'] // Décembre à mars
    }
  ]

  return fakeExpenses
}

/**
 * Génère un ensemble de données fictives pour les revenus (personnes avec salaires)
 * Inclut Fawzi et son partenaire avec des salaires représentatifs
 *
 * @returns {Array<Object>} Liste d'objets person prêts à être ajoutés
 */
export function generateFakeIncomes() {
  const fakeIncomes = [
    {
      id: 'person-a',
      name: 'Personne A',
      salary: 100000,
      color: 'pink'
    },
    {
      id: 'person-b',
      name: 'Personne B',
      salary: 100000,
      color: 'blue'
    }
  ]

  return fakeIncomes
}
