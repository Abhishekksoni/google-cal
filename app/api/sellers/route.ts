import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
  where: {
    role: 'seller',
    accounts: {
      some: {
        refresh_token: { not: null },
      },
    },
  },
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
});

    return NextResponse.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}