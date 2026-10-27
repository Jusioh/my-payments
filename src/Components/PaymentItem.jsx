import { icons } from '../icons'
import { peso } from '../utils'

function PaymentItem({ item, menuOpen, onToggleMenu, onTogglePaid, onEdit, onDelete }) {
  return (
    <li className={item.paid ? 'payment-item payment-item--paid' : 'payment-item'}>
      <div className="payment-item__icon">{icons[item.icon]}</div>
      <div>
        <p className="payment-item__name">{item.name}</p>
        <p className="payment-item__date">{item.note}</p>
      </div>
      <div className="payment-item__actions">
        <p className="payment-item__amount">{peso(item.amount)}</p>
        <div className="payment-item__controls">
          <button
            className={item.paid ? 'payment-item__button payment-item__button--paid' : 'payment-item__button'}
            onClick={() => onTogglePaid(item.id)}
          >
            {item.paid ? 'Paid ✓' : 'Pay'}
          </button>
          <div className="payment-item__menu">
            <button
              className="menu-button"
              aria-label={'Options for ' + item.name}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => onToggleMenu(item.id)}
            >
              {icons.dots}
            </button>
            {menuOpen && (
              <div className="menu-popup" role="menu">
                <button className="menu-item" role="menuitem" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button
                  className="menu-item menu-item--danger"
                  role="menuitem"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export default PaymentItem
