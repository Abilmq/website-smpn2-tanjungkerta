import PageHeader from '@/components/ui/PageHeader'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { fetchInfoKontak } from '@/app/actions/kontak.actions'
import ContactForm from './ContactForm'

export default async function KontakPage() {
  const infoKontak = await fetchInfoKontak()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <PageHeader 
        title="Hubungi Kami" 
        description="Punya pertanyaan seputar kurikulum, pendaftaran, atau kerjasama? Jangan ragu untuk menghubungi atau mengunjungi gedung kami secara langsung."
        crumbs={[
          { label: 'Kontak' }
        ]} 
      />

      <section className="py-24 px-4 md:px-6 container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Kolom Informasi Kontak Dasar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 border border-brand-100">
                <MapPin className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Alamat Lengkap</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {infoKontak?.alamat || 'Boros, Desa Tanjungkerta,\nKecamatan Tanjungkerta, Kabupaten Sumedang,\nJawa Barat 45354'}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center shrink-0 border border-accent-200">
                <Phone className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Telepon Resmi</h3>
                <p className="text-slate-600 font-medium">{infoKontak?.telepon || '(0261) 201121'}</p>
                <div className="text-slate-500 text-sm mt-3 pt-3 border-t border-slate-100 flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{infoKontak?.jam_operasional || 'Jam operasional: 07:00 - 15:00'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-alert-50 rounded-xl flex items-center justify-center shrink-0 border border-alert-200">
                <Mail className="w-6 h-6 text-alert-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Surat Elektronik (Email)</h3>
                <a 
                  href={`mailto:${infoKontak?.email || 'smpn2tanjungkerta@gmail.com'}`}
                  className="text-brand-600 font-bold hover:underline break-all"
                >
                  {infoKontak?.email || 'smpn2tanjungkerta@gmail.com'}
                </a>
                <p className="text-slate-500 text-sm mt-1">Merespon dalam 1-2 hari kerja.</p>
              </div>
            </div>

            </div>

          {/* Kolom Peta & Form Kirim Pesan */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Peta Asli Google Maps */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[450px] relative">
              <iframe 
                src={infoKontak?.embed_maps || "https://maps.google.com/maps?q=SMP%20Negeri%202%20Tanjungkerta%20Sumedang&t=&z=17&ie=UTF8&iwloc=&output=embed"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Form Pesan Baru */}
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  )
}
