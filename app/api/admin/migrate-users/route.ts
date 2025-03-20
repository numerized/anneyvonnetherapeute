import { migrateAllUsersToEnglish } from '@/lib/userService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In production, you should add authentication here to ensure only admins can access this
    await migrateAllUsersToEnglish();
    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Error during user migration:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: String(error) },
      { status: 500 }
    );
  }
}
