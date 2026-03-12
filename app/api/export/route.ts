import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { composition } = await request.json()

    if (!composition || !composition.melody) {
      return NextResponse.json(
        { error: 'Invalid composition data' },
        { status: 400 }
      )
    }

    // Create WAV file from melody
    const audioBuffer = createAudioBuffer(composition.melody)
    const wavBuffer = bufferToWav(audioBuffer)

    return new NextResponse(wavBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': `attachment; filename="${composition.title || 'composition'}.wav"`,
      },
    })
  } catch (error) {
    console.error('Error exporting composition:', error)
    return NextResponse.json(
      { error: 'Failed to export composition' },
      { status: 500 }
    )
  }
}

function createAudioBuffer(
  melody: Array<{ note: string; frequency: number; duration: number }>
): Float32Array {
  const sampleRate = 44100
  const totalDuration = melody.reduce((sum, note) => sum + note.duration * 0.5, 0)
  const totalSamples = Math.floor(totalDuration * sampleRate)
  const audioBuffer = new Float32Array(totalSamples)

  let sampleIndex = 0

  melody.forEach((note) => {
    const noteDuration = note.duration * 0.5
    const noteSamples = Math.floor(noteDuration * sampleRate)

    // Apply envelope (attack, sustain, release)
    const attackSamples = Math.floor(0.05 * sampleRate)
    const releaseSamples = Math.floor(0.1 * sampleRate)
    const sustainSamples = noteSamples - attackSamples - releaseSamples

    for (let i = 0; i < noteSamples; i++) {
      const t = i / sampleRate
      let amplitude = 1

      // Attack envelope
      if (i < attackSamples) {
        amplitude = i / attackSamples
      }
      // Release envelope
      else if (i > noteSamples - releaseSamples) {
        amplitude = (noteSamples - i) / releaseSamples
      }

      // Generate sine wave
      const sample =
        amplitude *
        Math.sin(2 * Math.PI * note.frequency * t) *
        0.3 // 0.3 for safe volume

      audioBuffer[sampleIndex + i] = Math.max(-1, Math.min(1, sample))
    }

    sampleIndex += noteSamples
  })

  return audioBuffer
}

function bufferToWav(audioBuffer: Float32Array): ArrayBuffer {
  const sampleRate = 44100
  const format = 1 // PCM
  const numChannels = 1
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample

  const headerLength = 44
  const bufferLength = audioBuffer.length * bytesPerSample
  const totalLength = headerLength + bufferLength

  const arrayBuffer = new ArrayBuffer(totalLength)
  const view = new DataView(arrayBuffer)

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, totalLength - 8, true)
  writeString(8, 'WAVE')

  // fmt sub-chunk
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // Subchunk1Size
  view.setUint16(20, format, true) // AudioFormat
  view.setUint16(22, numChannels, true) // NumChannels
  view.setUint32(24, sampleRate, true) // SampleRate
  view.setUint32(28, sampleRate * blockAlign, true) // ByteRate
  view.setUint16(32, blockAlign, true) // BlockAlign
  view.setUint16(34, bitDepth, true) // BitsPerSample

  // data sub-chunk
  writeString(36, 'data')
  view.setUint32(40, bufferLength, true) // Subchunk2Size

  // Write audio samples
  let offset = 44
  for (let i = 0; i < audioBuffer.length; i++) {
    const sample = audioBuffer[i]
    const intSample = Math.round(sample * 0x7fff) // Convert to 16-bit signed integer
    view.setInt16(offset, intSample, true)
    offset += 2
  }

  return arrayBuffer
}
