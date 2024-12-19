import { NextResponse } from 'next/server'
import { TextToSpeechOptions } from '@/types/speech'
import { GoogleAuth } from 'google-auth-library'
import { config } from '@/lib/config'

const GOOGLE_CLOUD_API_ENDPOINT =
  'https://texttospeech.googleapis.com/v1/text:synthesize'

export const dynamic = 'force-dynamic'

function generatePodcastScript(conversation: string) {
  const lines = conversation
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')

  const script: { text: string; host: string }[] = []
  let currentHost = ''

  const regex = /\*\*(male|female)[12]:?\*\*:?\s*/

  // Debugging: Log the lines before processing
  console.log('regex:', regex)
  console.log('Lines:', lines)

  lines.forEach((line: string) => {
    const speakerMatch = line.match(regex)

    if (speakerMatch) {
      const host = speakerMatch[0].replace(/\*\*/g, '').replace(':', '').trim() // Remove the asterisks and colon
      const text = line.replace(regex, '').trim() // Remove the speaker label

      // Debugging: Log each parsed line
      console.log('Parsed Host:', host)
      console.log('Parsed Text:', text)

      // Push the parsed line into the script array
      script.push({ text, host })

      // Update currentHost to the current speaker
      currentHost = host
    } else if (currentHost) {
      // If the line isn't a host label, continue with the last host
      script.push({ text: line, host: currentHost })
    }
  })

  return script
}

function generatePodcastScripSSML(
  conversation: string,
  speakers: { name: string; voice: string; gender: 'male' | 'female' }[]
) {
  const lines = conversation
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')

  let script: string = '<speak>'
  let currentHost = ''
  let regexMatchs = ''
  const sLen = speakers.length

  const speakerVoiceMap: { [key: string]: string } = {}

  for (let i = 0; i < sLen; i++) {
    const slug = speakers[i].name.replace(/\s/g, '').toLowerCase()
    speakerVoiceMap[slug] = speakers[i].voice
    if (i == sLen - 1) {
      regexMatchs += `${slug}`
    } else {
      regexMatchs += `${slug}|`
    }
  }

  const regexSSML = new RegExp(`\\*\\*(${regexMatchs}):?\\*\\*:?\\s*`)

  // Debugging: Log the lines before processing
  console.log('regexSSML:', regexSSML)
  console.log('Lines:', lines)

  lines.forEach((line: string) => {
    const speakerMatch = line.match(regexSSML)

    if (speakerMatch) {
      const host = speakerMatch[0].replace(/\*\*/g, '').replace(':', '').trim() // Remove the asterisks and colon
      const text = line.replace(regexSSML, '').trim() // Remove the speaker label

      script += `<voice name="${speakerVoiceMap[host]}">${text}</voice>`
    }
  })

  script += '</speak>'

  // Debugging: Log the final script before returning
  console.log('Generated Script:', script)

  return script
}

export async function POST(request: Request) {
  try {
    const { clientEmail, privateKey, apiKey } = config.google

    if (!clientEmail || !privateKey || !apiKey) {
      return NextResponse.json(
        { error: 'Google Cloud credentials not properly configured' },
        { status: 500 }
      )
    }

    let options: TextToSpeechOptions
    try {
      const body = await request.json()
      options = body as TextToSpeechOptions
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    if (!options.text?.trim()) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    console.log('Options:', options)

    const input: {
      multiSpeakerMarkup?: {
        turns?: {
          text?: string
          speaker?: string
        }[]
      }
      ssml?: string
      text?: string
    } = {}

    if (options.speakers && options.speakers.length > 0) {
      const ssml = generatePodcastScripSSML(
        options.text?.trim(),
        options.speakers
      )
      console.log('SSML:', ssml)
      input.ssml = ssml
    } else {
      const script = generatePodcastScript(options.text?.trim())

      // Multi-speaker dialogue configuration
      const dialogue = script.map(({ text, host }) => {
        let hostName = 'S'
        if (host === 'Male1') {
          hostName = 'S'
        } else if (host === 'Female1') {
          hostName = 'R'
        } else if (host === 'Male2') {
          hostName = 'S'
        } else if (host === 'Female2') {
          hostName = 'R'
        }

        return {
          text,
          speaker: hostName
        }
      })

      const turns = dialogue.map(({ text, speaker }) => ({
        text,
        speaker
      }))
      input.multiSpeakerMarkup = {
        turns
      }
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
        project_id: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID || ''
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })

    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()

    if (!accessToken.token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      )
    }

    const response = await fetch(GOOGLE_CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify({
        input,
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Neural2-A' // Multi-speaker voice
        },
        audioConfig: {
          audioEncoding: 'MP3'
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Google Cloud API error:', error)
      return NextResponse.json(
        { error: error.error?.message || 'Speech synthesis failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.audioContent) {
      return NextResponse.json(
        { error: 'No audio content received from Google Cloud' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      audioContent: data.audioContent,
      duration: Math.ceil(
        Buffer.from(data.audioContent, 'base64').length / 32000
      )
    })
  } catch (error) {
    console.error('Speech synthesis error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to synthesize speech'
      },
      { status: 500 }
    )
  }
}
