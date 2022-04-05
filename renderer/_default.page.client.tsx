import ReactDOMClient from 'react-dom/client'
import type { Environment } from 'react-relay'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'
import type { PageContext } from '../types'
import preloadQuery from './preloadQuery'
import { PageShell } from './PageShell'
import { RouteManager } from './routeManager'

let containerRoot: ReactDOMClient.Root | null = null
let relayEnvironment: Environment | null = null
let routeManager: RouteManager | null = null

export const clientRouting = true

// `render()` is called on every navigation.
export async function render(
  pageContext: PageContextBuiltInClient & PageContext
) {
  const {
    Page,
    relayInitialData,
    exports: { initRelayEnvironment },
  } = pageContext

  if (!relayEnvironment)
    relayEnvironment = initRelayEnvironment(false, relayInitialData)

  // Load the query needed for the page.
  // Preloading through links is not supported yet, see https://github.com/brillout/vite-plugin-ssr/issues/246 for details.
  const relayQueryRef = preloadQuery(pageContext, relayEnvironment)

  // Create a new route manager if haven't.
  routeManager ??= new RouteManager()
  // Update the route manager with the new route.
  routeManager.setPage(Page, relayQueryRef)

  if (!containerRoot) {
    const page = (
      <PageShell
        pageContext={pageContext}
        relayEnvironment={relayEnvironment}
        routeManager={routeManager}
      />
    )

    // Hydrate the page.
    const container = document.getElementById('page-view')
    if (!container)
      throw new Error(
        'Element with id "page-view" not found, which was expected to be a container root.'
      )

    if (pageContext.isHydration) {
      containerRoot = ReactDOMClient.hydrateRoot(container, page)
    } else {
      containerRoot = ReactDOMClient.createRoot(container)
      containerRoot.render(page)
    }
  }
}
