import { CogIcon } from '@sanity/icons'
import { defineConfig } from 'sanity'
import { type StructureBuilder } from 'sanity/structure'

const capsuleStructure = (S: StructureBuilder) => 
  S.listItem()
    .title('Paramètres des Capsules')
    .icon(CogIcon)
    .child(
      S.document()
        .title('Paramètres des Capsules')
        .schemaType('capsuleSettings')
        .documentId('capsuleSettings')
    )

export default capsuleStructure
