import { type SchemaTypeDefinition } from 'sanity'

import hero from './schemas/objects/hero'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hero],
}
