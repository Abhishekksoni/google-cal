export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import { createCalendarEvent } from '../../../lib/googleCalendar';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        OR: [
          { sellerId: session.user.id },
          { buyerId: session.user.id },
        ],
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true, image: true },
        },
        buyer: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sellerId, title, description, startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing startTime or endTime' },
        { status: 400 }
      );
    }

    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    });

    const buyer = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!seller || !buyer || !seller.email || !buyer.email) {
      return NextResponse.json(
        { error: 'Seller or buyer not found' },
        { status: 404 }
      );
    }

    const { eventId, meetingLink } = await createCalendarEvent(
      sellerId,
      {
        title,
        description,
        startTime,
        endTime,
        sellerEmail: seller.email,
        buyerEmail: buyer.email,
      }
    );

    const appointment = await prisma.appointment.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        sellerId,
        buyerId: session.user.id,
        googleEventId: eventId,
        meetingLink,
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true, image: true },
        },
        buyer: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
