import { Router } from '@solidjs/router'
import { type JSX } from 'solid-js'

import { RootLayout } from './components/RootLayout'
import { ROUTES } from './router'

export default function App(): JSX.Element {
  return <Router root={RootLayout}>{ROUTES}</Router>
}
