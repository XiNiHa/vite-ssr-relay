import React from 'react'
import { RelayEnvironmentProvider, type Environment } from 'react-relay'
import type { PageContext } from '../types'
import { RouteManager, useRouteManager } from './routeManager'

import { PageContextProvider } from './usePageContext'

export interface PageShellProps {
  pageContext: PageContext
  relayEnvironment: Environment
  routeManager: RouteManager
}

// Page root component
export const PageShell: React.FC<PageShellProps> = ({
  pageContext,
  relayEnvironment,
  routeManager,
}) => {
  const PageLayout =
    pageContext.exports?.PageLayout ??
    pageContext.exports?.pageLayout ??
    Passthrough
  const [CurrentPage, queryRef, routeTransitioning] =
    useRouteManager(routeManager)

  return (
    <React.StrictMode>
      <RelayEnvironmentProvider environment={relayEnvironment}>
        <PageContextProvider pageContext={pageContext}>
          <PageLayout routeTransitioning={routeTransitioning}>
            {CurrentPage && <CurrentPage queryRef={queryRef} />}
          </PageLayout>
        </PageContextProvider>
      </RelayEnvironmentProvider>
    </React.StrictMode>
  )
}

const Passthrough: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>
