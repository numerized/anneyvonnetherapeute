import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'capsuleSettings',
  title: 'Paramètres des Capsules',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Titre affiché dans le formulaire d\'inscription',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description affichée sous le titre',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Texte du bouton',
      type: 'string',
      description: 'Texte affiché sur le bouton d\'inscription',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'text',
      description: 'Message affiché après une inscription réussie',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'registeredUsers',
      title: 'Utilisateurs inscrits',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'capsuleUser' }] }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Paramètres des Capsules',
      }
    },
  },
})
