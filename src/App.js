import React, { Component } from 'react';
import './App.css';
import NavBar    from './Components/NavBar';
import News      from './Components/News';
import NewsItems from './Components/NewsItems';
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* ── Toast ───────────────────────────────────────────────── */
class Toast extends Component {
  render() {
    const { toasts } = this.props;
    if (!toasts || toasts.length === 0) return null;
    return (
      <>
        <style>{`
          .toast-stack {
            position: fixed; bottom: 24px; right: 24px;
            z-index: 9999; display: flex; flex-direction: column;
            gap: 10px; pointer-events: none;
          }
          .toast-item {
            display: flex; align-items: center; gap: 10px;
            background: var(--card2);
            border: 1px solid var(--border2);
            border-radius: 12px;
            padding: 11px 17px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.55);
            animation: t-in 0.28s ease forwards;
            min-width: 220px; max-width: 320px;
            pointer-events: all;
          }
          .toast-icon { font-size: 1rem; flex-shrink: 0; }
          .toast-msg  { font-size: 0.8rem; color: var(--text); line-height: 1.4; }
          @keyframes t-in {
            from { opacity: 0; transform: translateY(14px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)     scale(1);    }
          }
        `}</style>
        <div className="toast-stack">
          {toasts.map(t => (
            <div key={t.id} className="toast-item">
              <span className="toast-icon">{t.icon}</span>
              <span className="toast-msg">{t.msg}</span>
            </div>
          ))}
        </div>
      </>
    );
  }
}

/* ── Back-to-top ─────────────────────────────────────────── */
class BackToTop extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  componentDidMount()    { window.addEventListener('scroll', this.onScroll, { passive: true }); }
  componentWillUnmount() { window.removeEventListener('scroll', this.onScroll); }
  onScroll = () => this.setState({ visible: window.scrollY > 500 });
  go = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  render() {
    const { visible } = this.state;
    return (
      <>
        <style>{`
          .btt {
            position: fixed; bottom: 26px; left: 26px; z-index: 600;
            width: 42px; height: 42px; border-radius: 50%;
            background: var(--accent); border: none; color: #fff;
            font-size: 1.05rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 18px var(--accent-glow);
            transition: opacity 0.28s, transform 0.28s;
            opacity: ${visible ? 1 : 0};
            pointer-events: ${visible ? 'all' : 'none'};
            transform: translateY(${visible ? '0' : '12px'});
          }
          .btt:hover { transform: translateY(-3px); }
        `}</style>
        <button className="btt" onClick={this.go} title="Back to top" aria-label="Back to top">↑</button>
      </>
    );
  }
}

/* ── Footer ──────────────────────────────────────────────── */
class SiteFooter extends Component {
  render() {
    return (
      <>
        <style>{`
          .ft {
            background: var(--bg2); border-top: 1px solid var(--border);
            padding: 2rem 1.5rem; margin-top: auto;
          }
          .ft-inner {
            max-width: 1400px; margin: 0 auto;
            display: grid; grid-template-columns: 1fr auto 1fr;
            align-items: center; gap: 1rem;
          }
          .ft-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.25rem; font-weight: 900; color: var(--text);
          }
          .ft-logo em { color: var(--accent); font-style: normal; }
          .ft-copy { font-size: 0.7rem; color: var(--text3); text-align: center; }
          .ft-links { display: flex; gap: 1.5rem; justify-content: flex-end; }
          .ft-links a {
            font-size: 0.73rem; color: var(--text3);
            transition: color 0.2s;
          }
          .ft-links a:hover { color: var(--accent); }
          @media (max-width: 600px) {
            .ft-inner { grid-template-columns: 1fr; text-align: center; gap: 0.6rem; }
            .ft-links  { justify-content: center; }
          }
        `}</style>
        <footer className="ft">
          <div className="ft-inner">
            <div className="ft-logo">The<em>·</em>Daily</div>
            <p className="ft-copy">© {new Date().getFullYear()} The Daily · Powered by NewsAPI</p>
            <div className="ft-links">
              <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer">NewsAPI</a>
              <a href="#top">About</a>
              <a href="#top">Privacy</a>
            </div>
          </div>
        </footer>
      </>
    );
  }
}

