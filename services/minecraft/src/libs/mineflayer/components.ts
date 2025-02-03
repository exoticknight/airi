import type { Logg } from '@guiiai/logg'
import type { Handler } from './types'

import { useLogg } from '@guiiai/logg'

export class Components {
  private components: Map<string, Handler> = new Map()
  private logger: Logg

  constructor() {
    this.logger = useLogg('Components').useGlobalConfig()
  }

  register(componentName: string, component: Handler) {
    this.components.set(componentName, component)
  }

  get(componentName: string) {
    return this.components.get(componentName)
  }

  list() {
    return Array.from(this.components.keys())
  }

  cleanup() {
    this.logger.log('Cleaning up components')
    this.components.clear()
  }
}
