// hospitality/index.js
// Public API. Import from this file, not from internal paths.

export { HospitalityProvider, useHospitality } from './context/HospitalityProvider'
export { CoachMark } from './components/CoachMark'
export { WelcomeMoment } from './components/WelcomeMoment'
export { TourSettingsEntry } from './components/TourSettingsEntry'
export { tourRegistry } from './lib/registry'
export { createFirestoreStorage, createMemoryStorage } from './lib/storage'
