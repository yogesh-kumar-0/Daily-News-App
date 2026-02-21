import React, { Component } from 'react';
import NewsItems from './NewsItems';
import Spinner   from './spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

const CAT_META = {
  general:       { emoji: '🌐', color: '#c9973a', label: 'Top Headlines',  desc: 'The most important stories happening right now.' },
  business:      { emoji: '📈', color: '#3dba7e', label: 'Business',       desc: 'Markets, economy and corporate news.' },
  entertainment: { emoji: '🎬', color: '#9b72db', label: 'Entertainment',  desc: 'Film, music, TV and pop culture.' },
  health:        { emoji: '❤️', color: '#d95555', label: 'Health',         desc: 'Medicine, wellness and science of the body.' },
  science:       { emoji: '🔬', color: '#4e9de8', label: 'Science',        desc: 'Discoveries, research and the natural world.' },
  sports:        { emoji: '⚽', color: '#f0913a', label: 'Sports',         desc: 'Scores, transfers and sporting events.' },
  technology:    { emoji: '💻', color: '#4e9de8', label: 'Technology',     desc: 'Gadgets, software, AI and the future.' },
};

export default class News extends Component {
  static defaultProps = {
    country:  'us',
    pagesize: 12,
    category: 'general',
  };

  static propTypes = {
    country:        PropTypes.string,
    pagesize:       PropTypes.number,
    category:       PropTypes.string,
    apikey:         PropTypes.string,
    setProgress:    PropTypes.func,
    toggleBookmark: PropTypes.func,
    isBookmarked:   PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles:     [],
      page:         1,
      totalResults: 0,
      loading:      true,
      error:        null,
      viewMode:     'grid',   // 'grid' | 'list'
      sortBy:       'newest', // 'newest' | 'oldest'
    };
  }

  componentDidMount() {
    this.fetchNews(1, true);
    const meta = CAT_META[this.props.category] || CAT_META.general;
    document.title = `${meta.label} — The Daily`;
  }

  fetchNews = async (pageNum, initial = false) => {
    const { category, apikey, pagesize, setProgress } = this.props;
    
    // Validate API key
    if (!apikey || apikey === 'undefined' || apikey === 'placeholder') {
      this.setState({
        error: '🔴 API Key Not Configured. Please set REACT_APP_NEWS_API in Vercel Environment Variables.',
        loading: false,
      });
      console.error('❌ API key is missing or invalid:', apikey);
      return;
    }

    if (setProgress) setProgress(initial ? 8 : 55);

    try {
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apikey}&page=${pageNum}&pageSize=${pagesize}`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.status === 'error') throw new Error(data.message);

      const clean = (data.articles || []).filter(
        a => a.title && a.title !== '[Removed]' && a.url
      );

      this.setState(prev => ({
        articles:     initial ? clean : [...prev.articles, ...clean],
        totalResults: data.totalResults || 0,
        page:         pageNum,
        loading:      false,
        error:        null,
      }));
    } catch (err) {
      this.setState({ loading: false, error: err.message || 'Failed to load.' });
    }

    if (setProgress) setProgress(100);
  };

  fetchMore = () => {
    const { articles, totalResults, page } = this.state;
    if (articles.length >= totalResults) return;
    this.fetchNews(page + 1, false);
  };

  getSorted = () => {
    const { articles, sortBy } = this.state;
    const copy = [...articles];
    if (sortBy === 'oldest') {
      copy.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else {
      copy.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    return copy;
  };

  render() {
    const { category, toggleBookmark, isBookmarked } = this.props;
    const { loading, error, totalResults, viewMode, sortBy } = this.state;
    const meta    = CAT_META[category] || CAT_META.general;
    const sorted  = this.getSorted();
    const featured = sorted[0] || null;
    const rest     = sorted.slice(1);

    return (
      <>
        <style>{`
          /* ── Page shell ── */
          .np { padding-top: 94px; min-height: 100vh; }

          /* ── Hero banner ── */
          .np-hero {
            background: var(--bg2);
            border-bottom: 1px solid var(--border);
            padding: 2.8rem 1.5rem 2.2rem;
          }
          .np-hero-inner {
            max-width: 1400px; margin: 0 auto;
            display: flex; align-items: center; gap: 1.5rem;
          }
          .np-hero-icon {
            font-size: 3.5rem; flex-shrink: 0;
            width: 76px; height: 76px; border-radius: 20px;
            background: var(--bg3); border: 1px solid var(--border2);
            display: flex; align-items: center; justify-content: center;
          }
          .np-hero-tag {
            display: inline-flex; align-items: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.62rem; letter-spacing: 0.13em; text-transform: uppercase;
            padding: 3px 11px; border-radius: 100px; margin-bottom: 0.55rem;
            border: 1px solid ${meta.color}30;
            color: ${meta.color};
          }
          .np-hero-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.9rem, 4.5vw, 3rem);
            font-weight: 900; letter-spacing: -0.03em; line-height: 1.08;
            color: var(--text); margin-bottom: 0.45rem;
          }
          .np-hero-desc {
            font-size: 0.85rem; color: var(--text3); max-width: 480px; line-height: 1.6;
          }
          .np-hero-stats {
            display: flex; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap;
          }
          .np-stat {
            display: flex; align-items: center; gap: 6px;
            font-size: 0.74rem; color: var(--text3);
            font-family: 'JetBrains Mono', monospace;
          }
          .np-stat strong { color: var(--accent); font-size: 0.8rem; }

          /* ── Toolbar ── */
          .np-toolbar {
            max-width: 1400px; margin: 0 auto;
            padding: 1.25rem 1.5rem;
            display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
            border-bottom: 1px solid var(--border);
          }
          .np-toolbar-label {
            font-size: 0.72rem; color: var(--text3); margin-right: 2px;
            font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;
          }
          .np-sort-btn, .np-view-btn {
            background: var(--bg3); border: 1px solid var(--border);
            color: var(--text2); font-size: 0.76rem; font-weight: 500;
            padding: 6px 13px; border-radius: var(--r-sm);
            transition: all var(--transition); display: flex; align-items: center; gap: 5px;
          }
          .np-sort-btn:hover, .np-view-btn:hover  { color: var(--text);   border-color: var(--border2); }
          .np-sort-btn.on,   .np-view-btn.on      { color: var(--accent); border-color: var(--accent); background: var(--accent-lite); }
          .np-spacer { flex: 1; }
          .np-count {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.68rem; color: var(--text3); letter-spacing: 0.04em;
          }

          /* ── Body ── */
          .np-body {
            max-width: 1400px; margin: 0 auto;
            padding: 2rem 1.25rem 5rem;
          }

          /* ── Featured card ── */
          .np-featured {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 0;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--r-lg);
            overflow: hidden;
            margin-bottom: 2rem;
            cursor: pointer;
            transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
          }
          .np-featured:hover {
            border-color: var(--border2);
            box-shadow: var(--shadow-md);
            transform: translateY(-3px);
          }
          .np-featured-img-wrap {
            position: relative; overflow: hidden;
            background: var(--bg3);
            min-height: 320px;
          }
          .np-featured-img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.5s ease;
          }
          .np-featured:hover .np-featured-img { transform: scale(1.04); }
          .np-featured-img-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 60%);
          }
          .np-featured-badge {
            position: absolute; top: 14px; left: 14px;
            background: var(--accent); color: #fff;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em;
            padding: 4px 10px; border-radius: 6px; text-transform: uppercase;
          }
          .np-featured-body {
            padding: 2rem 2rem 1.75rem;
            display: flex; flex-direction: column;
          }
          .np-featured-source {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
            margin-bottom: 0.75rem;
          }
          .np-featured-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(1.15rem, 2.5vw, 1.65rem);
            font-weight: 700; line-height: 1.3;
            color: var(--text); margin-bottom: 0.9rem;
            flex: 1;
          }
          .np-featured-title a { color: inherit; }
          .np-featured-title a:hover { color: var(--accent); }
          .np-featured-desc {
            font-size: 0.83rem; color: var(--text2); line-height: 1.7;
            margin-bottom: 1.4rem;
            display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
          }
          .np-featured-meta {
            display: flex; align-items: center; gap: 10px;
            padding-top: 1.1rem; border-top: 1px solid var(--border);
            font-size: 0.72rem; color: var(--text3);
            font-family: 'JetBrains Mono', monospace;
          }
          .np-featured-author {
            display: flex; align-items: center; gap: 6px;
          }
          .np-featured-avatar {
            width: 24px; height: 24px; border-radius: 50%;
            background: var(--bg3); border: 1px solid var(--border2);
            font-size: 0.65rem; color: var(--accent);
            display: flex; align-items: center; justify-content: center;
          }
          .np-featured-time { margin-left: auto; }
          .np-featured-read-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: var(--accent); border: none; color: #fff;
            font-size: 0.76rem; font-weight: 600;
            padding: 8px 18px; border-radius: var(--r-sm);
            text-decoration: none; margin-top: 1rem;
            align-self: flex-start;
            transition: opacity var(--transition), transform var(--transition);
          }
          .np-featured-read-btn:hover { opacity: 0.86; transform: translateX(2px); }

          /* ── Grid / List ── */
          .np-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 1.2rem;
          }
          .np-list {
            display: flex; flex-direction: column; gap: 0;
          }

          /* ── Section label ── */
          .np-section-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
            color: var(--text3); margin-bottom: 1.2rem;
            display: flex; align-items: center; gap: 10px;
          }
          .np-section-label::after {
            content: ''; flex: 1; height: 1px; background: var(--border);
          }

          /* ── Error ── */
          .np-error {
            display: flex; flex-direction: column; align-items: center;
            padding: 6rem 2rem; text-align: center; gap: 1rem;
          }
          .np-error-emoji { font-size: 3.5rem; }
          .np-error-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem; color: var(--text);
          }
          .np-error-msg  { font-size: 0.84rem; color: var(--text3); max-width: 340px; line-height: 1.65; }
          .np-error-retry {
            background: var(--accent); border: none; color: #fff;
            font-size: 0.82rem; font-weight: 600;
            padding: 9px 22px; border-radius: var(--r-sm);
            transition: opacity var(--transition);
          }
          .np-error-retry:hover { opacity: 0.82; }

          /* ── End message ── */
          .np-end {
            text-align: center; padding: 3rem 1rem;
            font-size: 0.72rem; color: var(--text3);
            font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em;
          }
          .np-end::before, .np-end::after {
            content: ''; display: inline-block;
            width: 36px; height: 1px; background: var(--border2);
            vertical-align: middle; margin: 0 12px;
          }

          /* Responsive */
          @media (max-width: 760px) {
            .np-featured { grid-template-columns: 1fr; }
            .np-featured-img-wrap { min-height: 220px; }
            .np-hero-inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
          }
        `}</style>

        <div className="np">
          {/* ── Hero ── */}
          <div className="np-hero">
            <div className="np-hero-inner">
              <div className="np-hero-icon">{meta.emoji}</div>
              <div>
                <div className="np-hero-tag">{meta.label}</div>
                <h1 className="np-hero-title">{meta.label}</h1>
                <p className="np-hero-desc">{meta.desc}</p>
                <div className="np-hero-stats">
                  {totalResults > 0 && (
                    <div className="np-stat"><strong>{totalResults.toLocaleString()}</strong> articles</div>
                  )}
                  <div className="np-stat"><strong>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="np-toolbar">
            <span className="np-toolbar-label">Sort:</span>
            <button
              className={`np-sort-btn${sortBy === 'newest' ? ' on' : ''}`}
              onClick={() => this.setState({ sortBy: 'newest' })}
            >↓ Newest</button>
            <button
              className={`np-sort-btn${sortBy === 'oldest' ? ' on' : ''}`}
              onClick={() => this.setState({ sortBy: 'oldest' })}
            >↑ Oldest</button>

            <div className="np-spacer" />

            <span className="np-count">
              {sorted.length > 0 ? `${sorted.length} of ${totalResults.toLocaleString()} loaded` : ''}
            </span>

            <button
              className={`np-view-btn${viewMode === 'grid' ? ' on' : ''}`}
              onClick={() => this.setState({ viewMode: 'grid' })}
              title="Grid view"
            >⊞</button>
            <button
              className={`np-view-btn${viewMode === 'list' ? ' on' : ''}`}
              onClick={() => this.setState({ viewMode: 'list' })}
              title="List view"
            >☰</button>
          </div>

          {/* ── Body ── */}
          <div className="np-body">
            {/* Initial load */}
            {loading && sorted.length === 0 && <Spinner />}

            {/* Error */}
            {error && (
              <div className="np-error">
                <span className="np-error-emoji">⚠️</span>
                <div className="np-error-title">Couldn't load stories</div>
                <p className="np-error-msg">{error}</p>
                <button className="np-error-retry" onClick={() => this.fetchNews(1, true)}>
                  Try again
                </button>
              </div>
            )}

            {!error && sorted.length > 0 && (
              <InfiniteScroll
                dataLength={sorted.length}
                next={this.fetchMore}
                hasMore={this.state.articles.length < totalResults}
                loader={<Spinner />}
                endMessage={<div className="np-end">You're all caught up</div>}
              >
                {/* Featured card — only in grid mode */}
                {viewMode === 'grid' && featured && (
                  <>
                    <div className="np-section-label">Featured Story</div>
                    <FeaturedCard article={featured} accentColor={meta.color} toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} />
                  </>
                )}

                {viewMode === 'grid' && rest.length > 0 && (
                  <div className="np-section-label" style={{ marginTop: '2rem' }}>Latest Stories</div>
                )}

                <div className={viewMode === 'grid' ? 'np-grid' : 'np-list'}>
                  {(viewMode === 'grid' ? rest : sorted).map((article, idx) => (
                    <NewsItems
                      key={article.url || idx}
                      title={article.title}
                      description={article.description}
                      imageurl={article.urlToImage}
                      newsurl={article.url}
                      author={article.author}
                      date={article.publishedAt}
                      source={article.source?.name}
                      accentColor={meta.color}
                      bookmarked={isBookmarked ? isBookmarked(article.url) : false}
                      onBookmark={() => toggleBookmark && toggleBookmark(article)}
                      listMode={viewMode === 'list'}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
      </>
    );
  }
}

/* ── Featured Card ─────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

class FeaturedCard extends Component {
  constructor(props) {
    super(props);
    this.state = { imgErr: false };
  }
  render() {
    const { article, accentColor, toggleBookmark, isBookmarked } = this.props;
    const { imgErr } = this.state;
    const fallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80';
    const imgSrc   = (!article.urlToImage || imgErr) ? fallback : article.urlToImage;
    const bm       = isBookmarked ? isBookmarked(article.url) : false;
    const author   = article.author && article.author.length < 60 ? article.author : 'Staff Reporter';

    return (
      <div className="np-featured">
        <div className="np-featured-img-wrap">
          <img
            src={imgSrc} alt={article.title}
            className="np-featured-img"
            onError={() => this.setState({ imgErr: true })}
            loading="lazy"
          />
          <div className="np-featured-img-overlay" />
          <span className="np-featured-badge">⭐ Featured</span>
        </div>
        <div className="np-featured-body">
          <div className="np-featured-source" style={{ color: accentColor }}>
            {article.source?.name || 'News Source'}
          </div>
          <h2 className="np-featured-title">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </h2>
          {article.description && (
            <p className="np-featured-desc">{article.description}</p>
          )}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="np-featured-read-btn"
          >
            Read Full Story →
          </a>
          <div className="np-featured-meta">
            <div className="np-featured-author">
              <div className="np-featured-avatar">
                {author.charAt(0).toUpperCase()}
              </div>
              {author}
            </div>
            <span className="np-featured-time">{timeAgo(article.publishedAt)}</span>
            <button
              onClick={() => toggleBookmark && toggleBookmark(article)}
              title={bm ? 'Remove bookmark' : 'Bookmark'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', color: bm ? accentColor : 'var(--text3)',
                transition: 'color 0.2s, transform 0.2s', marginLeft: 4,
              }}
            >
              {bm ? '🔖' : '🏷️'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
