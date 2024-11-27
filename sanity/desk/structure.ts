import { StructureBuilder } from 'sanity/desk'
import { HomeIcon, CogIcon } from '@sanity/icons'

export const structure = (S: StructureBuilder) => {
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
