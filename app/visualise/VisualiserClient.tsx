'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, Sparkles, ArrowRight, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { DESIGN_STYLES, ROOM_TYPES } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'

type Stage = 'pick-room' | 'pick-style' | 'upload' | 'generating' | 'result'

export default function VisualiserClient() {
  const [stage,       setStage]       = useState<Stage>('pick-room')
  const [roomType,    setRoomType]    = useState('')
  const [style,       setStyle]       = useState('')
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const [uploadFile,  setUploadFile]  = useState<File | null>(null)
  const [resultUrl,   setResultUrl]   = useState<string | null>(null)
  const [error,       setError]       = useState<string | null>(null)
  const [sliderPos,   setSliderPos]   = useState(50)  // before/after slider
  const [dragging,    setDragging]    = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadFile(f)
    const url = URL.createObjectURL(f)
    setUploadedImg(url)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setUploadFile(f)
    setUploadedImg(URL.createObjectURL(f))
  }

  async function generate() {
    setStage('generating')
    setError(null)
    try {
      const fd = new FormData()
      fd.append('roomType', roomType)
      fd.append('style',    style)
      if (uploadFile) fd.append('image', uploadFile)

      const res = await fetch('/api/visualise', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setResultUrl(data.imageUrl)
      setStage('result')
    } catch (e: unknown) {
      setError(String(e))
      setStage('upload')
    }
  }

  function reset() {
    setStage('pick-room')
    setRoomType('')
    setStyle('')
    setUploadedImg(null)
    setUploadFile(null)
    setResultUrl(null)
    setError(null)
    setSliderPos(50)
  }

  // before/after slider drag
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const pct  = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }, [dragging])

  const selectedStyle = DESIGN_STYLES.find(s => s.id === style)
  const selectedRoom  = ROOM_TYPES.find(r => r.id === roomType)

  return (
    <div className="min-h-screen px-4 py-16 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="pill-glass mb-4 mx-auto w-fit">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          AI Room Visualiser
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${theme.gradientText}`}>
          Redesign any room in seconds
        </h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Choose a room type and style. Upload a photo to transform your existing space — or generate from scratch.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 mb-10 text-xs">
        {['Room', 'Style', 'Upload', 'Generate'].map((label, i) => {
          const stages: Stage[] = ['pick-room', 'pick-style', 'upload', 'generating']
          const active = stages.indexOf(stage) >= i || stage === 'result'
          return (
            <div key={label} className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                active ? `${theme.solid} text-white` : 'bg-white/5 text-white/30'
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  active ? 'bg-white/20' : 'bg-white/5'
                }`}>{i + 1}</span>
                {label}
              </span>
              {i < 3 && <ChevronRight className="w-3 h-3 text-white/20" />}
            </div>
          )
        })}
      </div>

      {/* ── Stage: Pick Room ─────────────────────────────── */}
      {stage === 'pick-room' && (
        <div>
          <h2 className="text-white/70 text-sm font-medium mb-4 text-center">What room are we redesigning?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ROOM_TYPES.map(r => (
              <button
                key={r.id}
                onClick={() => { setRoomType(r.id); setStage('pick-style') }}
                className={`${theme.card} rounded-xl p-5 flex flex-col items-center gap-2 hover:scale-105 transition-all ${theme.cardHover} text-center`}
              >
                <span className="text-3xl">{r.icon}</span>
                <span className="text-white/80 text-sm font-medium">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage: Pick Style ────────────────────────────── */}
      {stage === 'pick-style' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStage('pick-room')} className="text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white/70 text-sm font-medium">Choose a design style for your {selectedRoom?.label}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DESIGN_STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => { setStyle(s.id); setStage('upload') }}
                className={`${theme.card} rounded-xl p-5 flex flex-col items-center gap-2 hover:scale-105 transition-all ${theme.cardHover} text-center`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-white/80 text-sm font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stage: Upload ────────────────────────────────── */}
      {stage === 'upload' && (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStage('pick-style')} className="text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white/70 text-sm font-medium">
              {selectedRoom?.icon} {selectedRoom?.label} → {selectedStyle?.emoji} {selectedStyle?.label}
            </h2>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`${theme.card} border-2 border-dashed border-white/10 hover:border-white/25 rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all group`}
          >
            {uploadedImg ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image src={uploadedImg} alt="Uploaded room" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Click to change</span>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-2xl ${theme.solid} bg-opacity-10 flex items-center justify-center`}>
                  <Upload className="w-6 h-6 text-white/60" />
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm font-medium">Drop your room photo here</p>
                  <p className="text-white/35 text-xs mt-1">or click to browse · JPG, PNG, WEBP</p>
                </div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <p className="text-white/30 text-xs text-center mt-3">
            No photo? We&apos;ll generate a {selectedStyle?.label} {selectedRoom?.label} from scratch.
          </p>

          {error && (
            <div className="mt-4 text-red-400/80 text-sm bg-red-500/10 rounded-xl p-3 text-center">{error}</div>
          )}

          <button
            onClick={generate}
            className={`${btn.primary} w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl text-base font-semibold`}
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Design
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Stage: Generating ────────────────────────────── */}
      {stage === 'generating' && (
        <div className="flex flex-col items-center gap-6 py-20">
          <div className={`w-20 h-20 rounded-3xl ${theme.card} flex items-center justify-center relative`}>
            <Sparkles className={`w-8 h-8 ${theme.textAccent} animate-pulse`} />
            <div className={`absolute inset-0 rounded-3xl border-2 ${theme.border} animate-ping opacity-20`} />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Creating your {selectedStyle?.label} {selectedRoom?.label}…</p>
            <p className="text-white/40 text-sm mt-1">AI is rendering your redesign</p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0,1,2,3,4].map(i => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${theme.solid} opacity-60 animate-bounce`}
                   style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Stage: Result ────────────────────────────────── */}
      {stage === 'result' && resultUrl && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">
              {selectedStyle?.emoji} {selectedStyle?.label} {selectedRoom?.label}
            </h2>
            <div className="flex gap-2">
              <a
                href={resultUrl}
                download="homecanvas-design.jpg"
                className={`${btn.secondary} text-xs px-3 py-2 rounded-lg flex items-center gap-1.5`}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <button
                onClick={reset}
                className={`${btn.secondary} text-xs px-3 py-2 rounded-lg flex items-center gap-1.5`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New design
              </button>
            </div>
          </div>

          {/* Before/After slider (if original uploaded) */}
          {uploadedImg ? (
            <div
              ref={sliderRef}
              className="relative aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              onMouseMove={onMouseMove}
            >
              {/* After (AI result) */}
              <Image src={resultUrl} alt="AI redesign" fill className="object-cover" />
              {/* Before (original) clipped */}
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                <Image src={uploadedImg} alt="Original room" fill className="object-cover" />
              </div>
              {/* Divider */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <ChevronLeft className="w-3 h-3 text-black" />
                    <ChevronRight className="w-3 h-3 text-black" />
                  </div>
                </div>
              </div>
              {/* Labels */}
              <span className="absolute top-3 left-3 text-xs font-medium bg-black/50 text-white px-2 py-0.5 rounded-full">Before</span>
              <span className="absolute top-3 right-3 text-xs font-medium bg-black/50 text-white px-2 py-0.5 rounded-full">After</span>
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image src={resultUrl} alt="AI redesign" fill className="object-cover" />
            </div>
          )}

          {/* CTA — book a real designer */}
          <div className={`${theme.card} rounded-2xl p-6 mt-6 flex flex-col sm:flex-row items-center gap-4`}>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-semibold">Love the look? Bring it to life.</p>
              <p className="text-white/50 text-sm mt-1">Match with a local designer who specialises in {selectedStyle?.label} interiors.</p>
            </div>
            <a
              href="/chat"
              className={`${btn.primary} px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap`}
            >
              Find a Designer
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Try other styles */}
          <div className="mt-6">
            <p className="text-white/40 text-xs text-center mb-3">Try another style</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DESIGN_STYLES.filter(s => s.id !== style).map(s => (
                <button
                  key={s.id}
                  onClick={() => { setStyle(s.id); generate() }}
                  className={`${theme.card} text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white/90 flex items-center gap-1.5`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
