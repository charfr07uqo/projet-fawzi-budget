/**
 * Composant de vue budgétaire mensuelle - Affichage du résumé budgétaire mensuel avec graphiques
 *
 * Fonctionnalités métier :
 * - Affichage des revenus, dépenses et budget restant mensuels
 * - Calcul et affichage du ratio de dépenses en pourcentage
 * - Répartition des dépenses par fréquence (hebdomadaire/mensuel/annuel)
 * - Graphique en camembert des dépenses par catégorie pour le mois en cours
 * - Graphique linéaire des tendances budgétaires sur l'année
 * - Codage couleur pour indiquer surplus ou déficit
 *
 * Objectif : Fournir une vue d'ensemble claire de la situation
 * budgétaire mensuelle, avec des indicateurs visuels et graphiques
 * pour faciliter la compréhension de la santé financière.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */
import { useState } from 'react'
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { getMonthlyAmount, calculatePersonMonthlyBudget } from '../../utils/calculations.js'
import { formatCurrency } from '../../utils/formatters.js'
import { EXPENSE_FREQUENCIES, EXPENSE_FREQUENCY_LABELS, EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, MONTH_LABELS, ALL_MONTHS, COMMON_EXPENSE_CATEGORIES, COMMON_EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '../../models/constants.js'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

/**
 * Composant d'affichage de la vue budgétaire mensuelle
 * Calcule et affiche les métriques budgétaires mensuelles
 * Supporte les vues ménage et individuelles
 */
function MonthlyBudgetView({ viewMode = 'household' }) {
  const { people, expenses, monthlyBudgetSummary } = useBudget()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // Calculs pour la vue individuelle
  const personBudgets = viewMode === 'per-person'
    ? people.map(person => ({
        ...person,
        budget: calculatePersonMonthlyBudget(person.id, people, expenses)
      })).filter(person => person.budget) // Filtrer les personnes sans budget
    : []

  // Mois en cours (format YYYY-MM)
  const currentMonth = new Date().toISOString().slice(0, 7)

  // Calcul de la répartition par fréquence
  const frequencyBreakdown = expenses.reduce((acc, expense) => {
    const monthlyAmount = getMonthlyAmount(expense.amount, expense.frequency)
    acc[expense.frequency] = (acc[expense.frequency] || 0) + monthlyAmount
    return acc
  }, {})

  const weeklyExpenses = frequencyBreakdown[EXPENSE_FREQUENCIES.WEEKLY] || 0
  const monthlyExpenses = frequencyBreakdown[EXPENSE_FREQUENCIES.MONTHLY] || 0
  const annualExpenses = frequencyBreakdown[EXPENSE_FREQUENCIES.ANNUAL] || 0

  // Revenus mensuels
  const totalAnnualSalary = people.reduce((total, person) => total + (person.salary || 0), 0)
  const monthlyIncome = totalAnnualSalary / 12

  // Données pour le graphique en camembert - Dépenses par catégorie pour le mois sélectionné
  const selectedMonthCategoryData = expenses.reduce((acc, expense) => {
    if (expense.months && expense.months.includes(selectedMonth)) {
      const monthlyAmount = getMonthlyAmount(expense.amount, expense.frequency)
      acc[expense.category] = (acc[expense.category] || 0) + monthlyAmount
    }
    return acc
  }, {})

  const pieChartData = Object.entries(selectedMonthCategoryData)
    .map(([categoryKey, amount]) => {
      const categoryLabel = COMMON_EXPENSE_CATEGORY_LABELS[categoryKey] || EXPENSE_CATEGORY_LABELS[categoryKey] || categoryKey
      const categoryColors = EXPENSE_CATEGORY_COLORS[categoryKey]

      return {
        name: categoryLabel,
        value: amount,
        color: categoryColors ? getColorValue(categoryColors.icon) : '#6b7280' // Couleur par défaut si non définie
      }
    })
    .filter(item => item.value > 0) // Ne montrer que les catégories avec des dépenses
    .sort((a, b) => b.value - a.value) // Trier par montant décroissant

  // Fonction utilitaire pour extraire la couleur hexadécimale des classes Tailwind
  function getColorValue(tailwindClass) {
    const colorMap = {
      'text-blue-600': '#2563eb',
      'text-green-600': '#059669',
      'text-purple-600': '#7c3aed',
      'text-yellow-600': '#d97706',
      'text-red-600': '#dc2626',
      'text-pink-600': '#db2777',
      'text-indigo-600': '#4f46e5',
      'text-orange-600': '#ea580c',
      'text-teal-600': '#0d9488',
      'text-emerald-600': '#047857',
      'text-gray-600': '#4b5563',
      'text-cyan-600': '#0891b2'
    }
    return colorMap[tailwindClass] || '#6b7280'
  }

  // Données pour le graphique linéaire - Tendances budgétaires sur l'année
  const budgetTrendsData = ALL_MONTHS.map(month => {
    const monthlyExpensesForMonth = expenses.reduce((total, expense) => {
      if (expense.months && expense.months.includes(month)) {
        return total + getMonthlyAmount(expense.amount, expense.frequency)
      }
      return total
    }, 0)

    const totalAnnualSalaryForMonth = people.reduce((total, person) => total + (person.salary || 0), 0)
    const monthlyIncomeForMonth = totalAnnualSalaryForMonth / 12
    const remainingBudget = monthlyIncomeForMonth - monthlyExpensesForMonth

    return {
      month: MONTH_LABELS[month] || month,
      expenses: Math.round(monthlyExpensesForMonth * 100) / 100,
      income: Math.round(monthlyIncomeForMonth * 100) / 100,
      remaining: Math.round(remainingBudget * 100) / 100
    }
  })

  // Classes CSS pour le codage couleur
  const remainingColorClass = monthlyBudgetSummary.isPositive
    ? 'text-green-600'
    : 'text-red-600'

  const ratioColorClass = monthlyBudgetSummary.budgetRatio > 0.8
    ? 'text-red-600'
    : monthlyBudgetSummary.budgetRatio > 0.6
    ? 'text-yellow-600'
    : 'text-green-600'

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-center">Vue Budgétaire Mensuelle</h2>

      {/* Métriques principales */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus Mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyBudgetSummary.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Restant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingColorClass}`}>
              {formatCurrency(monthlyBudgetSummary.remainingBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ratio de Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ratioColorClass}`}>
              {(monthlyBudgetSummary.budgetRatio * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="w-full space-y-6">
        {/* Graphique en camembert - Dépenses par catégorie ce mois */}
        <Card>
           <CardHeader>
             <div className="flex items-center justify-between">
               <CardTitle>Répartition des Dépenses - {MONTH_LABELS[selectedMonth] || selectedMonth}</CardTitle>
               <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="Sélectionner un mois" />
                 </SelectTrigger>
                 <SelectContent>
                   {ALL_MONTHS.map(month => (
                     <SelectItem key={month} value={month}>
                       {MONTH_LABELS[month] || month}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </CardHeader>
           <CardContent>
             {pieChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height={525}>
                 <PieChart>
                   <Pie
                     data={pieChartData}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                     outerRadius="80%"
                     fill="#8884d8"
                     dataKey="value"
                   >
                     {pieChartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value) => [formatCurrency(value), 'Montant']} />
                   <Legend
                     verticalAlign="bottom"
                     height={36}
                     formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="flex items-center justify-center h-64 text-muted-foreground">
                 Aucune dépense pour ce mois
               </div>
             )}
           </CardContent>
         </Card>

        {/* Graphique linéaire - Tendances budgétaires */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Budgétaires Annuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={budgetTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenus"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Dépenses"
                />
                <Line
                  type="monotone"
                  dataKey="remaining"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Solde"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par fréquence (liste détaillée) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Détail par Fréquence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {EXPENSE_FREQUENCY_LABELS[EXPENSE_FREQUENCIES.WEEKLY]}
              </span>
              <span className="font-bold">
                {formatCurrency(weeklyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {EXPENSE_FREQUENCY_LABELS[EXPENSE_FREQUENCIES.MONTHLY]}
              </span>
              <span className="font-bold">
                {formatCurrency(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {EXPENSE_FREQUENCY_LABELS[EXPENSE_FREQUENCIES.ANNUAL]}
              </span>
              <span className="font-bold">
                {formatCurrency(annualExpenses)}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>{formatCurrency(monthlyBudgetSummary.totalExpenses)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MonthlyBudgetView