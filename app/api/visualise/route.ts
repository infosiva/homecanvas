import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const roomType  = form.get('roomType')  as string
    const style     = form.get('style')     as string
    const imageFile = form.get('image')     as File | null

    if (!roomType || !style) {
      return NextResponse.json({ error: 'roomType and style required' }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY
    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 })
    }

    const stylePrompts: Record<string, string> = {
      modern:     'sleek modern minimalist interior, clean lines, neutral palette, statement pendant lighting, ultra realistic',
      scandi:     'Scandinavian hygge interior, natural pine wood, white walls, cosy knit textures, warm ambient lighting, ultra realistic',
      industrial: 'urban industrial loft interior, exposed brick walls, steel beams, Edison bulb pendants, dark leather accents, ultra realistic',
      farmhouse:  'modern farmhouse interior, shiplap walls, rustic wood beams, neutral linen, apron sink, ultra realistic',
      boho:       'eclectic bohemian interior, layered patterned rugs, macramé wall art, hanging plants, warm earth tones, ultra realistic',
      luxury:     'high-end luxury interior design, Calacatta marble surfaces, brushed gold accents, bespoke velvet furniture, dramatic chandelier, ultra realistic',
      japandi:    'japandi style interior, wabi-sabi aesthetic, muted greige palette, functional low furniture, zen minimal décor, ultra realistic',
      coastal:    'coastal beach house interior, white and denim blue palette, driftwood accents, linen drapes, natural light flooding in, ultra realistic',
    }

    const roomLabels: Record<string, string> = {
      'living-room': 'living room',
      'bedroom':     'bedroom',
      'kitchen':     'modern kitchen',
      'bathroom':    'bathroom',
      'home-office': 'home office',
      'exterior':    'house exterior elevation, façade',
      'garden':      'garden and outdoor space',
      'kids-room':   "children's bedroom",
    }

    const roomLabel  = roomLabels[roomType]  ?? roomType
    const stylePrompt = stylePrompts[style]   ?? style
    const prompt = `${stylePrompt}, ${roomLabel}, professional interior design photography, 8k, photorealistic, award-winning design magazine`

    let falUrl: string
    let falBody: Record<string, unknown>

    if (imageFile && imageFile.size > 0) {
      // img2img — redecorate the uploaded room
      const imgBytes = await imageFile.arrayBuffer()
      const imgB64   = Buffer.from(imgBytes).toString('base64')
      const mime     = imageFile.type || 'image/jpeg'

      falUrl  = 'https://fal.run/fal-ai/flux/dev/image-to-image'
      falBody = {
        prompt,
        image_url:        `data:${mime};base64,${imgB64}`,
        strength:         0.75,
        num_inference_steps: 28,
        guidance_scale:   3.5,
        num_images:       1,
      }
    } else {
      // text2img — generate from scratch
      falUrl  = 'https://fal.run/fal-ai/flux/schnell'
      falBody = {
        prompt,
        image_size:          'landscape_16_9',
        num_inference_steps: 4,
        num_images:          1,
        enable_safety_checker: false,
      }
    }

    const falRes = await fetch(falUrl, {
      method:  'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(falBody),
    })

    if (!falRes.ok) {
      const err = await falRes.text()
      console.error('fal.ai error:', err)
      return NextResponse.json({ error: 'Image generation failed', detail: err }, { status: 500 })
    }

    const data = await falRes.json()
    const imageUrl = data?.images?.[0]?.url ?? data?.image?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image in fal response', data }, { status: 500 })
    }

    return NextResponse.json({ imageUrl, prompt })
  } catch (e: unknown) {
    console.error('visualise route error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
