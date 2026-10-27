import { useRef } from 'react'

function BackupActions({ onExport, onImport }) {
  const fileInputRef = useRef(null)

  function handleFileChange(event) {
    const file = event.target.files[0]
    event.target.value = '' // lets you pick the same file again later
    if (file) onImport(file)
  }

  return (
    <div className="backup-actions">
      <button className="backup-actions__button" onClick={onExport}>
        Download backup
      </button>
      <button className="backup-actions__button" onClick={() => fileInputRef.current.click()}>
        Restore backup
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        hidden
      />
    </div>
  )
}

export default BackupActions
