import { useState } from 'react'
import Modal from './Modal'

function EditPaymentModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item.name)
  const [note, setNote] = useState(item.note)
  const [amount, setAmount] = useState(String(item.amount))

  function handleSubmit(event) {
    event.preventDefault()
    const value = Number(amount)
    if (!name.trim() || isNaN(value) || value <= 0) return
    onSave(item.id, { name: name.trim(), note: note.trim(), amount: value })
  }

  return (
    <Modal titleId="edit-payment-title" title="Edit payment" onClose={onClose} onSubmit={handleSubmit}>
      <label className="modal__field">
        Name
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </label>
      <label className="modal__field">
        Note
        <input
          className="form-input"
          placeholder="Optional"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <label className="modal__field">
        Amount
        <input
          className="form-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
    </Modal>
  )
}

export default EditPaymentModal
