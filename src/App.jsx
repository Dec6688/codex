import { useEffect, useMemo, useRef, useState } from 'react';
import cursorUrl from './assets/cursor/island-pointer.svg';
import { AboutPage } from './pages/AboutPage.jsx';
import { DownloadsPage } from './pages/DownloadsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { PostPage } from './pages/PostPage.jsx';
import './styles.css';

// 后续把歌曲放进 public/music，再把下面路径替换为你的文件即可。
// 可以继续添加更多歌曲，岛屿电台弹窗里会自动显示切歌按钮。
const MUSIC_PLAYLIST = [
  { title: 'Island Theme', src: '/music/island-theme.mp3' },
  { title: 'Morning Beach', src: '/music/morning-beach.mp3' },
];

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash.replace(/^#/, '') || '/';
}

function useAutoHideHeader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > 120 && currentY > lastY);
      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return hidden;
}

const pathFor = (path) => `#${path}`;

function NavItem({ to, current, children }) {
  const active = current === to || (to === '/' && current === '');
  return <a className={active ? 'active' : ''} href={pathFor(to)}>{children}</a>;
}

function useTiltCards(refreshKey) {
  useEffect(() => {
    const cards = [...document.querySelectorAll('.tilt-card')];

    const handleMove = (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(0)}%`);
      card.style.setProperty('--shine-y', `${((y + 0.5) * 100).toFixed(0)}%`);
    };

    const reset = (event) => {
      event.currentTarget.style.setProperty('--tilt-x', '0deg');
      event.currentTarget.style.setProperty('--tilt-y', '0deg');
      event.currentTarget.style.setProperty('--shine-x', '50%');
      event.currentTarget.style.setProperty('--shine-y', '30%');
    };

    cards.forEach((card) => {
      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerleave', reset);
    });

    return () => cards.forEach((card) => {
      card.removeEventListener('pointermove', handleMove);
      card.removeEventListener('pointerleave', reset);
    });
  }, [refreshKey]);
}

function Layout() {
  const route = useHashRoute();
  const headerHidden = useAutoHideHeader();
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const [radioOpen, setRadioOpen] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const currentTrack = MUSIC_PLAYLIST[trackIndex];

  const page = useMemo(() => {
    if (route.startsWith('/posts/')) return <PostPage slug={route.replace('/posts/', '')} />;
    if (route === '/downloads') return <DownloadsPage />;
    if (route === '/about') return <AboutPage />;
    return <HomePage />;
  }, [route]);

  useTiltCards(route);

  useEffect(() => {
    const tryPlay = async () => {
      if (!audioRef.current) return;
      try {
        audioRef.current.volume = 0.35;
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    };

    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => window.removeEventListener('pointerdown', tryPlay);
  }, []);

  useEffect(() => {
    if (musicOn) audioRef.current?.play().catch(() => setMusicOn(false));
  }, [musicOn, trackIndex]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setMusicOn(true);
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  const switchTrack = (direction) => {
    setTrackIndex((index) => (index + direction + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length);
  };

  return (
    <div className="island-shell" style={{ '--animal-cursor': `url(${cursorUrl}) 12 8, auto` }}>
      <div className="sun-glow" />
      <audio ref={audioRef} src={currentTrack.src} loop preload="auto" />

      <header className={`site-header card tilt-card ${headerHidden ? 'site-header--hidden' : ''}`}>
        <a className="brand" href={pathFor('/')}>
          <span className="brand-mark">🏝️</span>
          <span>我的岛屿博客</span>
        </a>
        <nav>
          <NavItem to="/" current={route}>首页</NavItem>
          <NavItem to="/downloads" current={route}>下载</NavItem>
          <NavItem to="/about" current={route}>关于</NavItem>
        </nav>
      </header>

      <main>{page}</main>

      {radioOpen && (
        <aside className="radio-popover card" aria-label="岛屿电台播放器">
          <button className="radio-close" type="button" onClick={() => setRadioOpen(false)}>×</button>
          <p className="eyebrow">Island Radio</p>
          <h3>{currentTrack.title}</h3>
          <div className="radio-disc">{musicOn ? '🎶' : '📻'}</div>
          <div className="radio-controls">
            <button type="button" onClick={() => switchTrack(-1)}>上一首</button>
            <button type="button" onClick={toggleMusic}>{musicOn ? '暂停' : '播放'}</button>
            <button type="button" onClick={() => switchTrack(1)}>下一首</button>
          </div>
          <p>把歌曲放进 <code>public/music</code> 后，在 <code>MUSIC_PLAYLIST</code> 中改路径即可。</p>
        </aside>
      )}

      <button className="music-button radio-widget tilt-card" type="button" onClick={() => setRadioOpen((open) => !open)}>
        <span className="radio-icon">{musicOn ? '🎵' : '📻'}</span>
        <span>{musicOn ? '岛屿电台播放中' : '打开岛屿电台'}</span>
      </button>
    </div>
  );
}

export default Layout;
