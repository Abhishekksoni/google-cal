import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { refreshToken } = await request.json();
    
    if (refreshToken) {
      const encryptedToken = encrypt(refreshToken);
      
      await prisma.user.upsert({
        where: { email: session.user.email },
        create: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          refreshToken: encryptedToken,
        },
        update: {
          refreshToken: encryptedToken,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing refresh token:', error);
    return NextResponse.json(
      { error: 'Failed to store refresh token' },
      { status: 500 }
    );
  }
}