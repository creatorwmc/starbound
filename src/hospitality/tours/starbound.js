import { tourRegistry } from '../lib/registry'

export const starboundMainTour = {
  id: 'starbound-main',
  appId: 'starbound',
  kind: 'deep',
  label: 'Show me around again',
  steps: [
    {
      id: 'orient',
      target: 'body',
      title: 'Welcome to Starbound.',
      body: "The shared sky — every dream, trip, and 'someday' we've added, as stars. Quick walk-through, about two minutes. Bail any time.",
      side: 'auto',
    },
    {
      id: 'menu',
      target: '[data-hospitality="menu"]',
      title: 'The menu',
      body: "Jump between the sky, the list, our home, the hearth, the activity feed. Hidden gems, too.",
      side: 'bottom',
    },
    {
      id: 'immersive',
      target: '[data-hospitality="immersive"]',
      title: 'Just the sky',
      body: "Hides everything but the stars. Tap anywhere to bring the rest back.",
      side: 'bottom',
    },
    {
      id: 'timeline',
      target: '[data-hospitality="timeline"]',
      title: 'Sky timeline',
      body: "Slide through time — see when each star was added, when it lit up. Memory along an axis.",
      side: 'bottom',
    },
    {
      id: 'avatar',
      target: '[data-hospitality="avatar"]',
      title: 'You, here',
      body: "Tap to open settings — theme, account, the lot.",
      side: 'left',
    },
    {
      id: 'add-star',
      target: '[data-hospitality="add-star"]',
      title: 'Add to the sky',
      body: "Anything you want to chase — drop it in. Category, owner, a few words. It becomes a star.",
      side: 'top',
    },
    {
      id: 'closing',
      target: 'body',
      title: "That's it.",
      body: "Add a star, talk to me at the hearth, or just look up. The walkthrough's in the menu whenever you want it again. Welcome.",
      side: 'auto',
    },
  ],
}

tourRegistry.register(starboundMainTour)
