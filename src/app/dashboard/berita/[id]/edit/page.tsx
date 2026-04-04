import { fetchBeritaById } from '@/app/actions/berita.actions'
import { notFound } from 'next/navigation'
import EditBeritaForm from './EditBeritaForm'

interface EditBeritaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBeritaPage({ params }: EditBeritaPageProps) {
  const { id } = await params

  let berita
  try {
    berita = await fetchBeritaById(id)
  } catch {
    notFound()
  }

  return <EditBeritaForm berita={berita} />
}
