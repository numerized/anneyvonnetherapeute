import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image de fond',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texte alternatif',
          type: 'string',
          description: "Important pour l'accessibilité et le SEO",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Texte',
          type: 'string',
          initialValue: 'PROGRAMME ACTUEL',
        },
        {
          name: 'ariaLabel',
          title: 'Aria Label',
          type: 'string',
          description: "Label pour l'accessibilité",
          initialValue: 'Programme actuel',
        },
      ],
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'CŒUR À CORPS',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: "amours et sexualités, l'accord !",
    }),
    defineField({
      name: 'ctaButton',
      title: "Bouton d'action",
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Texte du bouton',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'DÉCOUVRIR LE PROGRAMME',
        },
        {
          name: 'ariaLabel',
          title: 'Aria Label',
          type: 'string',
          description: "Label pour l'accessibilité",
          validation: (Rule) => Rule.required(),
          initialValue: 'Découvrir le programme',
        },
        {
          name: 'link',
          title: 'Lien',
          type: 'string',
          description: 'URL de destination du bouton',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
  },
})
