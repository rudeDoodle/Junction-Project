// Eleven Labs Text-to-Speech Service
// Add your API key to your environment variables as VITE_ELEVENLABS_API_KEY

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice - you can change this to any voice ID

export async function textToSpeech(text: string): Promise<Blob> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('Eleven Labs API key not found. Please add VITE_ELEVENLABS_API_KEY to your .env file');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Eleven Labs API error: ${error}`);
  }

  return await response.blob();
}

// Available voice IDs (you can change the VOICE_ID constant above to use different voices):
// 'EXAVITQu4vr4xnSDxMaL' - Sarah (default)
// '21m00Tcm4TlvDq8ikWAM' - Rachel
// 'AZnzlk1XvdvUeBnXmlld' - Domi
// 'ErXwobaYiN019PkySvjV' - Antoni
// 'MF3mGyEYCl7XYWbV9V6O' - Elli
// 'TxGEqnHWrfWFTfGW9XjX' - Josh
// 'VR6AewLTigWG4xSOukaG' - Arnold
// 'pNInz6obpgDQGcFmaJgB' - Adam
// 'yoZ06aMxZJJ28mfd3POQ' - Sam