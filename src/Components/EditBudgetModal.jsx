import { useState } from 'react'
import Modal from './Modal'

function EditBudgetModal({ budget, onSave, onClose }) {
  const [input, setInput] = useState(String(budget))

  function handleSubmit(event) {
    event.preventDefault()
    const value = Number(input)
    if (input === '' || isNaN(value) || value < 0) return
    onSave(value)
  }

  return (
    <Modal titleId="edit-budget-title" title="Edit current money" onClose={onClose} onSubmit={handleSubmit}>
      <label className="modal__field">
        Amount
        <input
          className="form-input"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </label>
    </Modal>
  )
}

export default EditBudgetModal
