// App.jsx - holds the data (state) and passes it down to components as props.
import { useState, useEffect } from 'react'
import walletArt from './assets/wallet-guy.png'
import { icons } from './icons'
import { loadSaved, saveItem, systemTheme, parseBackup, downloadBackup } from './utils'
import Header from './Components/Header'
import BalanceCard from './Components/BalanceCard'
import FilterBar from './Components/FilterBar'
import PaymentList from './Components/PaymentList'
import AddPaymentForm from './Components/AddPaymentForm'
import BackupActions from './Components/BackupActions'
import EditPaymentModal from './Components/EditPaymentModal'
import EditBudgetModal from './Components/EditBudgetModal'

const startingPayments = []

function App() {
  /* ---------- State (data that can change) ---------- */
  const [loaded, setLoaded] = useState(false) // true once saved data has been loaded
  const [theme, setTheme] = useState('light') // 'light' | 'dark'
  const [budget, setBudget] = useState(0)
  const [payments, setPayments] = useState(startingPayments)

  const [filter, setFilter] = useState('all') // 'all' | 'unpaid' | 'paid'
  const [sortHighFirst, setSortHighFirst] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null) // the payment being edited
  const [editingBudget, setEditingBudget] = useState(false)

  /* ---------- Load saved data (Promises) ---------- */
  useEffect(() => {
    Promise.all([
      loadSaved('mp-theme', systemTheme()),
      loadSaved('mp-budget', 0),
      loadSaved('mp-payments', startingPayments),
    ]).then(([savedTheme, savedBudget, savedPayments]) => {
      setTheme(savedTheme)
      setBudget(savedBudget)
      setPayments(savedPayments)
      setLoaded(true)
    })
  }, [])

  /* ---------- Save changes (only after loading, so we never overwrite saved data) ---------- */
  useEffect(() => {
    if (!loaded) return
    document.documentElement.setAttribute('data-theme', theme)
    saveItem('mp-theme', theme).catch(() => {})
  }, [theme, loaded])

  useEffect(() => {
    if (loaded) saveItem('mp-budget', budget).catch(() => {})
  }, [budget, loaded])

  useEffect(() => {
    if (loaded) saveItem('mp-payments', payments).catch(() => {})
  }, [payments, loaded])

  /* ---------- Calculations ---------- */
  const planned = payments.filter((p) => !p.paid).reduce((total, p) => total + p.amount, 0)
  const left = budget - planned
  const unpaidCount = payments.filter((p) => !p.paid).length
  const paidCount = payments.length - unpaidCount

  let visiblePayments = payments.filter((p) => {
    if (filter === 'unpaid') return !p.paid
    if (filter === 'paid') return p.paid
    return true
  })
  if (sortHighFirst) {
    visiblePayments = [...visiblePayments].sort((a, b) => b.amount - a.amount)
  }

  const pills = [
    { key: 'all', label: 'All', count: payments.length },
    { key: 'unpaid', label: 'Unpaid', count: unpaidCount },
    { key: 'paid', label: 'Paid', count: paidCount },
  ]

  /* ---------- Functions (passed to components as props) ---------- */
  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  function saveBudget(value) {
    setBudget(value)
    setEditingBudget(false)
  }

  function togglePaid(id) {
    const item = payments.find((p) => p.id === id)
    if (!item) return

    if (item.paid) {
      setBudget(budget + item.amount) // Undo: give the money back
    } else {
      if (budget < item.amount) {
        alert('Not enough money for this payment.')
        return
      }
      setBudget(budget - item.amount) // Pay: take the money out
    }
    setPayments(payments.map((p) => (p.id === id ? { ...p, paid: !p.paid } : p)))
  }

  function deletePayment(id) {
    setPayments(payments.filter((p) => p.id !== id))
  }

  function addPayment({ name, note, amount }) {
    const newPayment = { id: Date.now(), icon: 'bill', name, note, amount, paid: false }
    setPayments([...payments, newPayment])
    setShowForm(false)
  }

  function updatePayment(id, { name, note, amount }) {
    const old = payments.find((p) => p.id === id)
    if (old && old.paid) {
      setBudget(budget + old.amount - amount) // Already paid: adjust Current money
    }
    setPayments(payments.map((p) => (p.id === id ? { ...p, name, note, amount } : p)))
    setEditingItem(null)
  }

  function importBackup(file) {
    parseBackup(file, Object.keys(icons))
      .then((data) => {
        if (!window.confirm('Replace your current records with this backup?')) return
        setBudget(data.budget)
        setPayments(data.payments)
      })
      .catch(() => alert('This file is not a valid backup.'))
  }

  if (!loaded) return null

  /* ---------- Page ---------- */
  return (
    <div className="payments-page">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="payments-layout">
        <BalanceCard
          budget={budget}
          planned={planned}
          left={left}
          onEdit={() => setEditingBudget(true)}
        />

        <section id="payments" className="planned-payments">
          <h2 className="planned-payments__title">Planned payments</h2>
          <p className="planned-payments__subtitle">This paycheck · {payments.length} payments</p>

          <FilterBar
            pills={pills}
            filter={filter}
            onFilterChange={setFilter}
            sortHighFirst={sortHighFirst}
            onToggleSort={() => setSortHighFirst(!sortHighFirst)}
          />

          <PaymentList
            payments={visiblePayments}
            onTogglePaid={togglePaid}
            onEdit={setEditingItem}
            onDelete={deletePayment}
          />

          {showForm ? (
            <AddPaymentForm onAdd={addPayment} onCancel={() => setShowForm(false)} />
          ) : (
            <button className="add-payment" onClick={() => setShowForm(true)}>
              + Add another Payment
            </button>
          )}
        </section>
      </div>

      <BackupActions onExport={() => downloadBackup(budget, payments)} onImport={importBackup} />

      <img className="page-art" src={walletArt} alt="" />

      {editingItem && (
        <EditPaymentModal
          item={editingItem}
          onSave={updatePayment}
          onClose={() => setEditingItem(null)}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={budget}
          onSave={saveBudget}
          onClose={() => setEditingBudget(false)}
        />
      )}
    </div>
  )
}

export default App
