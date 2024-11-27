import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'statistics',
  title: 'Statistics Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statistic',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string', // Using string to allow for percentage signs and plus symbols
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              number: 'number',
              label: 'label',
            },
            prepare({ number, label }) {
              return {
                title: `${number} - ${label}`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Statistics Section',
      }
    },
  },
})
