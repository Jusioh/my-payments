import { peso } from '../utils'

function BalanceCard({ budget, planned, left, onEdit }) {
  return (
    <section id="summary" className="balance-card">
      <div className="balance-card__header">
        <p className="balance-card__label">Current money</p>
        <button className="balance-card__edit" onClick={onEdit}>Edit</button>
      </div>

      <p className="balance-card__amount">{peso(budget, 2)}</p>
      <p className="balance-card__description">Total Payments budget</p>

      <div className="balance-card__summary">
        <div className="balance-card__stat">
          <p className="balance-card__stat-label">Planned payments</p>
          <p className="balance-card__stat-value">{peso(planned, 2)}</p>
        </div>
        <div className="balance-card__stat">
          <p className="balance-card__stat-label">Left after payments</p>
          <p className="balance-card__stat-value balance-card__stat-value--remaining">
            {peso(left, 2)}
          </p>
        </div>
      </div>
    </section>
  )
}

export default BalanceCard
