import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'object',
          fields: [
            defineField({
              name: 'asset',
              type: 'image',
              title: 'Image',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'badge',
          title: 'Badge',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              type: 'string',
              title: 'Badge Text',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'ariaLabel',
              type: 'string',
              title: 'Aria Label',
              description: 'Accessibility description for screen readers',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Hero Title',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subtitle',
          type: 'string',
          title: 'Hero Subtitle',
        }),
        defineField({
          name: 'ctaButton',
          title: 'Call to Action Button',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              type: 'string',
              title: 'Button Text',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'ariaLabel',
              type: 'string',
              title: 'Aria Label',
              description: 'Accessibility description for screen readers',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              type: 'string',
              title: 'Button Link',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Description',
      type: 'array',
      of: [
        // Paragraphs
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
            decorators: [
              {
                title: 'Italic',
                value: 'em',
              },
              {
                title: 'Strong',
                value: 'strong',
              },
            ],
          },
          styles: [],
          type: 'block',
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      name: 'showcaseProjects',
      title: 'Showcase projects',
      description:
        'These are the projects that will appear first on your landing page.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
