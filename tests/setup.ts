import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock browser alert and confirm functions
global.alert = vi.fn()
global.confirm = vi.fn(() => true)
