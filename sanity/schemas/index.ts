import { type SchemaTypeDefinition } from 'sanity'

import home from './singletons/home'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home],
}
