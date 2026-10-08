import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Aperture, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Feather, Menu, Plus, Smartphone, X } from 'lucide-react'
import { faqs, moments, navigation, steps } from './content'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" /> : <ArrowRight size={17} strokeWidth={1.6} aria-hidden="true" />
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    const query = window.matchMedia('(min-width: 861px)')
    const onWide = () => { if (query.matches) setMenuOpen(false) }
    window.addEventListener('keydown', close)
    query.addEventListener('change', onWide)
    return () => { window.removeEventListener('keydown', close); query.removeEventListener('change', onWide) }
  }, [menuOpen])

  return <header className="site-header">
    <div className="header-inner">
      <a className="wordmark" href="#top" aria-label="nodrio 처음으로" onClick={() => setMenuOpen(false)}>nodrio<span className="brand-dot" /></a>
      <nav className="desktop-nav" aria-label="주 메뉴">
        {navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="button button-dark header-cta" href="#notify" onClick={() => setMenuOpen(false)}>출시 알림 <Arrow diagonal /></a>
        <button ref={menuButton} className="icon-button menu-toggle" aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
    </div>
    {menuOpen && <nav id="mobile-menu" className="mobile-nav" aria-label="모바일 주 메뉴">
      {navigation.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<Arrow /></a>)}
      <a href="#notify" onClick={() => setMenuOpen(false)}>출시 알림 받기<Arrow /></a>
    </nav>}
  </header>
}

function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <picture><source media="(max-width: 640px)" srcSet="/images/mobile.webp" /><img className="hero-image" src="/images/hero.webp" width="1536" height="1024" alt="스마트폰 뒷면에 부착된 접이식 드론과 분리되어 비행하는 드론의 콘셉트" fetchPriority="high" /></picture>
    <div className="hero-content">
      <p className="eyebrow hero-eyebrow"><span className="status-dot" /> AEROPOD <span className="eyebrow-divider" /> BY NODRIO</p>
      <h1 id="hero-title">폰에 붙이고,<br />순간을 날려보세요<span className="title-period">.</span></h1>
      <p className="hero-description">일상에 붙어 있다가,<br className="mobile-break" /> 새로운 시선이 필요할 때.</p>
      <div className="hero-actions">
        <a href="#notify" className="button button-dark">출시 알림 받기<Arrow diagonal /></a>
        <a href="#product" className="text-link">제품 살펴보기<ChevronRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="hero-side-note" aria-hidden="true"><span>A SMALLER FORM.</span><span>A WIDER PERSPECTIVE.</span><i /></div>
    <a className="hero-scroll" href="#product"><span>새로운 시선의 시작</span><ArrowDown size={16} aria-hidden="true" /></a>
    <p className="concept-note hero-note">제품 형태는 콘셉트 이미지입니다.</p>
  </section>
}

function Product() {
  const benefits = [
    { Icon: Smartphone, title: '언제나, 폰과 함께.', text: '따로 챙기는 촬영 도구에서\n늘 함께하는 일상의 일부로.', tag: 'MADE TO GO WITH YOU' },
    { Icon: Feather, title: '필요한 순간, 가볍게.', text: '폰 뒷면에 붙여 휴대하고,\n담고 싶은 순간에 분리하세요.', tag: 'READY FOR YOUR MOMENT' },
    { Icon: Aperture, title: '익숙한 풍경, 새로운 시선.', text: '손안에서 시작된 아이디어가\n더 넓은 촬영의 가능성으로.', tag: 'A DIFFERENT POINT OF VIEW' },
  ]
  return <section id="product" className="product section-pad container" aria-labelledby="product-title">
    <div className="section-heading reveal">
      <div><p className="eyebrow section-eyebrow">01 — MEET AEROPOD</p><h2 id="product-title">당신의 일상에 붙어,<br />시선을 넓히다.</h2></div>
      <div className="intro-copy"><span className="small-overline">A NEW WAY TO CARRY YOUR CAMERA</span><p>멋진 순간은 준비된 날에만 찾아오지 않으니까.<br />nodrio는 늘 손에 있는 스마트폰에서<br className="desktop-break" /> 새로운 촬영 경험을 시작합니다.</p><p className="muted">폰 뒤에 붙이는 초소형 촬영 드론, AEROPOD.</p></div>
    </div>
    <div className="benefits">
      {benefits.map(({ Icon, title, text, tag }, index) => <article key={title} className="benefit reveal" style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties}>
        <div className="benefit-top"><Icon size={26} strokeWidth={1.25} aria-hidden="true" /><span>0{index + 1}</span></div>
        <h3>{title}</h3><p>{text}</p><span className="small-overline">{tag}</span>
      </article>)}
    </div>
  </section>
}

