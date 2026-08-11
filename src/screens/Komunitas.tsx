import {
  ArrowUpRight,
  BarChart3,
  Heart,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/EoG7bCqdQoU2InrXHORFze'

const benefits = [
  {
    icon: MessageCircle,
    title: 'Diskusi & Tanya Jawab',
    description: 'Tanya langsung ke sesama member dan mentor berpengalaman.',
    color: 'purple',
  },
  {
    icon: BarChart3,
    title: 'Update Program',
    description: 'Dapatkan informasi, tips, dan materi FF72 terbaru.',
    color: 'pink',
  },
  {
    icon: TrendingUp,
    title: 'Motivasi & Dukungan',
    description: 'Saling mendukung agar tetap konsisten mencapai target.',
    color: 'green',
  },
]

const qrPattern = [
  '111111101011101111111',
  '100000101110101000001',
  '101110100010101011101',
  '101110101101101011101',
  '101110100111101011101',
  '100000101010101000001',
  '111111101010101111111',
  '000000001101100000000',
  '101011111001011101101',
  '011100001111100010010',
  '110111101001011110111',
  '001001010110110101000',
  '111010111011101011101',
  '000000001101001010100',
  '111111101011111110111',
  '100000101110001010000',
  '101110101011111011101',
  '101110100100101001100',
  '101110101111111101111',
  '100000101001000100010',
  '111111101110111101101',
]

function CommunityQr() {
  return (
    <div className="community-qr" aria-label="QR code komunitas WhatsApp">
      {qrPattern.join('').split('').map((cell, index) => (
        <span key={index} className={cell === '1' ? 'filled' : ''} />
      ))}
    </div>
  )
}

export default function Komunitas() {
  return (
    <div className="community-page fade-in">
      <div className="page-header community-header">
        <h1 className="page-title">Komunitas</h1>
        <p className="page-subtitle">Bergabung bersama ribuan member JaxLab</p>
      </div>

      <section className="community-hero">
        <div className="community-orb" />
        <div className="community-brand">
          <div className="community-brand-icon"><MessageCircle size={25} /></div>
          <div>
            <h2>GreenZone Academy</h2>
            <p>WhatsApp Group · FF72 Indonesia</p>
          </div>
        </div>

        <p className="community-description">
          Gabung komunitas FF72 terbesar di Indonesia. Ribuan member aktif siap mendukung perjalanan fat fasting Anda!
        </p>

        <div className="community-stats">
          <div><Users /><strong>1.000+</strong><span>Member Aktif</span></div>
          <div><Star /><strong>5.0 ★</strong><span>Rating</span></div>
          <div><ShieldCheck /><strong>Official</strong><span>Terverifikasi</span></div>
        </div>

        <a className="community-join-button" href={WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          <span>Gabung WhatsApp Sekarang</span>
          <ArrowUpRight size={17} />
        </a>
      </section>

      <section className="community-panel qr-panel">
        <div className="community-panel-title"><QrCode /> <span>SCAN QR CODE</span></div>
        <div className="qr-frame">
          <div className="qr-poster">
            <p>GreenZone Academy Indonesia</p>
            <CommunityQr />
            <small>Scan untuk bergabung</small>
          </div>
        </div>
        <h3>GreenZone Academy Indonesia</h3>
        <p>Scan menggunakan kamera WhatsApp untuk bergabung</p>
      </section>

      <section className="community-panel benefits-panel">
        <div className="community-panel-title benefits-title"><Heart /> <span>MANFAAT BERGABUNG</span></div>
        <div className="community-benefits">
          {benefits.map(({ icon: Icon, title, description, color }) => (
            <div className="community-benefit" key={title}>
              <div className={`benefit-icon ${color}`}><Icon /></div>
              <div><h3>{title}</h3><p>{description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <a
        className="community-link-button"
        href={WHATSAPP_COMMUNITY_URL}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} />
        <span>Buka Link Grup WhatsApp</span>
      </a>
    </div>
  )
}
