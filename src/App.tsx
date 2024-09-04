import { Router } from '@solidjs/router'

import { RootLayout } from './components/RootLayout'
import { ROUTES } from './router'

export default function App() {
  return <Router root={RootLayout}>{ROUTES}</Router>
}
