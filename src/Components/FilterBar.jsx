import { icons } from '../icons'

function FilterBar({ pills, filter, onFilterChange, sortHighFirst, onToggleSort }) {
  return (
    <div className="payment-filters">
      {pills.map((pill) => (
        <button
          key={pill.key}
          className={filter === pill.key ? 'payment-filter payment-filter--active' : 'payment-filter'}
          onClick={() => onFilterChange(pill.key)}
        >
          {pill.label} {pill.count}
        </button>
      ))}
      <button
        className={sortHighFirst ? 'payment-filter payment-filter--active' : 'payment-filter'}
        aria-label="Sort by highest amount"
        aria-pressed={sortHighFirst}
        onClick={onToggleSort}
      >
        {icons.filter}
      </button>
    </div>
  )
}

export default FilterBar
