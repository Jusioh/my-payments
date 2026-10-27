import { useState } from 'react'

// The inline "add payment" form. It keeps its own typing state and
// only tells the parent when the user submits or cancels.
function AddPaymentForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const value = Number(amount)
    if (!name.trim() || isNaN(value) || value <= 0) return
    onAdd({ name: name.trim(), note: note.trim(), amount: value })
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        className="form-input"
        placeholder="Payment name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="form-input"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        className="form-input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="form-buttons">
        <button type="submit" className="add-payment">Add payment</button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddPaymentForm
