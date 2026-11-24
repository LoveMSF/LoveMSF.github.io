import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Github, Globe2, Laptop2, Moon, Sun, Music2, TrainFront, Smartphone, Code2, Download, MapPin, Menu } from 'lucide-react'

type Repo = { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean }
type Profile = { login: string; name: string | null; bio: string | null; avatar_url: string; followers: number; public_repos: number; html_url: string; location: string | null }

const fallbackProfile: Profile = { login: 'LoveMSF', name: 'Artem', bio: 'Independent developer building thoughtful desktop, mobile, and web experiences. Interested in Japanese design, useful software, and the details between.', avatar_url: 'https://github.com/LoveMSF.png', followers: 0, public_repos: 0, html_url: 'https://github.com/LoveMSF', location: 'Tokyo, JP' }
const featured = [
  { name: 'GlyphIsland', number: '01', description: 'A cross-platform Nothing OS inspired desktop overlay. Bring expressive glyph-style controls to Windows and Linux.', tags: ['Desktop', 'Electron', 'Windows · Linux'], url: 'https://github.com/LoveMSF/glyph-island', icon: Laptop2, downloads: [{ label: '.EXE', url: 'https://github.com/LoveMSF/glyph-island/releases/latest' }, { label: '.APPIMAGE', url: 'https://github.com/LoveMSF/glyph-island/releases/latest' }] },
  { name: 'WalkmanBox', number: '02', description: 'An offline-first music player for Android and the web, with unlimited IndexedDB storage and a dot-matrix visualizer.', tags: ['Android', 'Capacitor', 'IndexedDB'], url: 'https://github.com/LoveMSF/walkman-box', icon: Music2, downloads: [{ label: '.APK', url: 'https://github.com/LoveMSF/walkman-box/releases/latest' }] },
  { name: 'Tokyo Transit Tracker', number: '03', description: 'Explore Tokyo railways and metro lines in real time through an interactive map and transit simulator.', tags: ['Maps', 'Transit', 'Web'], url: 'https://github.com/LoveMSF/tokyo-transit-tracker', icon: TrainFront },
  { name: 'iOS 9-ish Simulator', number: '04', description: 'An experimental playground for the tactile surfaces and familiar details of a retro mobile interface.', tags: ['UI experiment', 'Web', 'Retro'], url: 'https://github.com/LoveMSF/ios9-ish-simulator', icon: Smartphone },
  { name: 'Koji — Japanese Language School', number: '05', description: 'A quiet, minimalist landing page shaped by the Japanese idea of Yohaku: the beauty of meaningful empty space.', tags: ['Design', 'Web', 'Yohaku'], url: 'https://github.com/LoveMSF/Koji-JapSchool', icon: Globe2 },
]
const stack = ['React', 'TypeScript', 'Electron', 'Capacitor', 'Tailwind CSS', 'Vite', 'Git', 'Arch Linux']
const clockFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

