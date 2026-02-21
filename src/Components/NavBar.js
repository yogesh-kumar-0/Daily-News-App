import React, { Component } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NAV_LINKS = [
  { label: 'Home',          path: '/',              icon: 'fas fa-home', cat: 'general'       },
  { label: 'Business',      path: '/business',      icon: 'fas fa-briefcase', cat: 'business'      },
  { label: 'Entertainment', path: '/entertainment', icon: 'fas fa-film', cat: 'entertainment' },
  { label: 'Health',        path: '/health',        icon: 'fas fa-heart', cat: 'health'        },
  { label: 'Science',       path: '/science',       icon: 'fas fa-flask', cat: 'science'       },
  { label: 'Sports',        path: '/sports',        icon: 'fas fa-futbol', cat: 'sports'        },
  { label: 'Technology',    path: '/technology',    icon: 'fas fa-microchip', cat: 'technology'    },
];

const TICKER_ITEMS = [
  'Markets rally as central banks signal rate pause',
  'Scientists achieve breakthrough in quantum error correction',
  'New climate accord signed by 140 nations at summit',
  'Tech giant unveils AI chip with 5× efficiency gains',
  'Health officials report sharp decline in global malaria cases',
  'SpaceX targets crewed Mars mission for 2028',
  'Record renewable energy output across Europe this winter',
];

