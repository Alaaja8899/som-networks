import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/groups
 * Fetches WhatsApp groups from the external API
 * This route acts as a proxy to keep the API key secure on the server
 */
export async function GET(request: NextRequest) {
  try {
    const apiEndpoint = process.env.WHATSAPP_API_ENDPOINT || "http://178.18.245.131:3000/api/default/groups";
    const apiKey = process.env.WHATSAPP_API_KEY || "fd8f788274a146dabf908b7c37c9b055";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "WhatsApp API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-Api-Key": apiKey,
      },
      // Add cache control
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch groups: ${response.statusText}`);
    }

    const groups = await response.json();

    // Transform the groups to include only necessary information
    const transformedGroups = groups.map((group: any) => ({
      chatId: group.id?._serialized || group.groupMetadata?.id?._serialized,
      name: group.name || group.groupMetadata?.subject || "Unknown Group",
      subject: group.groupMetadata?.subject || group.name,
      participantsCount: group.groupMetadata?.participants?.length || 0,
    })).filter((group: any) => group.chatId); // Filter out groups without chatId

    return NextResponse.json(
      { success: true, data: transformedGroups },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
