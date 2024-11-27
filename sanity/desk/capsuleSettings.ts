import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export const capsuleStructure = (S: any) =>
  S.listItem()
    .title('Paramètres des Capsules')
    .icon(CogIcon)
    .child(
      S.document()
        .title('Paramètres des Capsules')
        .schemaType('capsuleSettings')
        .documentId('capsuleSettings')
    )
