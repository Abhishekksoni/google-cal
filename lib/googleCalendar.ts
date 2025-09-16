import { google } from "googleapis";
import { prisma } from "./db";

/**
 * Returns an authenticated Google Calendar client for the given user
 */
export async function getGoogleCalendarClient(userId: string) {
  // Find the Google account for this user
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account) {
    throw new Error("Google account not found for this user");
  }

  if (!account.refresh_token) {
    throw new Error("No refresh token found for user. Ask them to re-login with Google.");
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/api/auth/callback/google" // callback must match Google console
  );

  // Set credentials using refresh token
  oauth2Client.setCredentials({
    refresh_token: account.refresh_token,
  });

  try {
    // Get a fresh access token
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Unable to refresh Google access token");
    }

    return google.calendar({ version: "v3", auth: oauth2Client });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

/**
 * Get available 1-hour slots between 9am–5pm for a seller on a given date
 */
export async function getAvailableSlots(sellerId: string, date: string) {
  try {
    const calendar = await getGoogleCalendarClient(sellerId);

    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busy = response.data.calendars?.primary?.busy || [];
    const slots: { start: string; end: string }[] = [];

    // Generate 1-hour slots
    for (let hour = 9; hour < 17; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if slot overlaps with busy times
      const isAvailable = !busy.some((busySlot) => {
        const busyStart = new Date(busySlot.start!);
        const busyEnd = new Date(busySlot.end!);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      if (isAvailable) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }

    return slots;
  } catch (error) {
    console.error("Error getting available slots:", error);
    throw error;
  }
}

/**
 * Create a Google Calendar event for seller, invite buyer
 */
export async function createCalendarEvent(
  sellerId: string,
  eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    buyerEmail: string;
    sellerEmail: string;
  }
) {
  try {
    const sellerCalendar = await getGoogleCalendarClient(sellerId);
    

   if (!eventData.startTime || !eventData.endTime) {
  throw new Error("Missing startTime or endTime for calendar event");
}

const event = {
  summary: eventData.title,
  description: eventData.description,
  start: {
    dateTime: new Date(eventData.startTime).toISOString(),
    timeZone: "UTC",
  },
  end: {
    dateTime: new Date(eventData.endTime).toISOString(),
    timeZone: "UTC",
  },
  attendees: [
    { email: eventData.sellerEmail },
    { email: eventData.buyerEmail },
  ],
  conferenceData: {
    createRequest: {
      requestId: Math.random().toString(36).substring(7),
      conferenceSolutionKey: { type: "hangoutsMeet" },
    },
  },
};

    // Create event on seller’s calendar (buyer is automatically invited)
    const sellerEvent = await sellerCalendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // ensures email invites are sent
    });

    return {
      eventId: sellerEvent.data.id,
      meetingLink: sellerEvent.data.conferenceData?.entryPoints?.[0]?.uri,
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
