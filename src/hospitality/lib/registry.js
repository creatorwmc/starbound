// Tour registry — tours are defined alongside the components they describe
// and registered at app boot via side-effect import.

class TourRegistry {
  constructor() {
    this.tours = new Map()
  }

  register(tour) {
    if (this.tours.has(tour.id)) {
      console.warn(`[hospitality] Tour "${tour.id}" registered twice. Overwriting.`)
    }
    this.tours.set(tour.id, tour)
  }

  get(id) {
    return this.tours.get(id)
  }

  forApp(appId) {
    return Array.from(this.tours.values()).filter((t) => t.appId === appId)
  }
}

export const tourRegistry = new TourRegistry()
