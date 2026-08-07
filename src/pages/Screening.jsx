import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import CircularProgress from '../components/CircularProgress'
import { screeningResult } from '../data/mockData'

export default function Screening() {
  const navigate = useNavigate()

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Screening Kesehatan</h1>
        <p className="page-subtitle">Hasil screening terakhir Anda</p>
      </div>

      {/* Result Card */}
      <div className="screening-result-card fade-in fade-in-delay-1">
        <div className="screening-check-icon">
          <Check size={28} color="white" strokeWidth={3} />
        </div>
        <h2 className="screening-title">Anda Siap Memulai FF72!</h2>
        <p className="screening-desc">
          Berdasarkan hasil screening, tubuh Anda dalam kondisi{' '}
          <strong>yang sesuai</strong> untuk menjalani program Fat Fasting 72 Jam.
        </p>
      </div>

      {/* Indikator Kesiapan */}
      <div className="indikator-card fade-in fade-in-delay-2">
        <div className="indikator-header">INDIKATOR KESIAPAN</div>
        <div className="indikator-body">
          {/* Circle Score */}
          <div className="indikator-circle">
            <CircularProgress
              size={100}
              strokeWidth={10}
              percentage={screeningResult.score}
              color="#7DC242"
              trackColor="#F0F3F8"
            >
              <div className="indikator-circle-inner">
                <div className="indikator-score">{screeningResult.score}</div>
                <div className="indikator-score-sub">/ 100</div>
              </div>
            </CircularProgress>
          </div>

          {/* Progress Bars */}
          <div className="indikator-list">
            {screeningResult.breakdown.map((item) => (
              <div key={item.label} className="indikator-row">
                <div className="indikator-label-row">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points Banner */}
      <div className="points-banner fade-in fade-in-delay-3">
        <span style={{ fontSize: 28 }}>🎉</span>
        <div className="points-banner-text">
          <strong>+{screeningResult.points_earned} Poin Didapat!</strong>
          <span>Terima kasih telah menyelesaikan screening kesehatan.</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="fade-in fade-in-delay-4" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          className="btn btn-primary btn-full"
          style={{ padding: '14px 24px', fontSize: 15 }}
          onClick={() => navigate('/program')}
        >
          🎯 Lanjut ke Program FF72
        </button>
        <button
          className="btn btn-outline btn-full"
          style={{ padding: '12px 24px' }}
        >
          Isi ulang screening
        </button>
      </div>
    </div>
  )
}
