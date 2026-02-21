import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    return (
      <>
        <style>{`
          .sp {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 4rem 1rem; gap: 1.1rem;
          }
          .sp-ring {
            width: 40px; height: 40px;
            border-radius: 50%;
            border: 2.5px solid var(--border2);
            border-top-color: var(--accent);
            animation: sp-turn 0.7s linear infinite;
          }
          @keyframes sp-turn { to { transform: rotate(360deg); } }
          .sp-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem; letter-spacing: 0.1em;
            text-transform: uppercase; color: var(--text3);
          }
        `}</style>
        <div className="sp" role="status" aria-label="Loading">
          <div className="sp-ring" />
          <span className="sp-label">Loading…</span>
        </div>
      </>
    );
  }
}
