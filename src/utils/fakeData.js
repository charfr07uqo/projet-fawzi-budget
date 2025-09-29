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

import { EXPENSE_FREQUENCIES, EXPENSE_CATEGORIES, ALL_MONTHS } from '../models/constants.js'

/**
 * Génère un ensemble complet de données fictives pour les dépenses
 * Inclut une variété représentative d'expenses courantes
 *
 * @returns {Array<Object>} Liste d'objets expense prêts à être ajoutés
 */
export function generateFakeExpenses() {
  const fakeExpenses = [
    // Dépenses fixes mensuelles (logement, assurances, abonnements)
    {
      name: 'Loyer',
      amount: 1200,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Internet',
      amount: 45,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Électricité',
      amount: 85,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Assurance habitation',
      amount: 35,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Assurance voiture',
      amount: 70,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Téléphone mobile',
      amount: 25,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.FIXED
    },

    // Dépenses variables mensuelles (alimentation, transport)
    {
      name: 'Courses alimentaires',
      amount: 350,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Carburant',
      amount: 120,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Restaurant',
      amount: 200,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Shopping vêtements',
      amount: 150,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },

    // Dépenses hebdomadaires (loisirs, sorties)
    {
      name: 'Café/restaurant',
      amount: 25,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Loisirs',
      amount: 50,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Transport en commun',
      amount: 30,
      frequency: EXPENSE_FREQUENCIES.WEEKLY,
      category: EXPENSE_CATEGORIES.VARIABLE
    },

    // Dépenses annuelles (vacances, sports)
    {
      name: 'Sport (abonnement annuel)',
      amount: 300,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: EXPENSE_CATEGORIES.FIXED
    },
    {
      name: 'Vacances',
      amount: 2500,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: EXPENSE_CATEGORIES.VARIABLE
    },
    {
      name: 'Impôts locaux',
      amount: 800,
      frequency: EXPENSE_FREQUENCIES.ANNUAL,
      category: EXPENSE_CATEGORIES.FIXED
    },

    // Dépenses saisonnières (étés, hiver)
    {
      name: 'Climatisation été',
      amount: 60,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE,
      months: ['2025-06', '2025-07', '2025-08'] // Juin à août
    },
    {
      name: 'Chauffage hiver',
      amount: 150,
      frequency: EXPENSE_FREQUENCIES.MONTHLY,
      category: EXPENSE_CATEGORIES.VARIABLE,
      months: ['2025-12', '2025-01', '2025-02', '2025-03'] // Décembre à mars
    }
  ]

  return fakeExpenses
}
