import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CircleUserRound, Clock3,
  Droplets, HeartPulse, LockKeyhole, Pill, Ruler, Scale, Stethoscope,
  Utensils, UtensilsCrossed,
} from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { screeningResult } from '../data/mockData'
import { api } from '../lib/api'

const initialForm = {
  lastMealAt: '', lastMeal: '', weight: '', height: '', bloodSugar: '', bloodPressure: '',
  diabetes: '', hypertension: '', kidneyDisease: '', pregnant: '', breastfeeding: '', medication: '', medicationDetails: '', notes: '',
}

const steps = [
  { title: 'Kondisi Makan Terakhir', subtitle: 'Ceritakan kapan dan apa yang terakhir Anda makan', icon: Utensils },
  { title: 'Data Fisik', subtitle: 'Masukkan data tubuh Anda saat ini', icon: Scale },
  { title: 'Riwayat Kesehatan', subtitle: 'Jawab dengan jujur untuk keamanan Anda', icon: HeartPulse },
  { title: 'Kondisi Khusus', subtitle: 'Beberapa kondisi membutuhkan perhatian tambahan', icon: CircleUserRound },
]

function Choice({ name, value, onChange }) {
  return (
    <div className="screening-choice-row">
      {['Ya', 'Tidak'].map((option) => (
        <button key={option} type="button" className={`screening-choice screening-choice-${option === 'Ya' ? 'risk' : 'safe'}${value === option ? ' selected' : ''}`} onClick={() => onChange(name, option)}>
          {option}
        </button>
      ))}
    </div>
  )
}