/* ── Bookmarks Page ──────────────────────────────────────── */
class BookmarksPage extends Component {
  render() {
    const { bookmarks, toggleBookmark, isBookmarked } = this.props;
    return (
      <>
        <style>{`
          .bm-page { padding-top: 94px; min-height: 100vh; }
          .bm-hero {
            padding: 2.8rem 1.5rem 2.2rem;
            border-bottom: 1px solid var(--border);
            background: var(--bg2); text-align: center;
          }
          .bm-icon  { font-size: 2.6rem; margin-bottom: 0.55rem; }
          .bm-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.7rem, 4vw, 2.6rem); font-weight: 900;
            color: var(--text); margin-bottom: 0.35rem;
          }
          .bm-sub   { font-size: 0.82rem; color: var(--text3); }
          .bm-body  { max-width: 1400px; margin: 0 auto; padding: 2.5rem 1.25rem 5rem; }
          .bm-empty {
            display: flex; flex-direction: column; align-items: center;
            padding: 6rem 2rem; text-align: center; gap: 0.9rem;
          }
          .bm-empty-icon  { font-size: 4rem; opacity: 0.35; }
          .bm-empty-title { font-family: 'Playfair Display', serif; font-size: 1.45rem; color: var(--text2); }
          .bm-empty-sub   { font-size: 0.82rem; color: var(--text3); max-width: 280px; line-height: 1.6; }
          .bm-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 1.2rem;
          }
        `}</style>
        <div className="bm-page">
          <div className="bm-hero">
            <div className="bm-icon">🔖</div>
            <h1 className="bm-title">Your Bookmarks</h1>
            <p className="bm-sub">{bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="bm-body">
            {bookmarks.length === 0 ? (
              <div className="bm-empty">
                <span className="bm-empty-icon">📰</span>
                <div className="bm-empty-title">Nothing saved yet</div>
                <p className="bm-empty-sub">Tap the bookmark icon on any story to save it here for later.</p>
              </div>
            ) : (
              <div className="bm-grid">
                {bookmarks.map((a, i) => (
                  <NewsItems
                    key={a.url || i}
                    title={a.title}
                    description={a.description}
                    imageurl={a.urlToImage}
                    newsurl={a.url}
                    author={a.author}
                    date={a.publishedAt}
                    source={a.source?.name}
                    accentColor="#c9973a"
                    bookmarked={true}
                    onBookmark={() => toggleBookmark(a)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

/* ── Root App ─────────────────────────────────────────────── */
export default class App extends Component {
  constructor(props) {
    super(props);
    const savedTheme     = localStorage.getItem('dn-theme')     || 'dark';
    const savedBookmarks = JSON.parse(localStorage.getItem('dn-bookmarks') || '[]');
    this.state = {
      progress:  0,
      theme:     savedTheme,
      bookmarks: savedBookmarks,
      searchOpen: false,
      toasts:    [],
      toastId:   0,
    };
    this._applyTheme(savedTheme);
  }

  _applyTheme(t) {
    document.body.classList.toggle('light', t === 'light');
  }

  setProgress = (p) => this.setState({ progress: p });

  toggleTheme = () => {
    this.setState(prev => {
      const next = prev.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('dn-theme', next);
      this._applyTheme(next);
      return { theme: next };
    });
  };

  toggleBookmark = (article) => {
    this.setState(prev => {
      const exists = prev.bookmarks.some(b => b.url === article.url);
      const next   = exists
        ? prev.bookmarks.filter(b => b.url !== article.url)
        : [article, ...prev.bookmarks];
      localStorage.setItem('dn-bookmarks', JSON.stringify(next));
      this.addToast(exists ? 'Removed from bookmarks' : 'Saved to bookmarks!', exists ? '🗑️' : '🔖');
      return { bookmarks: next };
    });
  };

  isBookmarked = (url) => this.state.bookmarks.some(b => b.url === url);

  openSearch  = () => this.setState({ searchOpen: true });
  closeSearch = () => this.setState({ searchOpen: false });

  addToast = (msg, icon = '✅') => {
    const id = this.state.toastId + 1;
    this.setState(prev => ({ toastId: id, toasts: [...prev.toasts, { id, msg, icon }] }));
    setTimeout(() => {
      this.setState(prev => ({ toasts: prev.toasts.filter(t => t.id !== id) }));
    }, 2700);
  };

  render() {
    const apikey   = process.env.REACT_APP_NEWS_API;
    const pageSize = 12;
    const { progress, theme, bookmarks, searchOpen, toasts } = this.state;

    const shared = {
      apikey,
      pagesize:       pageSize,
      setProgress:    this.setProgress,
      toggleBookmark: this.toggleBookmark,
      isBookmarked:   this.isBookmarked,
      addToast:       this.addToast,
    };

    return (
      <Router>
        <div className="app-shell">
          <LoadingBar color="#c9973a" progress={progress} height={2.5} shadow={false} />

          <NavBar
            theme={theme}
            toggleTheme={this.toggleTheme}
            bookmarks={bookmarks}
            openSearch={this.openSearch}
            closeSearch={this.closeSearch}
            searchOpen={searchOpen}
            addToast={this.addToast}
          />

          <Routes>
            <Route path="/"              element={<News {...shared} key="general"       category="general"       />} />
            <Route path="/business"      element={<News {...shared} key="business"      category="business"      />} />
            <Route path="/entertainment" element={<News {...shared} key="entertainment" category="entertainment" />} />
            <Route path="/health"        element={<News {...shared} key="health"        category="health"        />} />
            <Route path="/science"       element={<News {...shared} key="science"       category="science"       />} />
            <Route path="/sports"        element={<News {...shared} key="sports"        category="sports"        />} />
            <Route path="/technology"    element={<News {...shared} key="technology"    category="technology"    />} />
            <Route
              path="/bookmarks"
              element={
                <BookmarksPage
                  bookmarks={bookmarks}
                  toggleBookmark={this.toggleBookmark}
                  isBookmarked={this.isBookmarked}
                />
              }
            />
          </Routes>

          <SiteFooter />
          <BackToTop />
          <Toast toasts={toasts} />
        </div>
      </Router>
    );
  }
}
