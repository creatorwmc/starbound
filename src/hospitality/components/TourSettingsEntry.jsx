// The persistent affordance for retaking a tour. Drop into a settings menu.
// Defaults to a plain button; pass `render` to use a custom trigger.

import { useHospitality } from '../context/HospitalityProvider'

export function TourSettingsEntry({
  tourId,
  label = 'Show me around again',
  render,
}) {
  const { runTour } = useHospitality()
  const handleClick = () => { runTour(tourId) }

  if (render) return <>{render(handleClick)}</>

  return (
    <button
      onClick={handleClick}
      className="hospitality-settings-entry"
      style={{
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '0.95rem',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {label}
    </button>
  )
}
