import { useEffect } from 'react'

// A reusable pop-up. Whatever you put between <Modal> ... </Modal> shows up as `children`.
function Modal({ titleId, title, onClose, onSubmit, children }) {
  // Close with Escape, and stop the page behind from scrolling
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = oldOverflow
    }
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={onSubmit}
      >
        <h2 id={titleId} className="modal__title">{title}</h2>
        {children}
        <div className="form-buttons">
          <button type="submit" className="add-payment">Save changes</button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Modal
