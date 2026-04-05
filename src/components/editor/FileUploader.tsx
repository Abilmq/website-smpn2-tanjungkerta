'use client'

import { useState, useRef, useTransition } from 'react'
import { FileText, Image as ImageIcon, X, Upload, Loader2, ExternalLink } from 'lucide-react'
import { uploadImage, deleteImageFile } from '@/app/actions/berita.actions'

interface FileUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  folder?: string
  // 'image' = hanya gambar, 'pdf' = hanya PDF, 'both' = keduanya
  accept?: 'image' | 'pdf' | 'both'
}

const ACCEPT_MAP = {
  image: 'image/*',
  pdf: 'application/pdf',
  both: 'image/*,application/pdf',
}

const ACCEPT_LABEL = {
  image: 'JPG, PNG, WebP — Maks 5MB',
  pdf: 'PDF — Maks 10MB',
  both: 'JPG, PNG, WebP, PDF — Maks 10MB',
}

function isPdf(url: string) {
  return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf')
}

export default function FileUploader({
  value,
  onChange,
  label = 'File',
  folder = 'media',
  accept = 'both',
}: FileUploaderProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isPdfFile = file.type === 'application/pdf'

    // Validasi berdasarkan mode accept
    if (accept === 'image' && !isImage) {
      setError('File harus berupa gambar (JPG, PNG, WebP)')
      return
    }
    if (accept === 'pdf' && !isPdfFile) {
      setError('File harus berupa PDF')
      return
    }
    if (accept === 'both' && !isImage && !isPdfFile) {
      setError('File harus berupa gambar (JPG, PNG, WebP) atau PDF')
      return
    }

    // Validasi ukuran
    const maxSize = isPdfFile ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`Ukuran file maksimal ${isPdfFile ? '10MB' : '5MB'}`)
      return
    }

    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    startTransition(async () => {
      // Reuse uploadImage action karena logic sama (upload ke storage bucket 'media')
      const result = await uploadImage(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.url) {
        // Hapus file lama jika ada
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

  const handleRemove = () => {
    if (value) {
      deleteImageFile(value).catch(console.error)
    }
    onChange('')
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}

      {value ? (
        // Preview setelah file diupload
        isPdf(value) ? (
          // Preview PDF
          <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">File PDF Terupload</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-0.5"
              >
                <ExternalLink className="w-3 h-3" />
                Buka / Preview PDF
              </a>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-brand-400 hover:text-brand-600 transition-colors"
                title="Ganti file"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-white border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                title="Hapus file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Preview Gambar
          <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
            <img
              src={value}
              alt="Preview"
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
                onClick={handleRemove}
                className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        )
      ) : (
        // Drop Zone
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
              <p className="text-sm text-slate-500">Mengupload file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                {accept === 'pdf' ? (
                  <FileText className="w-6 h-6 text-slate-400" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Klik atau drag &amp; drop file
                </p>
                <p className="text-xs text-slate-400 mt-1">{ACCEPT_LABEL[accept]}</p>
              </div>
              {accept === 'both' && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full">Gambar</span>
                  <span className="text-slate-300">atau</span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-400 rounded-full">PDF</span>
                </div>
              )}
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
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          // Reset input agar bisa upload file yang sama lagi
          e.target.value = ''
        }}
      />
    </div>
  )
}
