/**
 * Composant principal de l'application - Interface de gestion de budget
 *
 * Fonctionnalités métier :
 * - Gestion du salaire annuel avec formulaire et affichage
 * - Gestion des dépenses avec ajout, modification et suppression
 * - État global partagé via BudgetContext
 * - Interface utilisateur organisée et intuitive
 *
 * Objectif : Fournir une interface complète pour la saisie
 * et la gestion des données budgétaires de base, permettant
 * aux utilisateurs de gérer efficacement leur budget personnel.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */
import './App.css'
import { useState } from 'react'
import { BudgetProvider, useBudget } from './contexts/BudgetContext.jsx'
import { Calculator, Upload, RotateCcw } from 'lucide-react'
import { Button } from './components/ui/button.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog.jsx'
import SalaryForm from './components/budget/SalaryForm.jsx'
import ExpenseForm from './components/budget/ExpenseForm.jsx'
import ExpenseList from './components/budget/ExpenseList.jsx'
import BudgetSummary from './components/budget/BudgetSummary.jsx'
import { DEFAULT_PEOPLE } from './models/constants.js'
import { generateFakeExpenses, generateFakeIncomes } from './utils/fakeData.js'

function AppContent() {
  const { people, addPerson, addExpense, resetBudget } = useBudget()
  const [isLoadingFakeData, setIsLoadingFakeData] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  /**
   * Charge et ajoute des données fictives (revenus et dépenses)
   */
  const loadFakeData = () => {
    if (isLoadingFakeData) return // Prevent multiple clicks

    setIsLoadingFakeData(true)

    // Charger les revenus fictifs
    const fakeIncomes = generateFakeIncomes()
    fakeIncomes.forEach(person => {
      addPerson(person)
    })

    // Charger les dépenses fictives
    const fakeExpenses = generateFakeExpenses()
    fakeExpenses.forEach(expense => {
      addExpense(expense)
    })

    setIsLoadingFakeData(false)
  }

  /**
   * Confirme et exécute la réinitialisation complète
   */
  const handleResetConfirm = () => {
    resetBudget()
    setIsResetDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 app-fade-in">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="w-16 h-16 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">
              Application de Gestion de Budget
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Gérez votre salaire et vos dépenses de manière efficace et intuitive
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={loadFakeData}
              disabled={isLoadingFakeData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isLoadingFakeData ? 'Chargement...' : 'Charger données fictives'}
            </Button>

            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser tout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer la réinitialisation</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir réinitialiser toutes les données ?
                    Cette action supprimera tous les revenus, dépenses et autres données saisies.
                    Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsResetDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetConfirm}
                  >
                    Réinitialiser
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Section Saisie des données */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* Section Salaire */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">
                💰 Définir les revenus
              </h3>
              {people.length === 0 ? (
                <Button
                  onClick={() => addPerson(DEFAULT_PEOPLE[0])}
                  variant="default"
                  className="w-full"
                >
                  Ajouter un salaire
                </Button>
              ) : (
                <SalaryForm />
              )}
            </div>
          </div>

          {/* Section Dépenses */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">
                ➕ Ajouter une dépense
              </h3>
              <ExpenseForm />
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ExpenseList />
            </div>
          </div>
        </div>

        {/* Section Résumé Budgétaire */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <BudgetSummary />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  )
}

export default App