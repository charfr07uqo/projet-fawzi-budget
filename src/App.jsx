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
import { BudgetProvider } from './contexts/BudgetContext.jsx'
import { Calculator } from 'lucide-react'
import SalaryForm from './components/budget/SalaryForm.jsx'
import ExpenseForm from './components/budget/ExpenseForm.jsx'
import ExpenseList from './components/budget/ExpenseList.jsx'
import BudgetSummary from './components/budget/BudgetSummary.jsx'

function App() {
  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50 app-fade-in">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Calculator className="w-16 h-16 text-blue-600 mr-4" />
              <h1 className="text-5xl font-bold text-gray-900">
                Application de Gestion de Budget
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gérez votre salaire et vos dépenses de manière efficace et intuitive
            </p>
          </header>

          {/* Section Saisie des données */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Section Salaire */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-4">
                  💰 Définir le salaire
                </h3>
                <SalaryForm />
              </div>
            </div>

            {/* Section Dépenses */}
            <div className="lg:col-span-2 space-y-8">
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
    </BudgetProvider>
  )
}

export default App