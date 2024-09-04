/* @refresh reload */
import './index.css'
import 'solid-devtools'

import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import { render } from 'solid-js/web'
import { config } from 'telefunc/client'

import App from './App'

config.telefuncUrl = 'http://localhost:3000/_telefunc'

attachDevtoolsOverlay()

render(() => <App />, document.getElementById('root') ?? document.body)
