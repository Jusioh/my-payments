import { useState, useEffect } from 'react'
import PaymentItem from './PaymentItem'

function PaymentList({ payments, onTogglePaid, onEdit, onDelete }) {
  const [openMenuId, setOpenMenuId] = useState(null) // which row's 3-dots menu is open

  // Close the 3-dots menu when clicking elsewhere
  useEffect(() => {
    function closeMenu(event) {
      if (!event.target.closest('.payment-item__menu')) setOpenMenuId(null)
    }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [])

  function toggleMenu(id) {
    setOpenMenuId(openMenuId === id ? null : id)
  }

  function handleEdit(item) {
    setOpenMenuId(null)
    onEdit(item)
  }

  function handleDelete(id) {
    setOpenMenuId(null)
    onDelete(id)
  }

  return (
    <ul className="payment-list">
      {payments.length === 0 && <li className="payment-empty">No payments here yet.</li>}
      {payments.map((item) => (
        <PaymentItem
          key={item.id}
          item={item}
          menuOpen={openMenuId === item.id}
          onToggleMenu={toggleMenu}
          onTogglePaid={onTogglePaid}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  )
}

export default PaymentList
