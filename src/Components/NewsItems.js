import React, { Component } from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=80';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function readTime(text = '') {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default class NewsItems extends Component {
  constructor(props) {
    super(props);
    this.state = { imgErr: false, shareOpen: false };
  }

  handleImgErr = () => this.setState({ imgErr: true });

  handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: this.props.title, url: this.props.newsurl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(this.props.newsurl || '');
      this.setState({ shareOpen: true });
      setTimeout(() => this.setState({ shareOpen: false }), 1800);
    }
  };

  render() {
    const {
      title, description, imageurl, newsurl,
      author, date, source,
      accentColor = '#c9973a',
      bookmarked  = false,
      onBookmark,
      listMode    = false,
    } = this.props;
    const { imgErr, shareOpen } = this.state;

    const imgSrc      = (!imageurl || imgErr) ? FALLBACK : imageurl;
    const ago         = timeAgo(date);
    const mins        = readTime((description || '') + ' ' + (title || ''));
    const cleanAuthor = author && author.length < 60 ? author : 'Staff Reporter';

    if (listMode) {
      return (
        <>
          <style>{`
            .ni-list-item {
              display: flex; gap: 1rem; align-items: flex-start;
              padding: 1.1rem 0;
              border-bottom: 1px solid var(--border);
              transition: background var(--transition);
            }
            .ni-list-item:first-child { border-top: 1px solid var(--border); }
            .ni-list-thumb {
              width: 110px; height: 76px; object-fit: cover;
              border-radius: var(--r-sm); flex-shrink: 0;
              background: var(--bg3);
            }
            .ni-list-body { flex: 1; min-width: 0; }
            .ni-list-source {
              font-family: 'JetBrains Mono', monospace;
              font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
              margin-bottom: 0.35rem;
            }
            .ni-list-title {
              font-family: 'Playfair Display', serif;
              font-size: 0.97rem; font-weight: 700; line-height: 1.35;
              color: var(--text); margin-bottom: 0.3rem;
              display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
            }
            .ni-list-title a { color: inherit; }
            .ni-list-title a:hover { color: var(--accent); }
            .ni-list-meta {
              display: flex; align-items: center; gap: 10px;
              font-size: 0.68rem; color: var(--text3);
              font-family: 'JetBrains Mono', monospace; flex-wrap: wrap;
            }
            .ni-list-actions {
              display: flex; gap: 6px; align-items: center; flex-shrink: 0; margin-top: 2px;
            }
            .ni-action-btn {
              background: none; border: none; padding: 6px;
              font-size: 0.95rem; cursor: pointer; color: var(--text3);
              transition: color var(--transition), transform var(--transition);
              border-radius: 6px;
            }
            .ni-action-btn:hover { transform: scale(1.18); }
            .ni-action-btn.bm-on { color: var(--accent); }
          `}</style>

          <div className="ni-list-item">
            <img
              src={imgSrc} alt={title}
              className="ni-list-thumb"
              onError={this.handleImgErr}
              loading="lazy"
            />
            <div className="ni-list-body">
              <div className="ni-list-source" style={{ color: accentColor }}>
                {source}
              </div>
              <h3 className="ni-list-title">
                <a href={newsurl} target="_blank" rel="noopener noreferrer">{title}</a>
              </h3>
              <div className="ni-list-meta">
                <span>{cleanAuthor}</span>
                <span>·</span>
                <span>{ago}</span>
                <span>·</span>
                <span>{mins} min read</span>
              </div>
            </div>
            <div className="ni-list-actions">
              <button
                className={`ni-action-btn${bookmarked ? ' bm-on' : ''}`}
                onClick={(e) => { e.preventDefault(); onBookmark && onBookmark(); }}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {bookmarked ? '🔖' : '🏷️'}
              </button>
              <button
                className="ni-action-btn"
                onClick={this.handleShare}
                title="Share"
              >
                {shareOpen ? '✅' : '↗'}
              </button>
            </div>
          </div>
        </>
      );
    }

    /* ── Grid Card ── */
    return (
      <>
        <style>{`
          .ni {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--r-md);
            overflow: hidden;
            display: flex; flex-direction: column;
            transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
            position: relative;
          }
          .ni:hover {
            transform: translateY(-5px);
            border-color: var(--border2);
            box-shadow: var(--shadow-md);
          }

          /* Image */
          .ni-img-wrap {
            position: relative; overflow: hidden;
            aspect-ratio: 16/9; background: var(--bg3); flex-shrink: 0;
          }
          .ni-img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.45s ease;
          }
          .ni:hover .ni-img { transform: scale(1.05); }
          .ni-img-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 52%);
          }
          .ni-source-badge {
            position: absolute; top: 10px; right: 10px;
            background: rgba(0,0,0,0.72); backdrop-filter: blur(6px);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 6px; padding: 3px 9px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.58rem; color: #ccc; letter-spacing: 0.07em; text-transform: uppercase;
            max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          }
          .ni-img-footer {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 8px 12px;
            display: flex; justify-content: space-between; align-items: center;
          }
          .ni-time-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem; color: rgba(255,255,255,0.65);
          }
          .ni-read-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.58rem; color: rgba(255,255,255,0.5);
          }

          /* Body */
          .ni-body {
            padding: 1.1rem 1.15rem 1.15rem;
            display: flex; flex-direction: column; flex: 1;
          }
          .ni-title {
            font-family: 'Playfair Display', serif;
            font-size: 1rem; font-weight: 700; line-height: 1.38;
            color: var(--text); margin-bottom: 0.6rem;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          }
          .ni-title a { color: inherit; transition: color var(--transition); }
          .ni-title a:hover { color: var(--accent); }
          .ni-desc {
            font-size: 0.79rem; color: var(--text2); line-height: 1.68;
            flex: 1; margin-bottom: 1rem;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          }

          /* Footer */
          .ni-footer {
            display: flex; align-items: center; justify-content: space-between;
            padding-top: 0.8rem; border-top: 1px solid var(--border); gap: 8px;
          }
          .ni-author {
            display: flex; align-items: center; gap: 7px; min-width: 0;
          }
          .ni-avatar {
            width: 26px; height: 26px; border-radius: 50%;
            background: var(--bg3); border: 1px solid var(--border2);
            display: flex; align-items: center; justify-content: center;
            font-size: 0.68rem; font-weight: 700; flex-shrink: 0;
          }
          .ni-author-name {
            font-size: 0.7rem; color: var(--text2); font-weight: 500;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;
          }
          .ni-actions {
            display: flex; gap: 4px; align-items: center; flex-shrink: 0;
          }
          .ni-btn {
            background: none; border: none; padding: 5px 7px;
            font-size: 0.88rem; color: var(--text3);
            border-radius: 6px; cursor: pointer;
            transition: color var(--transition), background var(--transition), transform var(--transition);
          }
          .ni-btn:hover { background: var(--bg3); transform: scale(1.15); }
          .ni-btn.bm-on  { color: var(--accent); }
          .ni-btn.cp-done { color: var(--green); }
          .ni-read-link {
            display: inline-flex; align-items: center; gap: 5px;
            background: none; border: 1px solid var(--border2);
            color: var(--text2); font-size: 0.7rem; font-weight: 500;
            padding: 5px 12px; border-radius: var(--r-sm);
            text-decoration: none; flex-shrink: 0;
            transition: color var(--transition), border-color var(--transition), background var(--transition);
          }
          .ni-read-link:hover {
            color: var(--accent); border-color: var(--accent);
            background: var(--accent-lite);
          }
          .ni-read-link svg { transition: transform var(--transition); }
          .ni-read-link:hover svg { transform: translateX(3px); }
        `}</style>

        <article className="ni">
          <div className="ni-img-wrap">
            <img
              src={imgSrc} alt={title || 'News'}
              className="ni-img"
              onError={this.handleImgErr}
              loading="lazy"
            />
            <div className="ni-img-overlay" />
            {source && <span className="ni-source-badge">{source}</span>}
            <div className="ni-img-footer">
              {ago  && <span className="ni-time-badge">{ago}</span>}
              <span className="ni-read-badge">{mins} min read</span>
            </div>
          </div>

          <div className="ni-body">
            <h2 className="ni-title">
              <a href={newsurl} target="_blank" rel="noopener noreferrer">
                {title || 'Untitled Story'}
              </a>
            </h2>
            {description && <p className="ni-desc">{description}</p>}

            <div className="ni-footer">
              <div className="ni-author">
                <div className="ni-avatar" style={{ color: accentColor }}>
                  {cleanAuthor.charAt(0).toUpperCase()}
                </div>
                <span className="ni-author-name">{cleanAuthor}</span>
              </div>

              <div className="ni-actions">
                {/* Bookmark */}
                <button
                  className={`ni-btn${bookmarked ? ' bm-on' : ''}`}
                  onClick={(e) => { e.preventDefault(); onBookmark && onBookmark(); }}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {bookmarked ? '🔖' : '🏷️'}
                </button>

                {/* Share / Copy */}
                <button
                  className={`ni-btn${shareOpen ? ' cp-done' : ''}`}
                  onClick={this.handleShare}
                  title="Share article"
                >
                  {shareOpen ? '✅' : '↗'}
                </button>

                {/* Read */}
                <a
                  href={newsurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ni-read-link"
                >
                  Read
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </article>
      </>
    );
  }
}
