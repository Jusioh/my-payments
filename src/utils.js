// utils.js - small helper functions + Promise-based storage and file helpers.

// Turns 2500 into "₱2,500" (or "₱2,500.00" if decimals = 2)
export function peso(number, decimals = 0) {
  return (
    '₱' +
    number.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

// First visit: follow the device's light/dark setting
export function systemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

// Returns a Promise that resolves with the saved value (or the fallback).
export function loadSaved(key, fallback) {
  return new Promise((resolve) => {
    try {
      const saved = localStorage.getItem(key)
      resolve(saved !== null ? JSON.parse(saved) : fallback)
    } catch {
      resolve(fallback)
    }
  })
}

// Returns a Promise that resolves when the value is saved, or rejects if saving fails.
export function saveItem(key, value) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// Wraps FileReader in a Promise so we can use .then() / .catch() with it.
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Reads a backup file and resolves with clean { budget, payments }.
// Rejects with an Error if the file is not a valid backup.
export function parseBackup(file, validIcons) {
  return readFileAsText(file).then((text) => {
    const data = JSON.parse(text)
    const validPayments =
      Array.isArray(data.payments) &&
      data.payments.every(
        (p) => p.id !== undefined && typeof p.name === 'string' && typeof p.amount === 'number'
      )
    if (typeof data.budget !== 'number' || !validPayments) {
      throw new Error('Invalid backup')
    }
    return {
      budget: data.budget,
      payments: data.payments.map((p) => ({
        ...p,
        icon: validIcons.includes(p.icon) ? p.icon : 'bill',
        paid: Boolean(p.paid),
        note: p.note || '',
      })),
    }
  })
}

export function downloadBackup(budget, payments) {
  const data = { budget, payments, savedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'my-payments-backup.json'
  link.click()
  URL.revokeObjectURL(url)
}
