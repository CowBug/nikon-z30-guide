import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawData = fs.readFileSync(path.join(__dirname, 'tips_data.json'), 'utf8');
const data = JSON.parse(rawData);
const totalTips = data.tips.length;

const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#090a0f">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>尼康 Nikon Z30 双镜头摄影实战典藏馆（8 卷典藏 · ${totalTips} 讲全集）</title>
  <style>
    :root {
      --bg-canvas: #090a0f;
      --bg-surface: #11131c;
      --bg-card: #181b26;
      --bg-card-hover: #1f2333;
      --bg-sheet: #141722;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-focus: rgba(255, 209, 0, 0.5);
      --nikon-gold: #ffd100;
      --nikon-amber: #f59e0b;
      --nikon-glow: rgba(255, 209, 0, 0.18);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --book-radius: 12px;
      --shadow-book: 0 16px 36px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08);
      --shadow-hover: 0 24px 48px -10px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 209, 0, 0.16);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* ─── Global Topbar ─── */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(17, 19, 28, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      transition: all 0.2s ease;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .brand-emblem {
      background: var(--nikon-gold);
      color: #000;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.5px;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .topbar-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .topbar-badge {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
      padding: 2px 7px;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
    }

    .topbar-center {
      flex: 1;
      max-width: 500px;
      position: relative;
    }

    .search-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 8px 36px 8px 38px;
      font-size: 13px;
      color: var(--text-main);
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--nikon-gold);
      box-shadow: 0 0 16px var(--nikon-glow);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--text-dim);
      pointer-events: none;
    }

    .search-clear {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 14px;
      cursor: pointer;
      display: none;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .topbar-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .topbar-btn:hover, .topbar-btn.active {
      background: rgba(255, 209, 0, 0.12);
      border-color: var(--nikon-gold);
      color: var(--nikon-gold);
    }

    .btn-text-full { display: inline; }
    .btn-text-mobile { display: none; }

    /* ─── Mode Container ─── */
    .view-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px;
      transition: padding 0.2s ease;
    }

    /* ══════════════════════════════════════════════════════════════
       1. BOOKSHELF VIEW (典藏书架总览)
       ══════════════════════════════════════════════════════════════ */
    #bookshelfView {
      display: block;
    }

    .shelf-hero {
      background: radial-gradient(circle at 80% 20%, rgba(255, 209, 0, 0.08) 0%, transparent 60%),
                  linear-gradient(180deg, rgba(25, 28, 40, 0.6) 0%, rgba(17, 19, 28, 0.3) 100%);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 30px 34px;
      margin-bottom: 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      position: relative;
      overflow: hidden;
    }

    .hero-meta h1 {
      font-size: 25px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .hero-meta h1 span {
      color: var(--nikon-gold);
    }

    .hero-meta p {
      font-size: 14px;
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.7;
    }

    .hero-stats {
      display: flex;
      gap: 16px;
      flex-shrink: 0;
    }

    .stat-pill {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 12px 18px;
      text-align: center;
      min-width: 90px;
    }

    .stat-num {
      font-size: 22px;
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--nikon-gold);
    }

    .stat-label {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .filter-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    .pill-btn.active {
      background: var(--nikon-gold);
      color: #000;
      font-weight: 700;
      border-color: var(--nikon-gold);
    }

    .last-read-card {
      background: rgba(255, 209, 0, 0.06);
      border: 1px solid rgba(255, 209, 0, 0.3);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      color: var(--nikon-gold);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .last-read-card:hover {
      background: rgba(255, 209, 0, 0.15);
      transform: translateY(-1px);
    }

    /* ─── 3D Bookshelf Grid ─── */
    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bookshelf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
      gap: 20px;
      margin-bottom: 38px;
    }

    /* Book Volume Card */
    .book-volume-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--book-radius);
      padding: 22px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 240px;
      box-shadow: var(--shadow-book);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .book-volume-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: var(--vol-accent, var(--nikon-gold));
      box-shadow: 2px 0 8px rgba(0,0,0,0.4);
    }

    .book-volume-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 6px;
      width: 12px;
      height: 100%;
      background: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%);
      pointer-events: none;
    }

    .book-volume-card:hover {
      transform: translateY(-5px);
      border-color: var(--vol-accent, var(--nikon-gold));
      box-shadow: var(--shadow-hover);
    }

    .bvc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
      padding-left: 10px;
    }

    .bvc-vol-tag {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--vol-accent, var(--nikon-gold));
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .bvc-badge {
      font-size: 11px;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-subtle);
      color: #fff;
      padding: 3px 8px;
      border-radius: 12px;
    }

    .bvc-body {
      padding-left: 10px;
      flex: 1;
    }

    .bvc-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bvc-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .bvc-footer {
      padding-left: 10px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding-top: 12px;
    }

    .bvc-progress {
      font-size: 11px;
      color: var(--text-dim);
    }

    .bvc-open-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .book-volume-card:hover .bvc-open-btn {
      background: var(--vol-accent, var(--nikon-gold));
      color: #000;
      border-color: var(--vol-accent, var(--nikon-gold));
      font-weight: 700;
    }

    /* ─── Fast Index Grid ─── */
    .quick-index-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 16px;
    }

    .tip-index-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .tip-index-card:hover {
      border-color: rgba(255, 209, 0, 0.4);
      background: var(--bg-card-hover);
      transform: translateY(-2px);
    }

    .tic-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .tic-num {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      color: #000;
      background: var(--nikon-gold);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .tic-tags {
      display: flex;
      gap: 6px;
      font-size: 11px;
    }

    .tag-bubble {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .tic-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 6px;
      line-height: 1.5;
    }

    .tic-summary {
      font-size: 12px;
      color: var(--text-dim);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
    }

    /* ══════════════════════════════════════════════════════════════
       2. READING ROOM VIEW (沉浸式精装书房阅读器)
       ══════════════════════════════════════════════════════════════ */
    #readerView {
      display: none;
    }

    .reader-layout {
      display: grid;
      grid-template-columns: 330px 1fr;
      gap: 24px;
      align-items: start;
    }

    /* Left Sidebar: TOC */
    .reader-toc-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      position: sticky;
      top: 76px;
      max-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .toc-header {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(255, 255, 255, 0.02);
    }

    .toc-mobile-toggle-btn {
      display: none;
      width: 100%;
      background: rgba(255, 209, 0, 0.1);
      border: 1px solid rgba(255, 209, 0, 0.3);
      color: var(--nikon-gold);
      font-size: 13px;
      font-weight: 700;
      padding: 10px 14px;
      border-radius: 8px;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      margin-bottom: 10px;
    }

    .toc-vol-selector {
      width: 100%;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--border-subtle);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 12px;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
      margin-bottom: 8px;
    }

    .toc-vol-selector option {
      background: var(--bg-surface);
      color: #fff;
    }

    .toc-vol-info {
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      justify-content: space-between;
    }

    .toc-list {
      list-style: none;
      overflow-y: auto;
      flex: 1;
      padding: 8px;
    }

    .toc-item {
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid transparent;
    }

    .toc-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    .toc-item.active {
      background: rgba(255, 209, 0, 0.1);
      border-color: rgba(255, 209, 0, 0.4);
      color: var(--nikon-gold);
    }

    .toc-num {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      color: var(--text-dim);
      min-width: 24px;
    }

    .toc-item.active .toc-num {
      color: var(--nikon-gold);
    }

    .toc-text {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .toc-lens-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-dim);
      flex-shrink: 0;
    }

    .toc-lens-dot.wide { background: #34d399; }
    .toc-lens-dot.tele { background: #fb923c; }
    .toc-lens-dot.both { background: #38bdf8; }

    /* Right Main Book Sheet */
    .reader-sheet-panel {
      background: var(--bg-sheet);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
      padding: 38px 44px;
      min-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      touch-action: pan-y pinch-zoom;
    }

    /* Sheet Header */
    .sheet-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 16px;
      flex-wrap: wrap;
    }

    .sm-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sheet-id-badge {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 900;
      background: var(--nikon-gold);
      color: #000;
      padding: 3px 10px;
      border-radius: 6px;
    }

    .sheet-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
    }

    .sheet-pill.pill-lens {
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.3);
      background: rgba(56, 189, 248, 0.08);
    }

    .sheet-pill.pill-mount {
      color: #34d399;
      border-color: rgba(52, 211, 153, 0.3);
      background: rgba(52, 211, 153, 0.08);
    }

    .sm-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-action {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-action:hover, .btn-action.active {
      background: rgba(255, 209, 0, 0.12);
      border-color: var(--nikon-gold);
      color: var(--nikon-gold);
    }

    /* Sheet Typography */
    .sheet-title {
      font-size: 23px;
      font-weight: 800;
      color: #fff;
      line-height: 1.4;
      margin-bottom: 16px;
    }

    .sheet-abstract {
      background: rgba(0, 0, 0, 0.3);
      border-left: 4px solid var(--nikon-gold);
      border-radius: 0 8px 8px 0;
      padding: 16px 20px;
      font-size: 14px;
      color: #e2e8f0;
      line-height: 1.7;
      margin-bottom: 30px;
    }

    /* Step Section */
    .block-section {
      margin-bottom: 30px;
    }

    .block-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--nikon-gold);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }

    .step-flow {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step-card {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border-subtle);
      border-left: 3px solid rgba(255, 255, 255, 0.15);
      border-radius: 0 8px 8px 0;
      padding: 12px 16px;
      font-size: 13.5px;
      color: var(--text-main);
      line-height: 1.6;
    }

    .step-card code {
      font-family: var(--font-mono);
      font-size: 11px;
      background: rgba(255, 209, 0, 0.12);
      color: var(--nikon-gold);
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid rgba(255, 209, 0, 0.25);
    }

    /* Parameter Table */
    .param-box {
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      overflow-x: auto;
      background: rgba(0, 0, 0, 0.3);
      -webkit-overflow-scrolling: touch;
    }

    .param-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }

    .param-table th {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-muted);
      font-weight: 700;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-subtle);
      white-space: nowrap;
    }

    .param-table td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      color: var(--text-main);
    }

    .param-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .param-key {
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
    }

    .param-val {
      font-family: var(--font-mono);
      color: var(--nikon-gold);
      font-weight: 600;
      white-space: nowrap;
    }

    /* Pitfall Warning */
    .pitfall-callout {
      background: linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, rgba(0, 0, 0, 0.2) 100%);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-left: 4px solid #ef4444;
      border-radius: 8px;
      padding: 16px 18px;
      margin-top: 24px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .pitfall-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .pitfall-content-title {
      font-size: 13px;
      font-weight: 800;
      color: #f87171;
      margin-bottom: 4px;
    }

    .pitfall-content-text {
      font-size: 13px;
      color: #e2e8f0;
      line-height: 1.6;
    }

    /* Sheet Footer: Page Turners */
    .sheet-pager {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 22px;
      margin-top: 36px;
      gap: 12px;
    }

    .pager-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .pager-btn:hover:not(:disabled) {
      background: var(--nikon-gold);
      color: #000;
      border-color: var(--nikon-gold);
    }

    .pager-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .pager-progress {
      text-align: center;
      flex: 1;
    }

    .progress-text {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .progress-bar-wrap {
      width: 130px;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 auto;
    }

    .progress-bar-fill {
      height: 100%;
      background: var(--nikon-gold);
      width: 0%;
      transition: width 0.3s ease;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e2230;
      border: 1px solid var(--nikon-gold);
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 13px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* ══════════════════════════════════════════════════════════════
       📱 MOBILE PHONE RESPONSIVE STYLES (< 768px)
       ══════════════════════════════════════════════════════════════ */
    @media (max-width: 768px) {
      .topbar {
        padding: 10px 14px;
        flex-wrap: wrap;
        gap: 10px;
      }

      .topbar-left {
        gap: 8px;
      }

      .topbar-title {
        font-size: 15px;
      }

      .topbar-badge {
        display: none;
      }

      .topbar-center {
        order: 3;
        max-width: 100%;
        width: 100%;
      }

      .search-input {
        padding: 7px 32px 7px 34px;
        font-size: 12.5px;
      }

      .topbar-right {
        gap: 6px;
      }

      .topbar-btn {
        padding: 6px 10px;
        font-size: 11.5px;
      }

      .btn-text-full { display: none; }
      .btn-text-mobile { display: inline; }

      .view-container {
        padding: 14px 12px 85px; /* Extra bottom padding for thumb bar */
      }

      /* Hero on phone */
      .shelf-hero {
        padding: 20px 18px;
        margin-bottom: 18px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .hero-meta h1 {
        font-size: 20px;
        line-height: 1.35;
      }

      .hero-meta p {
        font-size: 13px;
        line-height: 1.6;
      }

      .hero-stats {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .stat-pill {
        padding: 10px 12px;
        min-width: 0;
      }

      .stat-num {
        font-size: 20px;
      }

      /* Filter Pills on phone (Horizontal touch swipe) */
      .filter-bar {
        margin-bottom: 16px;
        gap: 10px;
      }

      .filter-pills {
        width: 100%;
        overflow-x: auto;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 6px;
        scrollbar-width: none;
      }

      .filter-pills::-webkit-scrollbar {
        display: none;
      }

      .pill-btn {
        flex-shrink: 0;
        padding: 6px 12px;
        font-size: 12px;
      }

      .last-read-card {
        width: 100%;
        justify-content: center;
        padding: 8px 12px;
        font-size: 12px;
      }

      /* Grids on phone */
      .bookshelf-grid {
        grid-template-columns: 1fr;
        gap: 14px;
        margin-bottom: 28px;
      }

      .book-volume-card {
        min-height: 200px;
        padding: 18px;
      }

      .quick-index-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      /* Reader View on Phone */
      .reader-layout {
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .reader-toc-panel {
        position: static;
        max-height: none;
        border-radius: 12px;
      }

      .toc-header {
        padding: 14px;
      }

      /* On mobile, TOC starts collapsible */
      .toc-mobile-toggle-btn {
        display: flex;
      }

      .toc-list {
        display: none; /* Collapsed by default on phone */
        max-height: 260px;
      }

      .toc-list.mobile-expanded {
        display: block;
      }

      .reader-sheet-panel {
        padding: 20px 14px;
        border-radius: 12px;
        min-height: auto;
      }

      .sheet-meta-bar {
        margin-bottom: 16px;
        padding-bottom: 12px;
        gap: 10px;
      }

      .sheet-title {
        font-size: 19px;
        line-height: 1.4;
        margin-bottom: 14px;
      }

      .sheet-abstract {
        padding: 14px 16px;
        font-size: 13px;
        margin-bottom: 22px;
      }

      .block-section {
        margin-bottom: 24px;
      }

      .step-card {
        padding: 10px 12px;
        font-size: 13px;
      }

      .param-table {
        font-size: 12px;
      }

      .param-table th, .param-table td {
        padding: 8px 10px;
      }

      .pitfall-callout {
        padding: 12px 14px;
        margin-top: 18px;
      }

      /* Sticky Bottom Pager on Mobile */
      .sheet-pager {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 95;
        background: rgba(17, 19, 28, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 1px solid var(--border-subtle);
        padding: 10px 16px max(10px, env(safe-area-inset-bottom));
        margin-top: 0;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
      }

      .pager-btn {
        padding: 8px 14px;
        font-size: 12px;
      }

      .progress-bar-wrap {
        width: 90px;
      }

      .toast {
        bottom: 76px;
        right: 16px;
        left: 16px;
        text-align: center;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Bar -->
  <header class="topbar">
    <div class="topbar-left" onclick="showBookshelfView()">
      <div class="brand-emblem">NIKON Z30</div>
      <div class="topbar-title">
        <span>摄影典藏馆</span>
        <span class="topbar-badge">8 卷 · ${totalTips} 讲</span>
      </div>
    </div>

    <div class="topbar-center">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="globalSearch" class="search-input" placeholder="全局搜索技巧、焦段、快门参数...">
        <button id="clearSearchBtn" class="search-clear" onclick="clearSearch()">✕</button>
      </div>
    </div>

    <div class="topbar-right">
      <button class="topbar-btn" id="btnBookmarkShelf" onclick="filterByBookmarks()">
        <span>⭐</span>
        <span class="btn-text-full">我的书签 (<span id="bookmarkCount">0</span>)</span>
        <span class="btn-text-mobile"><span id="bookmarkCountMobile">0</span></span>
      </button>
      <button class="topbar-btn" id="btnToggleView" onclick="toggleShelfOrReader()">
        <span>📖</span>
        <span id="btnToggleViewText">
          <span class="btn-text-full">进入书房阅读器</span>
          <span class="btn-text-mobile">阅读器</span>
        </span>
      </button>
    </div>
  </header>

  <main class="view-container">

    <!-- ══════════════════════════════════════════════════════════════
         VIEW 1: BOOKSHELF OVERVIEW (典藏书架)
         ══════════════════════════════════════════════════════════════ -->
    <section id="bookshelfView">
      <!-- Hero Banner -->
      <div class="shelf-hero">
        <div class="hero-meta">
          <h1>尼康 Nikon Z30 <span>双镜头实战宝典</span></h1>
          <p>
            专为 <strong>16-50mm</strong> 与 <strong>50-250mm</strong> 双镜头量身打造的数字化互动典藏馆。
            已重构为 <strong>8 卷实战分册</strong>，支持手机滑动翻阅、参数速查与书签收藏。
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-pill">
            <div class="stat-num">8</div>
            <div class="stat-label">典藏分卷</div>
          </div>
          <div class="stat-pill">
            <div class="stat-num" id="heroTotalCount">${totalTips}</div>
            <div class="stat-label">实战讲数</div>
          </div>
        </div>
      </div>

      <!-- Filter Row -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button class="pill-btn active" data-filter="all" onclick="setLensFilter('all', this)">全部讲次</button>
          <button class="pill-btn" data-filter="wide" onclick="setLensFilter('wide', this)">16-50mm 广角套头</button>
          <button class="pill-btn" data-filter="tele" onclick="setLensFilter('tele', this)">50-250mm 长焦镜头</button>
          <button class="pill-btn" data-filter="both" onclick="setLensFilter('both', this)">双镜协同 / 操控</button>
        </div>
        <div id="lastReadContainer" style="display: none; width: 100%;">
          <div class="last-read-card" onclick="resumeLastRead()">
            <span>📌 继续阅读：</span>
            <span id="lastReadTitle">#01 深度定制 i 菜单</span>
          </div>
        </div>
      </div>

      <!-- The 8 Books Volumes Grid -->
      <div class="section-title-row">
        <div class="section-title">
          <span>📚</span>
          <span>八大实战典藏分卷</span>
        </div>
      </div>
      <div class="bookshelf-grid" id="volumeCardsGrid">
        <!-- Rendered by JS -->
      </div>

      <!-- Quick Search & Cards Index -->
      <div class="section-title-row" style="margin-top: 32px;">
        <div class="section-title">
          <span>📑</span>
          <span id="cardsIndexTitle">全部 ${totalTips} 讲目录速查索引</span>
        </div>
        <span class="topbar-badge" id="visibleCardsCount">共 ${totalTips} 讲</span>
      </div>
      <div class="quick-index-grid" id="quickIndexGrid">
        <!-- Rendered by JS -->
      </div>
    </section>


    <!-- ══════════════════════════════════════════════════════════════
         VIEW 2: READING ROOM (精装书房阅读器)
         ══════════════════════════════════════════════════════════════ -->
    <section id="readerView">
      <div class="reader-layout">
        <!-- Left Sidebar / Mobile Collapsible: TOC -->
        <aside class="reader-toc-panel">
          <div class="toc-header">
            <button class="toc-mobile-toggle-btn" id="btnToggleMobileToc" onclick="toggleMobileToc()">
              <span>📑 本卷目录速查 (<span id="mobileTocCount">5讲</span>)</span>
              <span id="mobileTocArrow">▼</span>
            </button>
            <select id="tocVolSelector" class="toc-vol-selector" onchange="onSelectVolFromDropdown(this.value)">
              <!-- Options populated by JS -->
            </select>
            <div class="toc-vol-info">
              <span id="tocVolProgress">本卷共 5 讲</span>
              <span style="cursor: pointer; color: var(--nikon-gold); font-weight: 700;" onclick="showBookshelfView()">← 返回书架</span>
            </div>
          </div>
          <ul class="toc-list" id="tocItemsList">
            <!-- Items populated by JS -->
          </ul>
        </aside>

        <!-- Right Main: Reading Sheet (Supports Touch Swiping) -->
        <article class="reader-sheet-panel" id="readerSheetPanel">
          <div>
            <!-- Sheet Meta Bar -->
            <div class="sheet-meta-bar">
              <div class="sm-left">
                <span class="sheet-id-badge" id="sheetId">#01</span>
                <span class="sheet-pill" id="sheetCategory">基础操控卷</span>
                <span class="sheet-pill pill-lens" id="sheetLens">16-50mm / 50-250mm</span>
                <span class="sheet-pill pill-mount" id="sheetMount">手持 / 三脚架</span>
              </div>
              <div class="sm-actions">
                <button class="btn-action" id="btnToggleBookmark" onclick="toggleCurrentBookmark()">
                  <span id="bookmarkStarIcon">☆</span>
                  <span id="bookmarkText">加入书签</span>
                </button>
                <button class="btn-action" onclick="copyCurrentParams()">
                  <span>📋</span>
                  <span>复制参数</span>
                </button>
                <button class="btn-action" onclick="showBookshelfView()">
                  <span>✕ 返回</span>
                </button>
              </div>
            </div>

            <!-- Title & Summary -->
            <h2 class="sheet-title" id="sheetTitle">标题加载中...</h2>
            <div class="sheet-abstract" id="sheetSummary">
              概要加载中...
            </div>

            <!-- Steps Block -->
            <div class="block-section">
              <div class="block-title">
                <span>🛠️</span>
                <span>实战操作流程与菜单路径</span>
              </div>
              <div class="step-flow" id="sheetSteps">
                <!-- Steps rendered by JS -->
              </div>
            </div>

            <!-- Parameters Block -->
            <div class="block-section">
              <div class="block-title">
                <span>📊</span>
                <span>核心实拍参数配方卡</span>
              </div>
              <div class="param-box">
                <table class="param-table">
                  <thead>
                    <tr>
                      <th style="width: 25%;">参数项目</th>
                      <th style="width: 35%;">推荐设定值</th>
                      <th>实战原理与设定理由</th>
                    </tr>
                  </thead>
                  <tbody id="sheetParamsTable">
                    <!-- Params rendered by JS -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pitfall Warning -->
            <div class="pitfall-callout" id="sheetPitfallBox">
              <div class="pitfall-icon">💡</div>
              <div>
                <div class="pitfall-content-title">摄影师避坑要诀与大师级进阶</div>
                <div class="pitfall-content-text" id="sheetPitfallText">
                  避坑指南内容
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Pager (Floating sticky bar on mobile) -->
          <footer class="sheet-pager">
            <button class="pager-btn" id="btnPrevTip" onclick="goPrevTip()">
              <span>◀</span>
              <span>上一讲</span>
            </button>
            <div class="pager-progress">
              <div class="progress-text" id="pagerProgressText">第 1 / ${totalTips} 讲</div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" id="progressBarFill"></div>
              </div>
            </div>
            <button class="pager-btn" id="btnNextTip" onclick="goNextTip()">
              <span>下一讲</span>
              <span>▶</span>
            </button>
          </footer>
        </article>
      </div>
    </section>

  </main>

  <!-- Toast -->
  <div class="toast" id="globalToast">已复制核心实拍参数到剪贴板！</div>

  <!-- Embedded Knowledge Base JSON -->
  <script>
    const DATA = ${rawData};
  </script>

  <!-- Interactive Logic Script -->
  <script>
    // State
    let currentTipId = 1;
    let currentLensFilter = 'all';
    let searchQuery = '';
    let bookmarkSet = new Set(JSON.parse(localStorage.getItem('nikon_bookmarks') || '[]'));
    let lastReadId = parseInt(localStorage.getItem('nikon_last_read') || '1', 10);
    let isMobileTocOpen = false;

    const tipsMap = new Map();
    DATA.tips.forEach(t => tipsMap.set(t.id, t));

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderVolumes();
      renderQuickIndex();
      updateBookmarkUI();
      checkLastRead();
      setupTouchSwipe();

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        if (e.key === 'ArrowLeft') {
          if (document.getElementById('readerView').style.display === 'block') {
            goPrevTip();
          }
        } else if (e.key === 'ArrowRight') {
          if (document.getElementById('readerView').style.display === 'block') {
            goNextTip();
          }
        } else if (e.key === 'Escape') {
          showBookshelfView();
        } else if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
          e.preventDefault();
          document.getElementById('globalSearch').focus();
        }
      });

      // Search Listener
      const searchInput = document.getElementById('globalSearch');
      const clearBtn = document.getElementById('clearSearchBtn');
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        clearBtn.style.display = searchQuery ? 'block' : 'none';
        renderQuickIndex();
      });
    });

    // Touch Swipe Detection for mobile reading
    function setupTouchSwipe() {
      const panel = document.getElementById('readerSheetPanel');
      let touchStartX = 0;
      let touchStartY = 0;

      panel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      panel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Ensure horizontal swipe is dominant and distance > 55px
        if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
          if (diffX < 0) {
            // Swiped left -> Next
            goNextTip();
          } else {
            // Swiped right -> Prev
            goPrevTip();
          }
        }
      }, { passive: true });
    }

    function checkLastRead() {
      const tip = tipsMap.get(lastReadId);
      if (tip) {
        document.getElementById('lastReadContainer').style.display = 'block';
        document.getElementById('lastReadTitle').textContent = '#' + tip.idStr + ' ' + tip.title;
      }
    }

    function resumeLastRead() {
      openReader(lastReadId);
    }

    /* ─── Render 8 Book Volumes ─── */
    function renderVolumes() {
      const container = document.getElementById('volumeCardsGrid');
      container.innerHTML = '';

      const chapKeys = Object.keys(DATA.chapters);
      chapKeys.forEach(ckey => {
        const chap = DATA.chapters[ckey];
        const chapTips = DATA.tips.filter(t => t.chap === ckey);

        const card = document.createElement('div');
        card.className = 'book-volume-card';
        card.style.setProperty('--vol-accent', chap.color);
        card.onclick = () => {
          if (chapTips.length > 0) {
            openReader(chapTips[0].id);
          }
        };

        card.innerHTML = \`
          <div>
            <div class="bvc-header">
              <span class="bvc-vol-tag">\${chap.vol}</span>
              <span class="bvc-badge">\${chapTips.length} 讲实战</span>
            </div>
            <div class="bvc-body">
              <h3 class="bvc-title">\${chap.icon} \${chap.name}</h3>
              <p class="bvc-desc">\${chap.desc}</p>
            </div>
          </div>
          <div class="bvc-footer">
            <span class="bvc-progress">精装手记 · \${chap.id.toUpperCase()}</span>
            <span class="bvc-open-btn">翻开此卷 ➜</span>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    /* ─── Render Quick Index Grid ─── */
    function renderQuickIndex() {
      const container = document.getElementById('quickIndexGrid');
      container.innerHTML = '';

      let filtered = DATA.tips.filter(tip => {
        const matchesLens = (currentLensFilter === 'all' || tip.lens === currentLensFilter || tip.lens === 'both');
        const matchesSearch = !searchQuery || (
          tip.title.toLowerCase().includes(searchQuery) ||
          tip.summary.toLowerCase().includes(searchQuery) ||
          tip.params.some(p => p.val.toLowerCase().includes(searchQuery) || p.key.toLowerCase().includes(searchQuery))
        );
        return matchesLens && matchesSearch;
      });

      document.getElementById('visibleCardsCount').textContent = \`显示 \${filtered.length} / \${DATA.tips.length} 讲\`;

      if (filtered.length === 0) {
        container.innerHTML = \`<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-dim);">
          未找到与 "\${searchQuery}" 相关的技巧，请更换关键词搜索。
        </div>\`;
        return;
      }

      filtered.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'tip-index-card';
        item.onclick = () => openReader(tip.id);

        item.innerHTML = \`
          <div>
            <div class="tic-top">
              <span class="tic-num">#\${tip.idStr}</span>
              <div class="tic-tags">
                <span class="tag-bubble">\${tip.category}</span>
                <span class="tag-bubble">\${tip.lensDesc}</span>
              </div>
            </div>
            <h4 class="tic-title">\${tip.title}</h4>
            <p class="tic-summary">\${tip.summary}</p>
          </div>
        \`;
        container.appendChild(item);
      });
    }

    /* ─── Reader View Logic ─── */
    function openReader(tipId) {
      const tip = tipsMap.get(tipId);
      if (!tip) return;

      currentTipId = tipId;
      lastReadId = tipId;
      localStorage.setItem('nikon_last_read', tipId);

      document.getElementById('bookshelfView').style.display = 'none';
      document.getElementById('readerView').style.display = 'block';

      // Update button text
      const btnSpan = document.getElementById('btnToggleViewText');
      btnSpan.innerHTML = '<span class="btn-text-full">返回典藏书架</span><span class="btn-text-mobile">书架</span>';

      // Update dropdown
      updateVolDropdown(tip.chap);

      // Render TOC for this volume
      renderTocForChapter(tip.chap);

      // Render Reader Sheet
      renderSheetContent(tip);

      // Collapse mobile TOC by default
      closeMobileToc();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showBookshelfView() {
      document.getElementById('bookshelfView').style.display = 'block';
      document.getElementById('readerView').style.display = 'none';

      const btnSpan = document.getElementById('btnToggleViewText');
      btnSpan.innerHTML = '<span class="btn-text-full">进入书房阅读器</span><span class="btn-text-mobile">阅读器</span>';

      checkLastRead();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleShelfOrReader() {
      const isReader = document.getElementById('readerView').style.display === 'block';
      if (isReader) {
        showBookshelfView();
      } else {
        openReader(lastReadId || 1);
      }
    }

    function toggleMobileToc() {
      const list = document.getElementById('tocItemsList');
      const arrow = document.getElementById('mobileTocArrow');
      isMobileTocOpen = !isMobileTocOpen;
      if (isMobileTocOpen) {
        list.classList.add('mobile-expanded');
        arrow.textContent = '▲';
      } else {
        list.classList.remove('mobile-expanded');
        arrow.textContent = '▼';
      }
    }

    function closeMobileToc() {
      const list = document.getElementById('tocItemsList');
      const arrow = document.getElementById('mobileTocArrow');
      isMobileTocOpen = false;
      list.classList.remove('mobile-expanded');
      arrow.textContent = '▼';
    }

    function updateVolDropdown(activeChapId) {
      const sel = document.getElementById('tocVolSelector');
      sel.innerHTML = '';
      Object.keys(DATA.chapters).forEach(ckey => {
        const chap = DATA.chapters[ckey];
        const opt = document.createElement('option');
        opt.value = ckey;
        opt.textContent = \`\${chap.vol} · \${chap.name}\`;
        if (ckey === activeChapId) opt.selected = true;
        sel.appendChild(opt);
      });
    }

    function onSelectVolFromDropdown(chapId) {
      const chapTips = DATA.tips.filter(t => t.chap === chapId);
      if (chapTips.length > 0) {
        openReader(chapTips[0].id);
      }
    }

    function renderTocForChapter(chapId) {
      const container = document.getElementById('tocItemsList');
      container.innerHTML = '';

      const chapTips = DATA.tips.filter(t => t.chap === chapId);
      document.getElementById('tocVolProgress').textContent = \`本卷共 \${chapTips.length} 讲\`;
      document.getElementById('mobileTocCount').textContent = \`\${chapTips.length} 讲\`;

      chapTips.forEach(tip => {
        const li = document.createElement('li');
        li.className = 'toc-item' + (tip.id === currentTipId ? ' active' : '');
        li.onclick = () => {
          openReader(tip.id);
          closeMobileToc();
        };

        li.innerHTML = \`
          <span class="toc-num">#\${tip.idStr}</span>
          <span class="toc-text">\${tip.title}</span>
          <span class="toc-lens-dot \${tip.lens}"></span>
        \`;
        container.appendChild(li);
      });
    }

    function renderSheetContent(tip) {
      document.getElementById('sheetId').textContent = '#' + tip.idStr;
      document.getElementById('sheetCategory').textContent = tip.category;
      document.getElementById('sheetLens').textContent = tip.lensDesc || '通用';
      document.getElementById('sheetMount').textContent = tip.mountDesc || '手持/脚架';
      document.getElementById('sheetTitle').textContent = tip.title;
      document.getElementById('sheetSummary').textContent = tip.summary;

      // Bookmark button state
      const isBookmarked = bookmarkSet.has(tip.id);
      document.getElementById('bookmarkStarIcon').textContent = isBookmarked ? '★' : '☆';
      document.getElementById('bookmarkText').textContent = isBookmarked ? '已收藏' : '加入书签';
      document.getElementById('btnToggleBookmark').classList.toggle('active', isBookmarked);

      // Steps
      const stepsContainer = document.getElementById('sheetSteps');
      stepsContainer.innerHTML = '';
      tip.steps.forEach(s => {
        const div = document.createElement('div');
        div.className = 'step-card';
        div.innerHTML = \`<strong>\${s.strong}</strong>：\${s.text}\`;
        stepsContainer.appendChild(div);
      });

      // Params Table
      const tableBody = document.getElementById('sheetParamsTable');
      tableBody.innerHTML = '';
      tip.params.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td class="param-key">\${p.key}</td>
          <td class="param-val">\${p.val}</td>
          <td>\${p.desc}</td>
        \`;
        tableBody.appendChild(tr);
      });

      // Pitfall
      document.getElementById('sheetPitfallText').textContent = tip.pitfall || '注意安全操作。';

      // Pager
      document.getElementById('pagerProgressText').textContent = \`第 \${tip.id} / \${DATA.tips.length} 讲\`;
      const pct = Math.round((tip.id / DATA.tips.length) * 100);
      document.getElementById('progressBarFill').style.width = pct + '%';

      document.getElementById('btnPrevTip').disabled = (tip.id <= 1);
      document.getElementById('btnNextTip').disabled = (tip.id >= DATA.tips.length);
    }

    function goPrevTip() {
      if (currentTipId > 1) {
        openReader(currentTipId - 1);
      }
    }

    function goNextTip() {
      if (currentTipId < DATA.tips.length) {
        openReader(currentTipId + 1);
      }
    }

    /* ─── Bookmarks & Utilities ─── */
    function toggleCurrentBookmark() {
      if (bookmarkSet.has(currentTipId)) {
        bookmarkSet.delete(currentTipId);
        showToast('已取消该书签');
      } else {
        bookmarkSet.add(currentTipId);
        showToast('已加入我的精选书签 ⭐');
      }
      localStorage.setItem('nikon_bookmarks', JSON.stringify([...bookmarkSet]));
      updateBookmarkUI();
      renderSheetContent(tipsMap.get(currentTipId));
    }

    function updateBookmarkUI() {
      document.getElementById('bookmarkCount').textContent = bookmarkSet.size;
      document.getElementById('bookmarkCountMobile').textContent = bookmarkSet.size;
    }

    function filterByBookmarks() {
      if (bookmarkSet.size === 0) {
        showToast('暂无书签，可在阅读时点击右上角【加入书签】');
        return;
      }
      showBookshelfView();
      searchQuery = '';
      document.getElementById('globalSearch').value = '';

      const container = document.getElementById('quickIndexGrid');
      container.innerHTML = '';
      document.getElementById('cardsIndexTitle').textContent = '⭐ 我的精选书签典藏列表';

      const starred = DATA.tips.filter(t => bookmarkSet.has(t.id));
      document.getElementById('visibleCardsCount').textContent = \`共 \${starred.length} 条书签\`;

      starred.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'tip-index-card';
        item.onclick = () => openReader(tip.id);
        item.innerHTML = \`
          <div>
            <div class="tic-top">
              <span class="tic-num">#\${tip.idStr}</span>
              <div class="tic-tags">
                <span class="tag-bubble">\${tip.category}</span>
                <span class="tag-bubble">\${tip.lensDesc}</span>
              </div>
            </div>
            <h4 class="tic-title">\${tip.title}</h4>
            <p class="tic-summary">\${tip.summary}</p>
          </div>
        \`;
        container.appendChild(item);
      });
      document.getElementById('quickIndexGrid').scrollIntoView({ behavior: 'smooth' });
    }

    function copyCurrentParams() {
      const tip = tipsMap.get(currentTipId);
      if (!tip) return;

      let text = \`【尼康 Z30 实战秘籍 #\${tip.idStr}】\${tip.title}\\n\`;
      text += \`推荐焦段与机位：\${tip.lensDesc} (\${tip.mountDesc})\\n\\n\`;
      text += \`【核心拍摄参数配方】\\n\`;
      tip.params.forEach(p => {
        text += \`- \${p.key}：\${p.val} (\${p.desc})\\n\`;
      });
      text += \`\\n【大师避坑】\${tip.pitfall}\`;

      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制完整参数到剪贴板！可直接粘贴至备忘录或微信');
      }).catch(() => {
        showToast('参数已准备好');
      });
    }

    function showToast(msg) {
      const t = document.getElementById('globalToast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2200);
    }

    function clearSearch() {
      document.getElementById('globalSearch').value = '';
      searchQuery = '';
      document.getElementById('clearSearchBtn').style.display = 'none';
      renderQuickIndex();
    }

    function setLensFilter(type, btn) {
      currentLensFilter = type;
      document.querySelectorAll('.filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderQuickIndex();
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlTemplate, 'utf8');
console.log('Successfully built Mobile-optimized Library edition index.html!');
