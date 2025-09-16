import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '../../../lib/googleCalendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const date = searchParams.get('date');

    if (!sellerId || !date) {
      return NextResponse.json(
        { error: 'sellerId and date are required' },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(sellerId, date);
    // console.log("Available slots:", slots);
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error getting availability:', error);
    return NextResponse.json(
      { error: 'Failed to get availability' },
      { status: 500 }
    );
  }
}