function App() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [repos, setRepos] = useState<Repo[]>([])
  const [clock, setClock] = useState(() => clockFormatter.format(new Date()))
  const [light, setLight] = useState(() => localStorage.getItem('lovemsf-theme') === 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [apiStatus, setApiStatus] = useState<'loading' | 'live' | 'fallback'>('loading')

  useEffect(() => {
    const timer = window.setInterval(() => setClock(clockFormatter.format(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => { localStorage.setItem('lovemsf-theme', light ? 'light' : 'dark') }, [light])
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          fetch('https://api.github.com/users/LoveMSF', { signal: controller.signal }),
          fetch('https://api.github.com/users/LoveMSF/repos?sort=updated&per_page=100', { signal: controller.signal }),
        ])
        if (!p.ok || !r.ok) throw new Error('GitHub API unavailable')
        const [profileData, repoData] = await Promise.all([p.json() as Promise<Profile>, r.json() as Promise<Repo[]>])
        setProfile(profileData)
        setRepos(repoData.filter(repo => !repo.fork))
        setApiStatus('live')
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setApiStatus('fallback')
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const extraRepos = useMemo(() => {
    const featuredNames = new Set(['glyph-island', 'walkman-box', 'tokyo-transit-tracker', 'ios9-ish-simulator', 'koji-japschool'])
    return repos.filter(repo => !featuredNames.has(repo.name.toLowerCase())).slice(0, 8)
  }, [repos])

  return <main className={light ? 'site light' : 'site'}>
    <div className="shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="LoveMSF home"><span className="logo-glyph">L<span className="red">·</span></span><span>LOVEMSF<span className="wordmark-sub"> / INDEPENDENT DEVELOPER</span></span></a>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation"><a href="#work" onClick={() => setMenuOpen(false)}>WORK</a><a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a><a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a></nav>
        <div className="top-actions"><span className="edition">PORTFOLIO — 2025/26</span><button className="theme-toggle" aria-label={light ? 'Switch to Nothing Dark Mode' : 'Switch to Nothing Light Mode'} onClick={() => setLight(v => !v)}>{light ? <Moon size={15} /> : <Sun size={15} />}<span>{light ? 'DARK' : 'LIGHT'}</span></button><button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(v => !v)}><Menu size={19} /></button></div>
      </header>

      <section id="home" className="hero grid-layout">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
          <div className="eyebrow"><span className="live-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-index">[ 01 — 05 ]</span></div>
          <h1>Making digital<br />feel <span className="outline-word">human.</span></h1>
          <p className="hero-intro">I’m <strong>Artem</strong>, an independent developer creating considered software for the desktop, the pocket, and the open web.</p>
          <div className="hero-links"><a className="button button-red" href="#work">EXPLORE SELECTED WORK <ArrowDownRight size={16} /></a><a className="text-link" href={profile.html_url} target="_blank" rel="noreferrer">GITHUB PROFILE <ArrowUpRight size={14} /></a></div>
        </motion.div>
        <motion.aside className="profile-card card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .55 }}>
          <div className="card-top"><span className="micro-label">DEVELOPER PROFILE</span><span className="profile-online"><i /> {apiStatus === 'live' ? 'LIVE DATA' : 'PROFILE'}</span></div>
          <div className="profile-main"><img className="avatar" src={profile.avatar_url} alt="Artem's GitHub avatar" /><div><h2>{profile.name || 'Artem'}</h2><p>@{profile.login}</p></div><a className="icon-button" href={profile.html_url} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><Github size={17} /></a></div>
          <p className="profile-bio">{profile.bio || fallbackProfile.bio}</p>
          <div className="profile-foot"><span><b>{profile.followers}</b> FOLLOWERS</span><span><b>{profile.public_repos}</b> PUBLIC REPOS</span><span className="location"><MapPin size={12} /> TOKYO, JP</span></div>
        </motion.aside>
        <div className="hero-bottom"><span className="scroll-hint"><span className="scroll-line" /> SCROLL TO EXPLORE</span><span className="coordinates">35°40′N&nbsp; 139°45′E</span><span className="clock"><span className="live-dot" /> TOKYO / JST <b>{clock}</b></span></div>
      </section>

      <section id="work" className="section-block">
        <div className="section-heading"><div><span className="section-kicker">01 / SELECTED WORK</span><h2>Built with <span>intention.</span></h2></div><p>A collection of small ideas and useful tools,<br className="desktop-break" /> made for the things I care about.</p></div>
        <div className="projects-grid">
          {featured.map((project, index) => <motion.article className={`project-card card project-${index + 1}`} key={project.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .4, delay: index * .055 }}>
            <div className="project-top"><span className="micro-label">PROJECT / {project.number}</span><project.icon className="project-icon" size={18} strokeWidth={1.5} /></div>
            <div className="project-art" aria-hidden="true"><div className={`art-mark art-${index + 1}`}>{index === 0 ? <><span className="glyph-core">N</span><i /><i /><i /><i /></> : index === 1 ? <><span className="disc" /><span className="disc-center" /><span className="sound-bars">▂ ▄ ▆ ▃ ▇ ▄ ▂</span></> : index === 2 ? <><div className="route-line" /><span className="station s1" /><span className="station s2" /><span className="station s3" /><span className="map-label">TOKYO / 35°41′N</span></> : index === 3 ? <><div className="phone-frame"><div className="phone-notch" /><span>9:41</span><div className="phone-shape" /><i /><i /><i /></div></> : <><span className="koji-kanji">余白</span><span className="koji-caption">a little room to breathe</span></>}</div><span className="art-index">{project.number}</span></div>
            <div className="project-content"><h3>{project.name}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div>
            <div className="project-footer"><a href={project.url} target="_blank" rel="noreferrer" className="repo-link"><Github size={14} /> VIEW REPOSITORY <ArrowUpRight size={13} /></a>{project.downloads && <div className="download-row">{project.downloads.map(file => <a className="download-link" key={file.label} href={file.url} target="_blank" rel="noreferrer"><Download size={12} /> {file.label}</a>)}</div>}</div>
          </motion.article>)}
        </div>
      </section>

      <section id="about" className="about-grid">
        <article className="card stack-card"><div className="card-top"><span className="section-kicker">02 / TOOLKIT</span><Code2 size={17} /></div><h2>Tools of<br />the <span>trade.</span></h2><p className="card-copy">A practical stack for building across screens and platforms.</p><div className="stack-list">{stack.map((item, index) => <span className="stack-item" key={item}><i>{String(index + 1).padStart(2, '0')}</i>{item}</span>)}</div></article>
        <article className="card focus-card"><div className="card-top"><span className="section-kicker">03 / CURRENTLY</span><span className="focus-live"><i /> IN PROGRESS</span></div><h2>Curiosity<br />in <span>motion.</span></h2><div className="focus-item"><span className="focus-icon"><Laptop2 size={17} /></span><div><h3>Desktop & mobile UI</h3><p>Thoughtful interfaces that feel at home on every screen.</p></div><span className="focus-arrow">↗</span></div><div className="focus-item"><span className="focus-icon japanese">あ</span><div><h3>Japanese language</h3><p>Studying toward JLPT N4+ — one character at a time.</p></div><span className="focus-arrow">↗</span></div><div className="study-meter"><div><span>STUDY LOG / 2025—26</span><span>JLPT N4+</span></div><div className="meter-track"><i /></div></div></article>
        <article className="card numbers-card"><span className="section-kicker">04 / GITHUB TELEMETRY</span><div className="numbers"><div><strong>{profile.public_repos.toString().padStart(2, '0')}</strong><span>PUBLIC REPOS</span></div><span className="numbers-divider" /><div><strong>{profile.followers.toString().padStart(2, '0')}</strong><span>FOLLOWERS</span></div></div><div className="numbers-foot"><span><span className="live-dot" /> {apiStatus === 'live' ? 'SYNCED WITH GITHUB' : 'STATIC FALLBACK ACTIVE'}</span><a href={profile.html_url} target="_blank" rel="noreferrer">SOURCE <ArrowUpRight size={12} /></a></div></article>
      </section>

      {extraRepos.length > 0 && <section className="section-block more-section"><div className="section-heading compact"><div><span className="section-kicker">05 / OPEN SOURCE</span><h2>More <span>repositories.</span></h2></div><span className="repo-count">{extraRepos.length.toString().padStart(2, '0')} SHOWN / {repos.length.toString().padStart(2, '0')} TOTAL</span></div><div className="repo-grid">{extraRepos.map(repo => <a className="repo-card card" key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer"><div className="repo-card-top"><Github size={15} /><ArrowUpRight size={13} /></div><h3>{repo.name}</h3><p>{repo.description || 'A small experiment from the workbench.'}</p><div className="repo-meta"><span>{repo.language || 'OPEN SOURCE'}</span><span>☆ {repo.stargazers_count}</span></div></a>)}</div></section>}

      <footer id="contact" className="footer"><div className="footer-main"><div><span className="section-kicker">HAVE A GOOD IDEA?</span><h2>Let’s make<br />something <span>matter.</span></h2></div><a className="contact-button" href="mailto:hello@lovemsf.dev" aria-label="Email Artem"><ArrowUpRight size={26} /></a></div><div className="footer-bottom"><a className="wordmark" href="#home"><span className="logo-glyph">L<span className="red">·</span></span><span>LOVEMSF<span className="wordmark-sub"> / TOKYO, JAPAN</span></span></a><div className="footer-clock"><span className="live-dot" /> LOCAL TIME <b>{clock}</b></div><div className="social-links"><a href={profile.html_url} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12} /></a><a href="#home">BACK TO TOP ↑</a></div><span className="copyright">© 2025—26 ARTEM</span></div></footer>
    </div>
  </main>
}

export default App