/* ── Search Overlay ────────────────────────────────────── */
class SearchOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => this.inputRef.current?.focus(), 60);
    document.addEventListener('keydown', this.onKey);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKey);
  }
  onKey = (e) => {
    if (e.key === 'Escape') this.props.onClose();
  };

  render() {
    const { onClose, navigate } = this.props;
    const { query } = this.state;

    const suggestions = NAV_LINKS.filter(l =>
      l.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleGo = (path) => {
      navigate(path);
      onClose();
    };

    return (
      <>
        <style>{`
          .srch-overlay {
            position: fixed; inset: 0; z-index: 1000;
            background: rgba(0,0,0,0.82);
            backdrop-filter: blur(16px);
            display: flex; align-items: flex-start;
            justify-content: center;
            padding-top: 12vh;
            animation: srch-bg-in 0.22s ease;
          }
          @keyframes srch-bg-in {
            from { opacity: 0; } to { opacity: 1; }
          }
          .srch-box {
            width: min(600px, 92vw);
            background: var(--card2);
            border: 1px solid var(--border2);
            border-radius: var(--r-lg);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            animation: srch-box-in 0.25s ease;
          }
          @keyframes srch-box-in {
            from { opacity: 0; transform: translateY(-20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)     scale(1);    }
          }
          .srch-top {
            display: flex; align-items: center; gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
          }
          .srch-icon { font-size: 1.2rem; color: var(--accent); flex-shrink: 0; }
          .srch-input {
            flex: 1; background: none; border: none; outline: none;
            font-family: 'Sora', sans-serif; font-size: 1.05rem;
            color: var(--text);
          }
          .srch-input::placeholder { color: var(--text3); }
          .srch-close {
            background: var(--bg3); border: 1px solid var(--border);
            color: var(--text2); width: 30px; height: 30px; border-radius: 6px;
            font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
            transition: all var(--transition); flex-shrink: 0;
          }
          .srch-close:hover { color: var(--red); border-color: var(--red); }
          .srch-results { padding: 10px 10px 14px; }
          .srch-section-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
            color: var(--text3); padding: 6px 10px 4px;
          }
          .srch-result-item {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 12px; border-radius: var(--r-sm);
            cursor: pointer; transition: background var(--transition);
          }
          .srch-result-item:hover { background: var(--bg3); }
          .srch-result-icon { 
            font-size: 1.2rem; 
            color: var(--accent);
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .srch-result-label { font-size: 0.9rem; color: var(--text); font-weight: 500; }
          .srch-result-path  { font-size: 0.7rem; color: var(--text3); font-family: 'JetBrains Mono', monospace; margin-top: 1px; }
          .srch-hint {
            text-align: center; padding: 1.5rem;
            font-size: 0.75rem; color: var(--text3);
            font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
          }
        `}</style>

        <div className="srch-overlay" onClick={onClose}>
          <div className="srch-box" onClick={e => e.stopPropagation()}>
            <div className="srch-top">
              <span className="srch-icon"><i className="fas fa-search"></i></span>
              <input
                ref={this.inputRef}
                className="srch-input"
                placeholder="Search categories…"
                value={query}
                onChange={e => this.setState({ query: e.target.value })}
              />
              <button className="srch-close" onClick={onClose}><i className="fas fa-times"></i></button>
            </div>
            <div className="srch-results">
              <div className="srch-section-label">Browse Categories</div>
              {suggestions.map(l => (
                <div key={l.path} className="srch-result-item" onClick={() => handleGo(l.path)}>
                  <span className="srch-result-icon"><i className={l.icon}></i></span>
                  <div>
                    <div className="srch-result-label">{l.label}</div>
                    <div className="srch-result-path">thedaily.com{l.path}</div>
                  </div>
                </div>
              ))}
              {suggestions.length === 0 && (
                <div className="srch-hint">No categories match "{query}"</div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

/* ── NavBar Inner (class) ──────────────────────────────── */
class NavBarInner extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: false, scrolled: false };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  onScroll = () => this.setState({ scrolled: window.scrollY > 30 });

  toggleMenu = () => this.setState(p => ({ menuOpen: !p.menuOpen }));
  closeMenu  = () => this.setState({ menuOpen: false });

  render() {
    const { location, navigate, theme, toggleTheme, bookmarks, openSearch, searchOpen, closeSearch } = this.props;
    const { menuOpen, scrolled } = this.state;
    const bmCount = bookmarks?.length || 0;

    return (
      <>
        <style>{`
          /* ── Base navbar ── */
          .nb {
            position: fixed; top: 0; left: 0; right: 0; z-index: 500;
            height: 62px;
            background: ${scrolled ? 'rgba(11,11,14,0.97)' : 'rgba(11,11,14,0.85)'};
            backdrop-filter: blur(20px) saturate(1.4);
            border-bottom: 1px solid var(--border);
            transition: background 0.35s, border-color 0.35s, box-shadow 0.35s;
            ${scrolled ? 'box-shadow: 0 4px 24px rgba(0,0,0,0.4);' : ''}
          }
          body.light .nb {
            background: ${scrolled ? 'rgba(244,241,236,0.97)' : 'rgba(244,241,236,0.88)'};
          }

          .nb-inner {
            max-width: 1400px; margin: 0 auto;
            height: 100%; padding: 0 1.5rem;
            display: flex; align-items: center; gap: 0;
          }

          /* Logo */
          .nb-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.4rem; font-weight: 900; letter-spacing: -0.03em;
            color: var(--text); flex-shrink: 0; user-select: none;
            margin-right: 2rem;
          }
          .nb-logo em { color: var(--accent); font-style: normal; }

          /* Links */
          .nb-links {
            display: flex; align-items: center; gap: 1px;
            list-style: none; flex: 1;
          }
          .nb-links li a {
            display: flex; align-items: center; gap: 5px;
            padding: 5px 10px; border-radius: var(--r-sm);
            font-size: 0.76rem; font-weight: 500;
            color: var(--text2); white-space: nowrap;
            transition: color var(--transition), background var(--transition);
          }
          .nb-links li a:hover   { color: var(--text); background: var(--bg3); }
          .nb-links li a.active  { color: var(--accent); background: var(--accent-lite); }

          /* Right controls */
          .nb-controls {
            display: flex; align-items: center; gap: 6px;
            flex-shrink: 0; margin-left: 1.5rem;
          }
          .nb-btn {
            width: 36px; height: 36px; border-radius: var(--r-sm);
            background: var(--bg3); border: 1px solid var(--border);
            color: var(--text2); font-size: 1rem;
            display: flex; align-items: center; justify-content: center;
            transition: color var(--transition), border-color var(--transition), background var(--transition);
            position: relative;
          }
          .nb-btn:hover { color: var(--accent); border-color: var(--accent); background: var(--accent-lite); }
          .nb-btn-badge {
            position: absolute; top: -4px; right: -5px;
            width: 16px; height: 16px; border-radius: 50%;
            background: var(--accent); color: #fff;
            font-size: 0.55rem; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid var(--bg);
          }

          .nb-divider {
            width: 1px; height: 20px; background: var(--border);
            margin: 0 4px;
          }

          /* Live badge */
          .nb-live {
            display: flex; align-items: center; gap: 5px;
            background: rgba(217,85,85,0.1);
            border: 1px solid rgba(217,85,85,0.22);
            border-radius: 100px; padding: 3px 10px;
            font-size: 0.6rem; font-weight: 600;
            color: var(--red); text-transform: uppercase; letter-spacing: 0.08em;
            font-family: 'JetBrains Mono', monospace;
          }
          .nb-live-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--red);
            animation: live-pulse 1.5s infinite;
          }
          @keyframes live-pulse {
            0%, 100% { opacity: 1; } 50% { opacity: 0.25; }
          }

          /* Burger */
          .nb-burger {
            display: none; flex-direction: column; gap: 5px;
            background: none; border: none; padding: 6px;
          }
          .nb-burger span {
            display: block; width: 20px; height: 2px;
            background: var(--text2); border-radius: 2px;
            transition: all 0.25s;
          }
          .nb-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
          .nb-burger.open span:nth-child(2) { opacity: 0; width: 0; }
          .nb-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

          /* Mobile drawer */
          .nb-drawer {
            position: fixed; top: 62px; left: 0; right: 0; bottom: 0;
            background: rgba(11,11,14,0.98);
            backdrop-filter: blur(20px);
            z-index: 499;
            display: flex; flex-direction: column;
            padding: 1.25rem 1rem;
            gap: 4px; overflow-y: auto;
            transform: ${menuOpen ? 'translateX(0)' : 'translateX(-100%)'};
            transition: transform 0.28s ease;
          }
          body.light .nb-drawer { background: rgba(244,241,236,0.98); }
          .nb-drawer-link {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 14px; border-radius: var(--r-md);
            font-size: 0.95rem; font-weight: 500; color: var(--text2);
            transition: color var(--transition), background var(--transition);
          }
          .nb-drawer-link:hover, .nb-drawer-link.active {
            color: var(--accent); background: var(--accent-lite);
          }
          .nb-drawer-icon { font-size: 1.1rem; margin-right: 5px; }
          .nb-drawer-divider { height: 1px; background: var(--border); margin: 8px 4px; }

          /* Ticker */
          .nb-ticker {
            position: fixed; top: 62px; left: 0; right: 0; z-index: 498;
            background: #150808;
            border-bottom: 1px solid rgba(217,85,85,0.18);
            height: 32px; overflow: hidden;
          }
          body.light .nb-ticker { background: #f8eaea; }
          .nb-ticker-track {
            display: inline-flex; align-items: center; gap: 56px;
            height: 100%; white-space: nowrap;
            animation: ticker-run 40s linear infinite;
          }
          .nb-ticker-track:hover { animation-play-state: paused; }
          .nb-ticker-item {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.68rem; color: var(--text2); letter-spacing: 0.015em;
          }
          .nb-ticker-badge {
            background: var(--red); color: #fff;
            font-size: 0.56rem; font-weight: 700; letter-spacing: 0.1em;
            padding: 2px 7px; border-radius: 4px; text-transform: uppercase;
            font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
          }
          @keyframes ticker-run {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* Responsive */
          @media (max-width: 960px) {
            .nb-links { display: none; }
            .nb-burger { display: flex; }
          }
        `}</style>

        {/* ── Navbar ── */}
        <nav className="nb">
          <div className="nb-inner">
            <Link to="/" className="nb-logo" onClick={this.closeMenu}>
              The<em>·</em>Daily
            </Link>

            <ul className="nb-links">
              {NAV_LINKS.map(({ label, path, icon }) => (
                <li key={path}>
                  <Link to={path} className={location.pathname === path ? 'active' : ''}>
                    <i className={icon}></i>{label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nb-controls">
              {/* Search */}
              <button className="nb-btn" onClick={openSearch} title="Search (/)">
                <i className="fas fa-search"></i>
              </button>

              {/* Bookmarks */}
              <button
                className="nb-btn"
                onClick={() => navigate('/bookmarks')}
                title="Bookmarks"
              >
                <i className="fas fa-bookmark"></i>
                {bmCount > 0 && (
                  <span className="nb-btn-badge">{bmCount > 9 ? '9+' : bmCount}</span>
                )}
              </button>

              <div className="nb-divider" />

              {/* Theme toggle */}
              <button
                className="nb-btn"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              >
                <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
              </button>

              <div className="nb-divider" />

              {/* Live */}
              <div className="nb-live">
                <span className="nb-live-dot" />
                Live
              </div>

              {/* Burger */}
              <button
                className={`nb-burger${menuOpen ? ' open' : ''}`}
                onClick={this.toggleMenu}
                aria-label="Toggle menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile drawer ── */}
        <div className="nb-drawer">
          {NAV_LINKS.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nb-drawer-link${location.pathname === path ? ' active' : ''}`}
              onClick={this.closeMenu}
            >
              <i className={`${icon} nb-drawer-icon`}></i>
              {label}
            </Link>
          ))}
          <div className="nb-drawer-divider" />
          <Link
            to="/bookmarks"
            className={`nb-drawer-link${location.pathname === '/bookmarks' ? ' active' : ''}`}
            onClick={this.closeMenu}
          >
            <i className="fas fa-bookmark nb-drawer-icon"></i>
            Bookmarks {bmCount > 0 && `(${bmCount})`}
          </Link>
          <button
            className="nb-drawer-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => { toggleTheme(); this.closeMenu(); }}
          >
            <i className={`${theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} nb-drawer-icon`}></i>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* ── Ticker ── */}
        <div className="nb-ticker" aria-hidden="true">
          <div className="nb-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="nb-ticker-item">
                <span className="nb-ticker-badge">Breaking</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Search overlay ── */}
        {searchOpen && (
          <SearchOverlay onClose={closeSearch} navigate={navigate} />
        )}
      </>
    );
  }
}

/* Inject hooks → class component */
export default function NavBar(props) {
  const location = useLocation();
  const navigate  = useNavigate();
  return <NavBarInner {...props} location={location} navigate={navigate} />;
}
