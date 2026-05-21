// Thin wrapper around driver.js. The rest of the app talks to this
// interface, not driver.js directly — swap point if we ever migrate.

import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export function runDriverTour(tour, options) {
  let lastStepId = tour.steps[0]?.id ?? ''
  let completed = false

  const driverSteps = tour.steps.map((step) => ({
    element: step.target,
    popover: {
      title: step.title,
      description: step.body,
      side: step.side === 'auto' ? undefined : step.side,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'All set',
    },
    onHighlightStarted: async () => {
      lastStepId = step.id
      if (step.onBeforeShow) await step.onBeforeShow()
    },
  }))

  const instance = driver({
    steps: driverSteps,
    showProgress: true,
    progressText: '{{current}} of {{total}}',
    popoverClass: 'hospitality-popover',
    overlayOpacity: 0.6,
    smoothScroll: true,
    allowClose: true,
    onCloseClick: () => {
      options.onDismiss(lastStepId)
      instance.destroy()
    },
    onNextClick: () => {
      const isLast = instance.getActiveIndex() === tour.steps.length - 1
      if (isLast) {
        completed = true
        instance.destroy()
      } else {
        instance.moveNext()
      }
    },
    onDestroyed: () => {
      if (completed) options.onComplete()
    },
  })

  instance.drive()
  return instance
}
