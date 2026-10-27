import { icons } from '../icons'

function Header({ theme, onToggleTheme }) {
  return (
    <header className="page-header">
      <h1 className="brand">JK's Payments</h1>
      <button
        className="theme-toggle"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? icons.sun : icons.moon}
      </button>
    </header>
  )
}

export default Header
