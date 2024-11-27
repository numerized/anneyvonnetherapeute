import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'capsuleUser',
  title: 'Capsule Users',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'registeredAt',
      title: 'Registered At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'registeredAt',
    },
  },
})
