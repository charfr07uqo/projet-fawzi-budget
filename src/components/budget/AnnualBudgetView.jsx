/**
 * Composant de vue budgétaire annuelle - Affichage du résumé budgétaire annuel avec graphiques
 *
 * Fonctionnalités métier :
 * - Affichage des revenus, dépenses et budget restant annuels
 * - Calcul et affichage du ratio de dépenses en pourcentage
 * - Répartition des dépenses par dépense individuelle avec graphique circulaire
 * - Évolution mensuelle des dépenses avec graphique en barres
 * - Codage couleur pour indiquer surplus ou déficit
 *
 * Objectif : Fournir une vue d'ensemble claire de la situation
 * budgétaire annuelle, avec des indicateurs visuels et graphiques
 * pour faciliter la compréhension de la santé financière.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */
import { useBudget } from '../../contexts/BudgetContext.jsx'
import { getAnnualAmount, getMonthlyAmount, calculatePersonAnnualBudget } from '../../utils/calculations.js'
import { formatCurrency } from '../../utils/formatters.js'
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, MONTH_LABELS, ALL_MONTHS, COMMON_EXPENSE_CATEGORIES, COMMON_EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '../../models/constants.js'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Composant d'affichage de la vue budgétaire annuelle
 * Calcule et affiche les métriques budgétaires annuelles
 * Supporte les vues ménage et individuelles
 */
function AnnualBudgetView({ viewMode = 'household' }) {
  const { people, expenses, annualBudgetSummary } = useBudget()

  // Calculs pour la vue individuelle
  const personBudgets = viewMode === 'per-person'
    ? people.map(person => ({
        ...person,
        budget: calculatePersonAnnualBudget(person.id, people, expenses)
      })).filter(person => person.budget) // Filtrer les personnes sans budget
    : []

  // Palette de couleurs pour les dépenses individuelles
  const expenseColors = [
    '#3b82f6', // Bleu
    '#f59e0b', // Orange
    '#10b981', // Vert
    '#ef4444', // Rouge
    '#8b5cf6', // Violet
    '#f97316', // Orange foncé
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#ec4899', // Rose
    '#6b7280'  // Gris
  ]

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

  // Données pour le graphique circulaire (répartition par dépense individuelle)
  const pieChartData = expenses.map((expense, index) => ({
    name: expense.name,
    value: getAnnualAmount(expense.amount, expense.frequency),
    color: expenseColors[index % expenseColors.length]
  })).filter(item => item.value > 0) // Ne montrer que les dépenses avec un montant positif

  // Calcul des dépenses mensuelles totales
  const monthlyExpensesData = ALL_MONTHS.map(month => {
    const totalForMonth = expenses.reduce((total, expense) => {
      if (expense.months && expense.months.includes(month)) {
        return total + getMonthlyAmount(expense.amount, expense.frequency)
      }
      return total
    }, 0)

    return {
      month: MONTH_LABELS[month] || month,
      amount: Math.round(totalForMonth * 100) / 100
    }
  })

  // Calcul des dépenses par catégorie
  const categoryTotals = expenses.reduce((acc, expense) => {
    const amount = getAnnualAmount(expense.amount, expense.frequency)
    acc[expense.category] = (acc[expense.category] || 0) + amount
    return acc
  }, {})

  // Classes CSS pour le codage couleur
  const remainingColorClass = annualBudgetSummary.isPositive
    ? 'text-green-600'
    : 'text-red-600'

  const ratioColorClass = annualBudgetSummary.budgetRatio > 0.8
    ? 'text-red-600'
    : annualBudgetSummary.budgetRatio > 0.6
    ? 'text-yellow-600'
    : 'text-green-600'

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Vue Budgétaire Annuelle {viewMode === 'per-person' ? '- Individuelle' : '- Ménage'}
      </h2>

      {viewMode === 'per-person' ? (
        /* Vue Individuelle */
        <div className="w-full space-y-6">
          {personBudgets.map(person => (
            <Card key={person.id} className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: person.color === 'pink' ? '#ec4899' : '#3b82f6' }}
                  />
                  <span>{person.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Salaire Annuel</div>
                    <div className="text-xl font-bold">{formatCurrency(person.salary || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Dépenses Personnelles</div>
                    <div className="text-xl font-bold">{formatCurrency(person.budget.personalExpenses)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Part Dépenses Communes</div>
                    <div className="text-xl font-bold">{formatCurrency(person.budget.sharedExpenses)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Budget Restant</div>
                    <div className={`text-xl font-bold ${person.budget.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(person.budget.remainingBudget)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Dépenses</span>
                    <span className="font-bold">{formatCurrency(person.budget.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Ratio de Dépenses</span>
                    <span className={`font-bold ${person.budget.budgetRatio > 0.8 ? 'text-red-600' : person.budget.budgetRatio > 0.6 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {(person.budget.budgetRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Vue Ménage */
        <>
          {/* Métriques principales */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenus Annuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(people.reduce((total, person) => total + (person.salary || 0), 0))}
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
                  {formatCurrency(annualBudgetSummary.totalExpenses)}
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
                  {formatCurrency(annualBudgetSummary.remainingBudget)}
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
                  {(annualBudgetSummary.budgetRatio * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Graphiques */}
      <div className="w-full space-y-6">
        {/* Graphique circulaire - Répartition par dépense individuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Dépense Individuelle</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Aucune dépense enregistrée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graphique en barres - Dépenses mensuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle des Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={monthlyExpensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Dépenses']} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par catégorie (liste détaillée) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Détail par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([categoryKey, amount]) => (
              <div key={categoryKey} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColorValue(EXPENSE_CATEGORY_COLORS[categoryKey]?.icon) }}
                  ></div>
                  <span className="font-medium">
                    {COMMON_EXPENSE_CATEGORY_LABELS[categoryKey] || EXPENSE_CATEGORY_LABELS[categoryKey] || categoryKey}
                  </span>
                </div>
                <span className="font-bold">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>{formatCurrency(annualBudgetSummary.totalExpenses)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}

export default AnnualBudgetView