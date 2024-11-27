import { CogIcon } from '@sanity/icons'
import { defineConfig } from 'sanity'
import { type StructureBuilder, type DefaultDocumentNodeResolver } from 'sanity/structure'

const structure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Singleton for Capsule Settings
      S.listItem()
        .title('Paramètres des Capsules')
        .icon(CogIcon)
        .child(
          S.document()
            .title('Paramètres des Capsules')
            .schemaType('capsuleSettings')
            .documentId('capsuleSettings')
        ),
      
      // Regular document types
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['capsuleSettings'].includes(listItem.getId() as string)
      ),
    ])
}

export default structure
