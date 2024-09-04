/* @refresh reload */
import './index.css'
import 'solid-devtools'

import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import { render } from 'solid-js/web'

import App from './App'

attachDevtoolsOverlay()

render(() => <App />, document.getElementById('root') ?? document.body)
