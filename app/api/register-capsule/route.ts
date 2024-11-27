import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

// Create a new client with write permissions
const client = writeClient

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const existingUser = await client.fetch(
      `*[_type == "capsuleUser" && email == $email][0]`,
      { email }
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Create new capsule user in Sanity
    const newUser = await client.create({
      _type: 'capsuleUser',
      email,
      registeredAt: new Date().toISOString(),
    })

    try {
      // Check if capsuleSettings exists
      const existingSettings = await client.fetch('*[_type == "capsuleSettings"][0]')

      if (!existingSettings) {
        // Create capsuleSettings if it doesn't exist
        await client.create({
          _type: 'capsuleSettings',
          _id: 'capsuleSettings',
          title: 'CAPSULES AUDIO',
          description: 'Inscrivez-vous pour accéder à nos capsules podcast, à écouter en déplacement ou tranquillement chez vous.',
          buttonText: 'Accéder aux capsules',
          successMessage: 'Merci de votre inscription ! Vous recevrez bientôt un email de confirmation.',
          registeredUsers: [{ _type: 'reference', _ref: newUser._id }]
        })
      } else {
        // Update existing capsuleSettings
        await client
          .patch('capsuleSettings')
          .setIfMissing({ registeredUsers: [] })
          .append('registeredUsers', [{ _type: 'reference', _ref: newUser._id }])
          .commit()
      }
    } catch (error) {
      // Log the error but don't fail the registration
      console.warn('Could not update capsuleSettings:', error)
    }

    return NextResponse.json({ success: true, result: newUser })
  } catch (error) {
    console.error('Error registering capsule user:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
