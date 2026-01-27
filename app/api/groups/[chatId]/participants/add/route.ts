import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/groups/[chatId]/participants/add
 * Adds a participant to a WhatsApp group with fallback to invite link
 * 
 * IMPORTANT: The HTTP response can be 200 even if the operation fails!
 * We MUST check the response body for `code: 200` or success indicators.
 * 
 * Body: {
 *   participants: [{ id: string }],
 *   studentName?: string,  // Optional: for welcome message
 *   courseName?: string    // Optional: for invite message
 * }
 * 
 * Flow:
 * 1. Try to add participant to group
 * 2. Check response body for `code: 200` (NOT just HTTP status)
 * 3. If successful: Return success response
 * 4. If failed: Get invite code and return it (admin will send manually)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> | { chatId: string } }
) {
  const { chatId } = await Promise.resolve(params);
  const body = await request.json();
  const { participants, studentName, courseName } = body;

  // Validation
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return NextResponse.json(
      { success: false, error: "Participants array is required" },
      { status: 400 }
    );
  }

  // Get API configuration
  let groupsBaseUrl = "http://178.18.245.131:3000/api/default";
  let apiBaseUrl = "http://178.18.245.131:3000/api";
  
  if (process.env.WHATSAPP_API_ENDPOINT) {
    const endpoint = process.env.WHATSAPP_API_ENDPOINT;
    groupsBaseUrl = endpoint.replace(/\/groups\/?$/, "");
    apiBaseUrl = groupsBaseUrl.replace(/\/default\/?$/, "");
  }

  const apiKey = process.env.WHATSAPP_API_KEY || "fd8f788274a146dabf908b7c37c9b055";
  const encodedChatId = encodeURIComponent(chatId);
  const participantId = participants[0].id;

  console.log(`Processing request: group ${chatId}, participant ${participantId}`);

  // Step 1: Try to add participant to the group
  const addParticipantUrl = `${groupsBaseUrl}/groups/${encodedChatId}/participants/add`;
  console.log(`Adding participant via: ${addParticipantUrl}`);
  
  const addResponse = await fetch(addParticipantUrl, {
    method: "POST",
    headers: {
      accept: "*/*",
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participants }),
  });

  const responseText = await addResponse.text();
  let responseBody: any = null;
  
  // Parse response
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  console.log(`Add participant response:`, {
    status: addResponse.status,
    body: typeof responseBody === 'string' ? responseBody.substring(0, 200) : responseBody
  });

  // Check if participant addition was successful
  // Look for `code: 200` in the response body
  let directAddSuccessful = false;
  let addError: string | null = null;

  if (responseBody && typeof responseBody === 'object' && responseBody !== null) {
    const participantKey = participantId;
    
    if (responseBody[participantKey]) {
      const participantResponse = responseBody[participantKey];
      if (participantResponse.code === 200) {
        directAddSuccessful = true;
        console.log(`✓ Direct add successful: Participant ${participantId} has code 200`);
      } else {
        addError = participantResponse.message || `Failed with code ${participantResponse.code || 'unknown'}`;
      }
    } else if (responseBody.code === 200) {
      directAddSuccessful = true;
      console.log(`✓ Direct add successful: Top-level code 200`);
    } else if (responseBody.success === true) {
      directAddSuccessful = true;
      console.log(`✓ Direct add successful: success field is true`);
    } else if (responseBody.error) {
      addError = responseBody.error;
    } else {
      addError = "No success code in response body";
    }
  } else if (typeof responseBody === 'string') {
    if (responseBody.includes('200') || responseBody.toLowerCase().includes('success')) {
      directAddSuccessful = true;
    } else {
      addError = `String response: ${responseBody.substring(0, 100)}`;
    }
  } else {
    addError = "Empty or invalid response body";
  }

  // Step 2: If direct add was successful, return success
  if (directAddSuccessful) {
    return NextResponse.json(
      { 
        success: true, 
        data: responseBody,
        method: "direct_add",
        message: "Participant added directly to group"
      },
      { status: 200 }
    );
  }

  console.log(`Direct add failed: ${addError}`);
  console.log(`Getting invite code for group ${chatId}...`);

  // Step 3: Get invite code for the group
  const inviteCodeUrl = `${groupsBaseUrl}/groups/${encodedChatId}/invite-code`;
  console.log(`Invite code URL: ${inviteCodeUrl}`);
  
  const inviteResponse = await fetch(inviteCodeUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-Api-Key": apiKey,
    },
  });

  const inviteText = await inviteResponse.text();
  console.log(`Invite code response status: ${inviteResponse.status}`);
  
  let inviteLink = null;
  let inviteCodeError = null;

  if (inviteResponse.ok) {
    let inviteCode = "";
    
    if (inviteText) {
      try {
        const jsonData = JSON.parse(inviteText);
        inviteCode = jsonData.inviteCode || jsonData.code || jsonData.data || 
                     jsonData.link || jsonData.invite || jsonData || "";
      } catch {
        inviteCode = inviteText.replace(/^"|"$/g, "").trim();
      }
    }

    if (inviteCode && inviteCode.trim() !== "") {
      inviteCode = inviteCode.replace('https://chat.whatsapp.com/', '');
      inviteCode = inviteCode.replace('chat.whatsapp.com/', '');
      inviteCode = inviteCode.trim();
      inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
      console.log(`✓ Got invite link: ${inviteLink}`);
    } else {
      inviteCodeError = "Invite code empty or not found in response";
      console.log(`✗ Invite code not found`);
    }
  } else {
    inviteCodeError = `HTTP ${inviteResponse.status}: ${inviteText.substring(0, 200)}`;
    console.log(`✗ Failed to get invite code: ${inviteCodeError}`);
  }

  // Step 4: Return the invite link so admin can send it manually
  // We're NOT trying to send the message anymore because of the API error
  if (inviteLink) {
    // Create the message that should be sent manually
    let messageToSend = "";
    if (studentName && courseName) {
      messageToSend = `${studentName}! Fadlan kusoo biir groupka "${courseName}"  ${inviteLink}`;
    } else if (studentName) {
      messageToSend = `${studentName}! Fadlan kusoo biir groupka ${inviteLink}`;
    } else {
      messageToSend = `Fadlan kusoo biir groupka ${inviteLink}`;
    }

    return NextResponse.json(
      {
        success: true,
        method: "manual_invite_required",
        inviteLink,
        messageToSend,
        participantId,
        originalAddError: addError || undefined,
        note: "The WhatsApp API is currently experiencing issues with sending messages ('Lid is missing in chat table'). Please send the invite link manually to the student.",
        instructions: `Send this message to ${participantId}: "${messageToSend}"`,
        curlCommand: `curl -X 'POST' 'http://178.18.245.131:3000/api/sendText' -H 'accept: application/json' -H 'X-Api-Key: ${apiKey}' -H 'Content-Type: application/json' -d '{"chatId": "${participantId}", "reply_to": null, "text": "${messageToSend.replace(/'/g, "\\'")}", "linkPreview": true, "linkPreviewHighQuality": false, "session": "default"}'`,
        message: "Participant couldn't be added directly. Invite link was generated. Please send it manually to the student using the provided details."
      },
      { status: 200 }
    );
  } else {
    // We failed to get invite link
    return NextResponse.json(
      {
        success: false,
        method: "complete_failure",
        inviteLink: null,
        participantId,
        originalAddError: addError || undefined,
        inviteCodeError: inviteCodeError || undefined,
        message: "Failed to add participant directly and could not get invite link. Manual intervention required."
      },
      { status: 500 }
    );
  }
}