import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import type { ValidationContext } from 'sanity'

interface MenuItem {
  title: string
  linkType: 'reference' | 'anchor'
  reference?: any
  anchor?: string
}

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Menu Item list',
      description: 'Links displayed on the header of your site.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            defineField({
              title: 'Title',
              name: 'title',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              title: 'Link Type',
              name: 'linkType',
              type: 'string',
              options: {
                list: [
                  { title: 'Internal Page', value: 'reference' },
                  { title: 'Anchor Scroll', value: 'anchor' }
                ],
                layout: 'radio'
              },
              validation: Rule => Rule.required()
            }),
            defineField({
              title: 'Page Reference',
              name: 'reference',
              type: 'reference',
              to: [
                { type: 'home' },
                { type: 'page' },
                { type: 'project' }
              ],
              hidden: ({ parent }: { parent: MenuItem }) => parent?.linkType !== 'reference'
            }),
            defineField({
              title: 'Anchor ID',
              name: 'anchor',
              type: 'string',
              description: 'The ID of the section to scroll to (without the # symbol)',
              hidden: ({ parent }: { parent: MenuItem }) => parent?.linkType !== 'anchor',
              validation: Rule => Rule.custom((anchor: string | undefined, context: ValidationContext) => {
                const parent = context.parent as MenuItem
                if (parent?.linkType === 'anchor' && !anchor) {
                  return 'Anchor ID is required for anchor links'
                }
                return true
              })
            })
          ],
          preview: {
            select: {
              title: 'title',
              linkType: 'linkType',
              reference: 'reference.title',
              anchor: 'anchor'
            },
            prepare(selection: MenuItem & { reference?: string }) {
              const { title, linkType, reference, anchor } = selection
              return {
                title: title,
                subtitle: linkType === 'reference' 
                  ? `Page: ${reference || 'Not set'}`
                  : `Scroll to: #${anchor || 'Not set'}`
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'footer',
      description:
        'This is a block of text that will be displayed at the bottom of the page.',
      title: 'Footer Info',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
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
          },
        }),
      ],
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Newsletter Title',
          type: 'string',
          description: 'The main title for the newsletter section',
        }),
        defineField({
          name: 'description',
          title: 'Newsletter Description',
          type: 'text',
          description: 'A brief description of what subscribers will receive',
        }),
        defineField({
          name: 'buttonText',
          title: 'Subscribe Button Text',
          type: 'string',
          description: 'Text to display on the subscribe button',
        }),
        defineField({
          name: 'placeholder',
          title: 'Input Placeholder',
          type: 'string',
          description: 'Placeholder text for the email input field',
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Menu Items',
      }
    },
  },
})