function Workflow() {
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % steps.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + steps.length - 1) % steps.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = steps.length - 1
    else return
    event.preventDefault(); setActive(next); buttons.current[next]?.focus()
  }
  return <section id="how-it-works" className="workflow section-pad" aria-labelledby="workflow-title">
    <div className="container">
      <div className="section-heading workflow-heading reveal"><div><p className="eyebrow section-eyebrow">02 — FROM PHONE TO FLIGHT</p><h2 id="workflow-title">붙이고. 분리하고.<br />날려보세요.</h2></div><p className="section-side-copy">함께 다니다가, 필요한 순간에.<br />세 장면으로 만나는 새로운 촬영 경험.</p></div>
      <div className="workflow-layout reveal">
        <div className="workflow-visual">
          {steps.map((step, index) => <div key={step.tag} className={`step-image ${active === index ? 'is-active' : ''}`} role="img" aria-label={step.alt} aria-hidden={active !== index} style={{ backgroundPosition: `${step.position} center` }} />)}
          <span className="visual-index" aria-hidden="true">0{active + 1}<span> / 03</span></span>
          <p className="concept-note">제품 형태 및 사용 흐름은 콘셉트입니다.</p>
        </div>
        <div className="workflow-story">
          <div className="step-tabs" role="tablist" aria-label="제품 사용 단계">
            {steps.map((step, index) => <button key={step.tag} id={`step-tab-${index}`} ref={el => { buttons.current[index] = el }} role="tab" aria-selected={active === index} aria-controls={`step-panel-${index}`} tabIndex={active === index ? 0 : -1} className={`step-tab ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)} onKeyDown={event => onKey(event, index)}><span className="step-number">0{index + 1}</span><span>{step.title}</span><ArrowRight className="step-arrow" size={18} aria-hidden="true" /></button>)}
          </div>
          {steps.map((step, index) => <div key={step.tag} id={`step-panel-${index}`} className="step-detail" role="tabpanel" aria-labelledby={`step-tab-${index}`} hidden={active !== index}><span className="small-overline">{step.tag}</span><h3>{step.subtitle}</h3><p>{step.description}</p></div>)}
          <div className="step-controls"><span>나만의 시선이 시작되는 순간</span><button className="icon-button" aria-label="다음 사용 단계" onClick={() => setActive((active + 1) % steps.length)}><ArrowRight size={18} aria-hidden="true" /></button></div>
        </div>
      </div>
    </div>
  </section>
}

function Moments() {
  const [active, setActive] = useState(0)
  const moment = moments[active]
  return <section id="moments" className="moments section-pad container" aria-labelledby="moments-title">
    <div className="section-heading reveal"><div><p className="eyebrow section-eyebrow">03 — MORE THAN A MOMENT</p><h2 id="moments-title">같은 순간.<br />다른 이야기.</h2></div><p className="section-side-copy">멀리 떠나는 날에도, 가까이 걷는 날에도.<br />늘 보던 세상에서 새로운 장면을 발견하세요.</p></div>
    <div className="moment-frame reveal">
      {moments.map((scene, index) => <img key={scene.image} className={active === index ? 'is-active' : ''} src={scene.image} width="1536" height="1024" alt={scene.alt} aria-hidden={active !== index} loading="lazy" style={{ objectPosition: scene.position }} />)}
      <div className="moment-shade" />
      <div className="moment-content" aria-live="polite" aria-atomic="true"><span className="eyebrow">{moment.tag}</span><h3>{moment.title}</h3><p>{moment.text}</p></div>
      <span className="moment-caption">활용 장면 예시 · 실제 제품 촬영 결과가 아닙니다.</span>
      <div className="moment-controls"><button className="icon-button" aria-label="이전 활용 장면" onClick={() => setActive((active + moments.length - 1) % moments.length)}><ArrowLeft size={19} aria-hidden="true" /></button><span>0{active + 1}<i> / 03</i></span><button className="icon-button" aria-label="다음 활용 장면" onClick={() => setActive((active + 1) % moments.length)}><ArrowRight size={19} aria-hidden="true" /></button></div>
    </div>
    <div className="moment-selectors" aria-label="활용 장면 선택">
      {['여행의 순간', '일상의 발견', '함께하는 기억'].map((label, index) => <button key={label} aria-pressed={active === index} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><span>0{index + 1}</span>{label}<Arrow diagonal /></button>)}
    </div>
  </section>
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return <section id="faq" className="faq-section section-pad" aria-labelledby="faq-title"><div className="container faq-layout">
    <div className="faq-heading reveal"><p className="eyebrow section-eyebrow">04 — GOOD TO KNOW</p><h2 id="faq-title">궁금한 점,<br />차근차근.</h2><p>새로운 제품에 대한 궁금증.<br />지금 안내할 수 있는 정보를 모았습니다.</p><span className="faq-note"><span className="status-dot" /> 확정된 정보부터 투명하게 안내합니다.</span></div>
    <div className="faq-list reveal">{faqs.map((faq, index) => <article key={faq.question} className={`faq-item ${open === index ? 'is-open' : ''}`}><h3><button aria-expanded={open === index} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{faq.question}</span><Plus size={20} strokeWidth={1.5} aria-hidden="true" /></button></h3><div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index}><p>{faq.answer}</p></div></article>)}</div>
  </div></section>
}

type SubmitStatus = 'idle' | 'loading' | 'demo' | 'success' | 'error'

function Notify() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState('')
  const [consentError, setConsentError] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const emailInput = useRef<HTMLInputElement>(null)
  const consentInput = useRef<HTMLInputElement>(null)
  const rawEndpoint = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim() || ''
  const privacyNotice = import.meta.env.VITE_PRIVACY_NOTICE?.trim() || ''
  const endpoint = /^(https:\/\/|\/(?!\/))/.test(rawEndpoint) ? rawEndpoint : ''
  const isDemo = !endpoint || !privacyNotice

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    setError(''); setConsentError(false)
    const normalized = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) {
      setError('이메일 주소를 확인해주세요. 예: hello@example.com'); setStatus('idle'); emailInput.current?.focus(); return
    }
    if (!consent) { setConsentError(true); setStatus('idle'); consentInput.current?.focus(); return }
    if (isDemo) { setStatus('demo'); return }
    setStatus('loading')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ email: normalized, consent: true, source: 'nodrio-launch', consentVersion: '2026-10-08' }),
      })
      const result: unknown = await response.json().catch(() => null)
      if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) throw new Error('Subscription not confirmed')
      setStatus('success'); setEmail(''); setConsent(false)
    } catch {
      setStatus('error'); setError('신청을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally { window.clearTimeout(timeout) }
  }

  return <section id="notify" className="notify-section" aria-labelledby="notify-title">
    <div className="container notify-layout">
      <div className="notify-copy reveal"><p className="eyebrow section-eyebrow">BE THE FIRST TO KNOW</p><h2 id="notify-title">새로운 시선이 열릴 때,<br />가장 먼저 만나보세요.</h2><p>nodrio의 다음 이야기와<br />AEROPOD의 출시 소식을 전해드립니다.</p><div className="notify-brand">AEROPOD<span>BY NODRIO</span></div></div>
      <div className="notify-form-wrap reveal">
        <form onSubmit={submit} noValidate aria-label="출시 알림 신청" aria-busy={status === 'loading'}>
          <div className="form-heading"><h3>출시 알림 신청</h3>{isDemo && <span className="preview-badge">미리보기</span>}</div>
          {isDemo && <p className="form-demo-note">현재는 미리보기입니다. 입력한 이메일은 저장·전송되지 않으며, 알림 신청이 실제 접수되지 않습니다.</p>}
          <label className="email-label" htmlFor="email">이메일 주소</label>
          <div className={`email-field ${error ? 'has-error' : ''}`}><input id="email" ref={emailInput} type="email" name="email" placeholder="hello@example.com" autoComplete="email" maxLength={254} value={email} onChange={event => { setEmail(event.target.value); if (status !== 'loading') setStatus('idle'); setError('') }} aria-invalid={!!error} aria-describedby={error ? 'email-error' : 'email-hint'} disabled={status === 'loading'} /><button type="submit" className="button button-dark" aria-label={status === 'loading' ? '신청 중' : '알림 받기'} disabled={status === 'loading'}><span>{status === 'loading' ? '신청 중' : '알림 받기'}</span>{status === 'loading' ? <span className="spinner" aria-hidden="true" /> : <Arrow />}</button></div>
          <p id="email-hint" className="input-hint">제품 소식과 출시 안내를 위한 이메일입니다.</p>
          {error && <p id="email-error" className="form-error" role="alert">{error}</p>}
          <label className="consent"><input ref={consentInput} type="checkbox" checked={consent} onChange={event => { setConsent(event.target.checked); setConsentError(false) }} aria-invalid={consentError} aria-describedby={consentError ? 'consent-error' : undefined} disabled={status === 'loading'} /><span>출시 알림을 위한 이메일 수집·이용에 동의합니다.</span></label>
          {consentError && <p id="consent-error" className="form-error" role="alert">이메일 수집·이용 동의를 확인해주세요.</p>}
          <button type="button" className="privacy-toggle" aria-expanded={privacyOpen} aria-controls="privacy-details" onClick={() => setPrivacyOpen(!privacyOpen)}>수집·이용 안내<Plus size={13} aria-hidden="true" /></button>
          {privacyOpen && <div id="privacy-details" className="privacy-details"><p>{isDemo ? '이 프로토타입은 입력한 이메일을 수집·저장·전송하지 않습니다. 동의 항목은 신청 흐름을 확인하기 위한 미리보기입니다.' : privacyNotice}</p></div>}
          <div className="form-result" role="status" aria-live="polite" aria-atomic="true">{status === 'demo' && <p><Check size={18} aria-hidden="true" /><span>입력 확인이 완료됐습니다.<small>미리보기이므로 실제 신청은 접수되지 않았습니다.</small></span></p>}{status === 'success' && <p><Check size={18} aria-hidden="true" /><span>출시 알림 신청이 완료됐습니다.<small>새로운 소식이 준비되면 알려드릴게요.</small></span></p>}</div>
        </form>
      </div>
    </div>
  </section>
}

function Footer() {
  return <footer className="site-footer container"><div className="footer-top"><a href="#top" className="wordmark" aria-label="nodrio 처음으로">nodrio<span className="brand-dot" /></a><p>작은 시작, 더 넓은 시선.</p><a href="#top" className="footer-top-link">맨 위로<ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} nodrio</span><p>AEROPOD는 제품 가칭입니다. 제품 이미지와 활용 장면은 콘셉트이며,<br className="desktop-break" /> 최종 디자인·사양·가격·출시 일정·인증 정보는 확정 후 안내합니다.</p><span>DESIGNED FOR NEW PERSPECTIVES</span></div></footer>
}

export default function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target) } })
    }, { threshold: 0.06 })
    elements.forEach(element => { element.classList.add('will-reveal'); observer.observe(element) })
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('will-reveal')) }
  }, [])

  return <><a className="skip-link" href="#main">본문으로 바로가기</a><div id="top" /><Header /><main id="main"><Hero /><Product /><Workflow /><Moments /><FAQ /><Notify /></main><Footer /></>
}
