interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface CachedToken {
  token: string;
  expires_at: number;
}

let tokenCache: CachedToken | null = null;

export async function getTwitchAppAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && Date.now() < tokenCache.expires_at) {
    return tokenCache.token;
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set in environment variables');
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Twitch token: ${response.status} ${response.statusText}`);
    }

    const data: TwitchTokenResponse = await response.json();
    
    // Cache the token with 10 minutes buffer before expiry
    const expiresAt = Date.now() + (data.expires_in - 600) * 1000;
    tokenCache = {
      token: data.access_token,
      expires_at: expiresAt,
    };

    return data.access_token;
  } catch (error) {
    console.error('Error fetching Twitch app access token:', error);
    throw error;
  }
}
