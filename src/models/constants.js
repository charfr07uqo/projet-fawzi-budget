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

// Catégories de dépenses courantes avec icônes et couleurs
export const COMMON_EXPENSE_CATEGORIES = {
  HOUSING: 'housing',
  FOOD: 'food',
  TRANSPORTATION: 'transportation',
  UTILITIES: 'utilities',
  HEALTHCARE: 'healthcare',
  ENTERTAINMENT: 'entertainment',
  SHOPPING: 'shopping',
  EDUCATION: 'education',
  INSURANCE: 'insurance',
  SAVINGS: 'savings',
  MISCELLANEOUS: 'miscellaneous',
  TRAVEL: 'travel'
}

// Labels français pour les catégories courantes
export const COMMON_EXPENSE_CATEGORY_LABELS = {
  [COMMON_EXPENSE_CATEGORIES.HOUSING]: 'Logement',
  [COMMON_EXPENSE_CATEGORIES.FOOD]: 'Alimentation',
  [COMMON_EXPENSE_CATEGORIES.TRANSPORTATION]: 'Transport',
  [COMMON_EXPENSE_CATEGORIES.UTILITIES]: 'Services publics',
  [COMMON_EXPENSE_CATEGORIES.HEALTHCARE]: 'Santé',
  [COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT]: 'Divertissement',
  [COMMON_EXPENSE_CATEGORIES.SHOPPING]: 'Shopping',
  [COMMON_EXPENSE_CATEGORIES.EDUCATION]: 'Éducation',
  [COMMON_EXPENSE_CATEGORIES.INSURANCE]: 'Assurance',
  [COMMON_EXPENSE_CATEGORIES.SAVINGS]: 'Épargne',
  [COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS]: 'Divers',
  [COMMON_EXPENSE_CATEGORIES.TRAVEL]: 'Voyage'
}

// Icônes pour chaque catégorie de dépense
export const EXPENSE_CATEGORY_ICONS = {
  [COMMON_EXPENSE_CATEGORIES.HOUSING]: 'Home',
  [COMMON_EXPENSE_CATEGORIES.FOOD]: 'UtensilsCrossed',
  [COMMON_EXPENSE_CATEGORIES.TRANSPORTATION]: 'Car',
  [COMMON_EXPENSE_CATEGORIES.UTILITIES]: 'Zap',
  [COMMON_EXPENSE_CATEGORIES.HEALTHCARE]: 'Heart',
  [COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT]: 'Gamepad2',
  [COMMON_EXPENSE_CATEGORIES.SHOPPING]: 'ShoppingBag',
  [COMMON_EXPENSE_CATEGORIES.EDUCATION]: 'GraduationCap',
  [COMMON_EXPENSE_CATEGORIES.INSURANCE]: 'Shield',
  [COMMON_EXPENSE_CATEGORIES.SAVINGS]: 'PiggyBank',
  [COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS]: 'MoreHorizontal',
  [COMMON_EXPENSE_CATEGORIES.TRAVEL]: 'Plane'
}

// Schémas de couleurs pour chaque catégorie
export const EXPENSE_CATEGORY_COLORS = {
  [COMMON_EXPENSE_CATEGORIES.HOUSING]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: 'text-blue-600'
  },
  [COMMON_EXPENSE_CATEGORIES.FOOD]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: 'text-green-600'
  },
  [COMMON_EXPENSE_CATEGORIES.TRANSPORTATION]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: 'text-purple-600'
  },
  [COMMON_EXPENSE_CATEGORIES.UTILITIES]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: 'text-yellow-600'
  },
  [COMMON_EXPENSE_CATEGORIES.HEALTHCARE]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: 'text-red-600'
  },
  [COMMON_EXPENSE_CATEGORIES.ENTERTAINMENT]: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    icon: 'text-pink-600'
  },
  [COMMON_EXPENSE_CATEGORIES.SHOPPING]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: 'text-indigo-600'
  },
  [COMMON_EXPENSE_CATEGORIES.EDUCATION]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: 'text-orange-600'
  },
  [COMMON_EXPENSE_CATEGORIES.INSURANCE]: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    icon: 'text-teal-600'
  },
  [COMMON_EXPENSE_CATEGORIES.SAVINGS]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: 'text-emerald-600'
  },
  [COMMON_EXPENSE_CATEGORIES.MISCELLANEOUS]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: 'text-gray-600'
  },
  [COMMON_EXPENSE_CATEGORIES.TRAVEL]: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    icon: 'text-cyan-600'
  }
}

// Actions du reducer BudgetContext
export const BUDGET_ACTIONS = {
  SET_PEOPLE: 'SET_PEOPLE',
  ADD_PERSON: 'ADD_PERSON',
  UPDATE_PERSON: 'UPDATE_PERSON',
  DELETE_PERSON: 'DELETE_PERSON',
  SET_PERSON_SALARY: 'SET_PERSON_SALARY',
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

// Palette de couleurs disponibles pour les personnes
export const PERSON_COLORS = {
  PINK: 'pink',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange',
  RED: 'red',
  TEAL: 'teal',
  INDIGO: 'indigo',
  YELLOW: 'yellow',
  CYAN: 'cyan',
  EMERALD: 'emerald',
  ROSE: 'rose'
}

// Personnes par défaut avec couleurs étendues
export const DEFAULT_PEOPLE = [
  {
    id: 'person-a',
    name: 'Personne A',
    salary: 0,
    color: PERSON_COLORS.PINK
  },
  {
    id: 'person-b',
    name: 'Personne B',
    salary: 0,
    color: PERSON_COLORS.BLUE
  },
  {
    id: 'person-c',
    name: 'Personne C',
    salary: 0,
    color: PERSON_COLORS.GREEN
  },
  {
    id: 'person-d',
    name: 'Personne D',
    salary: 0,
    color: PERSON_COLORS.PURPLE
  },
  {
    id: 'person-e',
    name: 'Personne E',
    salary: 0,
    color: PERSON_COLORS.ORANGE
  },
  {
    id: 'person-f',
    name: 'Personne F',
    salary: 0,
    color: PERSON_COLORS.RED
  }
]

// Options d'assignation des dépenses
export const ASSIGNMENT_OPTIONS = {
  PERSON_A: 'person-a',
  PERSON_B: 'person-b',
  PERSON_C: 'person-c',
  PERSON_D: 'person-d',
  PERSON_E: 'person-e',
  PERSON_F: 'person-f',
  BOTH: 'commun'
}

// Labels français pour les options d'assignation
export const ASSIGNMENT_LABELS = {
  [ASSIGNMENT_OPTIONS.PERSON_A]: 'Personne A',
  [ASSIGNMENT_OPTIONS.PERSON_B]: 'Personne B',
  [ASSIGNMENT_OPTIONS.PERSON_C]: 'Personne C',
  [ASSIGNMENT_OPTIONS.PERSON_D]: 'Personne D',
  [ASSIGNMENT_OPTIONS.PERSON_E]: 'Personne E',
  [ASSIGNMENT_OPTIONS.PERSON_F]: 'Personne F',
  [ASSIGNMENT_OPTIONS.BOTH]: 'Commun'
}

// Modes de saisie du montant
export const AMOUNT_MODES = {
  FIXED: 'fixed',
  RANGE: 'range'
}

// Labels français pour les modes de montant
export const AMOUNT_MODE_LABELS = {
  [AMOUNT_MODES.FIXED]: 'Montant fixe',
  [AMOUNT_MODES.RANGE]: 'Fourchette de montant'
}