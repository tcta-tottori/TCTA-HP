# CLAUDE.md — TCTA-HP 実装規約

鳥取市テニス協会 公式サイト。設計の根拠は `docs/00_全体設計.md`、見た目は `docs/design.md`、文言は `docs/content.md`。実装がこれらと食い違う場合は、実装で握りつぶさず設計書側を直す提案を出すこと。

---

## スタック

- **ビルド工程なしの静的サイト**（HTML + CSS + Vanilla JS + `data/*.json`）
- CMS: **Decap CMS**（`/admin/`、Git Gateway 経由でコミット）
- ホスティング: **Netlify**（ビルドコマンドなし・公開ディレクトリ `.`）
- フレームワーク・ビルドツール・npm 依存を**勝手に導入しない**。移行条件は `docs/00_全体設計.md` §6 に定義済み

---

## 絶対に守ること

1. **大会ステータスを手動フィールドにしない。**
   `entryOpenAt` / `entryCloseAt` / `startDate` / `endDate` と閲覧時刻から `js/status.js` で算出する（7状態: announced / open / closing / closed / draw / live / finished。判定順は `docs/00_全体設計.md` §4）。JSON に `status` フィールドを作らない。

2. **本文16px以上・行間1.9を下回らない。** 会員の年齢層が広い。デザイン都合で縮めない。

3. **アニメーションは `docs/design.md` §6 の3箇所のみ。** 追加しない。GSAP等のライブラリを入れない。`prefers-reduced-motion` を必ず尊重する。

4. **色をハードコードしない。** `css/style.css` 冒頭の CSS カスタムプロパティ（design.md §2 のトークン）だけを使う。`--ball`（オプティックイエロー）は受付中バッジ・主要CTA・現在地のみ。

5. **個人情報をリポジトリに含めない。** 申込データはGoogleフォーム/GAS/スプレッドシート側にのみ存在する。役員の個人連絡先も掲載しない。

6. **文字を画像に載せない。** 要項・ドロー・結果・役員名簿はテキスト/表。画像は写真だけ。原本をそのままコミットし、表示側で調整する。

7. **文言は `docs/content.md` §12 の統一表に従う。**「エントリー」「要項」「ドロー」「締切」。

---

## データ（data/*.json）

- `events.json` … 大会。`slug` / `title` / `fiscalYear` / `category` / `venue` / `startDate` / `endDate` / `entryOpenAt` / `entryCloseAt` / `entryUrl` / `events`（種目配列）/ `outline`（要項HTML）/ `draw` / `results`（表データ）
- `news.json` … お知らせ。`date` / `category`（大会情報/結果/事務連絡/教室/重要）/ `title` / `body` / `image` / `link`
- `results.json` … 年度別結果アーカイブ
- `settings.json` … `siteNotice`（緊急告知バー。空なら非表示）/ `lineUrl` / `contactEmail` / `calendarId`
- 日時は ISO 8601（`2026-08-12T23:59:00+09:00`）。タイムゾーンを省略しない
- ページ側は JSON を読んで描画する。**日々の更新でHTMLを編集させない**

## JS

- Vanilla JS のみ。`js/common.js`（ヘッダー/フッター/ナビ/告知バー/固定CTA）と `js/status.js`（状態算出・純関数）に分離
- `js/status.js` は現在時刻を引数で受け取る純関数にする（テスト可能にするため）。境界値: 締切ちょうど・残り3日ちょうど・開催初日0時・最終日24時
- XSS: JSON 由来の文字列は必ず `escapeHTML()` を通す（要項・結果など意図的にHTMLを許すフィールドは Decap の管理者入力のみとし、その旨コメントを残す）

## CSS

- ブレークポイント: `640px` / `1024px`。モバイルファースト
- セクション間余白はセクション側で一元管理。個別コンポーネントに `margin-top` を書かない
- 角丸4px・罫線1px・グラデーション禁止（design.md §2・§4）

## 画像・パフォーマンス

- ヒーローのみ `loading="eager"` `fetchpriority="high"`。他は `loading="lazy"` `decoding="async"`
- 全 `<img>` に `width` / `height` を出力（CLS < 0.05）
- フォント: サブセット + `font-display: swap`。プリロードは Zen Kaku Gothic New 700 のみ
- 目標: LCP < 2.0s（4G・スマホ）/ Lighthouse Performance 90・Accessibility 95 以上

## 公開・移行

- 旧URL（日本語パス・URLエンコード済み）→新URLの301を `_redirects` に全件記載してから DNS を切り替える
- Netlify: push で自動デプロイ。プレビューは Deploy Preview を使い、役員レビューはプレビューURLで行う

## 作業の進め方

1. 変更前に `docs/` の該当設計を読む
2. 1コミット1目的。コミットメッセージは日本語で可
3. 実装後は 390px / 1440px の両方で表示確認する