export default function Screening() {
  const router = useRouter()
  const navigate = (path) => router.push(path)
  const [step, setStep] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [freshResult, setFreshResult] = useState(false)
  const [form, setForm] = useState(initialForm)
<<<<<<< HEAD
  const [result, setResult] = useState(screeningResult)
  useEffect(() => {
    api<any>('/screenings/latest').then((saved) => {
      if (!saved) return
      setResult({ score: saved.score, status: saved.status, points_earned: saved.points_earned, breakdown: [
=======
  const [result, setResult] = useState<any>(screeningResult)
  useEffect(() => {
    api<any>('/screenings/latest').then((saved) => {
      if (!saved || saved.score >= 60 || !saved.retry_at || new Date() >= new Date(saved.retry_at)) return
      setResult({ ...saved, breakdown: [
>>>>>>> origin/Fama
        { label: 'Kesiapan Tubuh', value: saved.score }, { label: 'Hidrasi', value: saved.score },
        { label: 'Kondisi Mental', value: saved.score }, { label: 'Persiapan', value: saved.score },
      ] })
      setShowResult(true)
<<<<<<< HEAD
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])
  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }))
=======
    }).catch(() => {})
  }, [])
  const setField = (name, value) => setForm((current) => ({
    ...current,
    [name]: value,
    ...(name === 'medication' && value === 'Tidak' ? { medicationDetails: '' } : {}),
  }))
>>>>>>> origin/Fama
  const bmi = useMemo(() => {
    const heightInMeters = Number(form.height) / 100
    return form.weight && heightInMeters ? (Number(form.weight) / heightInMeters ** 2).toFixed(1) : null
  }, [form.height, form.weight])
  const valid = step === 1 ? form.lastMealAt && form.lastMeal.trim()
    : step === 2 ? form.weight && form.height
      : step === 3 ? form.diabetes && form.hypertension && form.kidneyDisease
        : form.pregnant && form.breastfeeding && form.medication && (form.medication !== 'Ya' || form.medicationDetails.trim())

  const next = async () => {
    if (!valid) return
    if (step === 4) {
      const saved = await api<any>('/screenings', { method: 'POST', body: JSON.stringify({ answers: form }) })
      setResult({ score: saved.score, status: saved.status, points_earned: saved.points_earned, retry_at: saved.retry_at, breakdown: [
        { label: 'Kesiapan Tubuh', value: saved.score }, { label: 'Hidrasi', value: saved.score },
        { label: 'Kondisi Mental', value: saved.score }, { label: 'Persiapan', value: saved.score },
      ] })
      setFreshResult(true)
      setShowResult(true)
    }
    else setStep((current) => current + 1)
  }

  if (loading) return <div className="auth-loading">Memuat hasil screening...</div>

  if (showResult) {
    const passed = result.score >= 60
    return (
      <div className="screening-page screening-result-page fade-in">
        <div className="page-header screening-page-header"><h1 className="page-title">Hasil Screening</h1><p className="page-subtitle">Berdasarkan jawaban Anda</p></div>
<<<<<<< HEAD
        <div className="screening-result-card"><div className="screening-check-icon"><Check size={28} strokeWidth={3} /></div><h2 className="screening-title">Anda Siap Memulai FF72!</h2><p className="screening-desc">Berdasarkan hasil screening, tubuh Anda dalam kondisi yang sesuai untuk menjalani program Fat Fasting 72 Jam.</p></div>
        <div className="indikator-card"><div className="indikator-header">INDIKATOR KESIAPAN</div><div className="indikator-body"><div className="indikator-circle"><CircularProgress size={100} strokeWidth={10} percentage={result.score} color="#71c700" trackColor="#e5ebf2"><div className="indikator-circle-inner"><div className="indikator-score">{result.score}</div><div className="indikator-score-sub">/ 100</div></div></CircularProgress></div><div className="indikator-list">{result.breakdown.map((item) => <div key={item.label} className="indikator-row"><div className="indikator-label-row"><span>{item.label}</span><strong>{item.value}%</strong></div><div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${item.value}%` }} /></div></div>)}</div></div></div>
        <div className="points-banner"><span className="points-confetti">🎉</span><div className="points-banner-text"><strong>{freshResult && result.points_earned > 0 ? `+${result.points_earned} Poin Didapat!` : 'Hasil Screening Tersimpan'}</strong><span>Hasil screening terakhir Anda tetap tersimpan.</span></div></div>
        <button className="screening-program-button" onClick={() => navigate('/program')}><CheckCircle2 size={17} /> Lanjut ke Program FF72 <ArrowRight size={17} /></button>
        <button className="screening-reset" onClick={() => { setForm(initialForm); setStep(1); setFreshResult(false); setShowResult(false) }}>Isi Ulang Screening</button>
=======
        <div className={`screening-result-card${passed ? '' : ' screening-result-failed'}`}><div className="screening-check-icon">{passed ? <Check size={28} strokeWidth={3} /> : <Stethoscope size={28} />}</div><h2 className="screening-title">{passed ? 'Anda Siap Memulai FF72!' : 'Screening Belum Lulus'}</h2><p className="screening-desc">{passed ? 'Berdasarkan hasil screening, tubuh Anda dalam kondisi yang sesuai untuk menjalani program Fat Fasting 72 Jam.' : 'Skor di bawah 60 belum memenuhi syarat Program FF72. Silakan istirahat dan lakukan screening ulang besok.'}</p></div>
        <div className="indikator-card"><div className="indikator-header">INDIKATOR KESIAPAN</div><div className="indikator-body"><div className="indikator-circle"><CircularProgress size={100} strokeWidth={10} percentage={result.score} color={passed ? '#71c700' : '#ef5361'} trackColor="#e5ebf2"><div className="indikator-circle-inner"><div className="indikator-score">{result.score}</div><div className="indikator-score-sub">/ 100</div></div></CircularProgress></div><div className="indikator-list">{result.breakdown.map((item) => <div key={item.label} className="indikator-row"><div className="indikator-label-row"><span>{item.label}</span><strong>{item.value}%</strong></div><div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${item.value}%` }} /></div></div>)}</div></div></div>
        <div className="points-banner"><span className="points-confetti">🎉</span><div className="points-banner-text"><strong>+{result.points_earned} Poin Didapat!</strong><span>Hasil screening sudah disimpan ke database.</span></div></div>
        {passed ? <button className="screening-program-button" onClick={() => navigate('/program')}><CheckCircle2 size={17} /> Lanjut ke Program FF72 <ArrowRight size={17} /></button> : <div className="screening-retry-notice"><Clock3 size={17} /> Screening ulang tersedia besok.</div>}
        {passed && <button className="screening-reset" onClick={() => { setForm(initialForm); setStep(1); setShowResult(false) }}>Isi ulang screening</button>}
>>>>>>> origin/Fama
      </div>
    )
  }

  const CurrentIcon = steps[step - 1].icon
  return (
    <div className="screening-page fade-in">
      <div className="page-header screening-page-header"><h1 className="page-title">Screening Kesehatan</h1><p className="page-subtitle">Wajib diisi sebelum memulai Program FF72</p></div>
      <div className="screening-progress-copy"><span>Langkah {step} dari 4</span><strong>{step * 25}% selesai</strong></div>
      <div className="screening-progress"><span style={{ width: `${step * 25}%` }} /></div>
      <div className="screening-dots">{[1, 2, 3, 4].map((item) => <i key={item} className={item < step ? 'done' : item === step ? 'active' : ''} />)}</div>

      <section className="screening-form-card">
        <header><span className="screening-step-icon"><CurrentIcon size={21} /></span><div><h2>{steps[step - 1].title}</h2><p>{steps[step - 1].subtitle}</p></div></header>
        <div className="screening-fields">
          {step === 1 && <><label><span><Clock3 /> Kapan terakhir makan?</span><input type="datetime-local" value={form.lastMealAt} onChange={(e) => setField('lastMealAt', e.target.value)} /></label><label><span><UtensilsCrossed /> Makanan terakhir yang dikonsumsi?</span><input type="text" placeholder="Contoh: Nasi putih, ayam goreng, sayur" value={form.lastMeal} onChange={(e) => setField('lastMeal', e.target.value)} /></label></>}
          {step === 2 && <><div className="screening-two-columns"><label><span><Scale /> Berat Badan (kg)</span><input type="number" min="1" placeholder="48" value={form.weight} onChange={(e) => setField('weight', e.target.value)} /></label><label><span><Ruler /> Tinggi Badan (cm)</span><input type="number" min="1" placeholder="160" value={form.height} onChange={(e) => setField('height', e.target.value)} /></label></div>{bmi && <div className="screening-bmi">BMI Anda: <strong>{bmi}</strong></div>}<label><span><Droplets /> Gula Darah Terakhir (mg/dL)</span><input type="number" min="0" placeholder="100 (opsional)" value={form.bloodSugar} onChange={(e) => setField('bloodSugar', e.target.value)} /></label><label><span><HeartPulse /> Tekanan Darah (opsional)</span><input type="text" placeholder="Contoh: 120/80" value={form.bloodPressure} onChange={(e) => setField('bloodPressure', e.target.value)} /></label></>}
          {step === 3 && <>{[['diabetes', 'Apakah Anda memiliki Diabetes?'], ['hypertension', 'Apakah Anda memiliki Hipertensi?'], ['kidneyDisease', 'Apakah Anda memiliki Penyakit Ginjal?']].map(([name, label]) => <label key={name}><span><HeartPulse /> {label}</span><Choice name={name} value={form[name]} onChange={setField} /></label>)}</>}
          {step === 4 && <>{([
            ['pregnant', 'Apakah sedang hamil?', CircleUserRound],
            ['breastfeeding', 'Apakah sedang menyusui?', CircleUserRound],
            ['medication', 'Apakah sedang mengonsumsi obat?', Pill],
          ] as const).map(([name, label, Icon]) => <label key={name}><span><Icon /> {label}</span><Choice name={name} value={form[name]} onChange={setField} /></label>)}{form.medication === 'Ya' && <label><span><Pill /> Sebutkan obat yang dikonsumsi</span><input type="text" required placeholder="Contoh: Metformin 500mg" value={form.medicationDetails} onChange={(e) => setField('medicationDetails', e.target.value)} /></label>}<label><span><Stethoscope /> Riwayat penyakit lainnya (opsional)</span><textarea placeholder="Ceritakan kondisi kesehatan lain yang relevan..." value={form.notes} onChange={(e) => setField('notes', e.target.value)} /></label></>}
        </div>
      </section>
      <div className={`screening-actions ${step === 1 ? 'single' : ''}`}>{step > 1 && <button className="screening-back" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Kembali</button>}<button className={step === 4 ? 'screening-finish' : 'screening-next'} disabled={!valid} onClick={next}>{step === 4 ? 'Lihat Hasil Screening' : 'Lanjutkan'} {step === 4 ? <CheckCircle2 size={17} /> : <ArrowRight size={17} />}</button></div>
      <p className="screening-privacy"><LockKeyhole size={12} /> Data kesehatan Anda bersifat rahasia dan hanya digunakan untuk menentukan kesiapan program.</p>
    </div>
  )
}
