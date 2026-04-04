'use client'

import { useState, useRef, useTransition } from 'react'
import { Image as ImageIcon, X, Upload, Loader2 } from 'lucide-react'
import { uploadImage, deleteImageFile } from '@/app/actions/berita.actions'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  folder?: string
}

export default function ImageUploader({ value, onChange, label = 'Thumbnail', folder = 'media' }: ImageUploaderProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    if (folder) {
      formData.append('folder', folder)
    }

    startTransition(async () => {
      const result = await uploadImage(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.url) {
        // Hapus file lama di bucket jika sebelumnya ada gambar
        if (value) {
          deleteImageFile(value).catch(console.error)
        }
        onChange(result.url)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      {value ? (
        // Preview gambar yang sudah diupload
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img
            src={value}
            alt="Thumbnail preview"
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Ganti
            </button>
            <button
              type="button"
              onClick={() => {
                if (value) {
                  deleteImageFile(value).catch(console.error)
                }
                onChange('')
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        // Drop zone upload
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-brand-400 bg-brand-50'
              : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
          }`}
        >
          {isPending ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm text-slate-500">Mengupload gambar...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Klik atau drag & drop gambar
                </p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP — Maks 5MB — Rekomendasi 16:9</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
