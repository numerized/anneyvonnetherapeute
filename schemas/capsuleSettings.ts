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
      initialValue: 'CAPSULES AUDIO'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description des capsules audio',
      validation: (Rule) => Rule.required(),
      initialValue: 'Inscrivez-vous pour accéder à nos capsules podcast, à écouter en déplacement ou tranquillement chez vous.'
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Placeholder du champ email',
      type: 'string',
      description: 'Texte affiché dans le champ email quand il est vide',
      validation: (Rule) => Rule.required(),
      initialValue: 'Votre adresse email'
    }),
    defineField({
      name: 'emailLabel',
      title: 'Label du champ email',
      type: 'string',
      description: 'Label du champ email pour l\'accessibilité',
      validation: (Rule) => Rule.required(),
      initialValue: 'Adresse email'
    }),
    defineField({
      name: 'buttonText',
      title: 'Texte du bouton',
      type: 'string',
      description: 'Texte affiché sur le bouton d\'inscription',
      validation: (Rule) => Rule.required(),
      initialValue: 'Accéder aux capsules'
    }),
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'string',
      description: 'Message affiché après une inscription réussie',
      validation: (Rule) => Rule.required(),
      initialValue: 'Merci de votre inscription ! Vous recevrez bientôt un email de confirmation.'
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
      subtitle: 'description'
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || 'Paramètres des Capsules',
        subtitle
      }
    }
  }
})
