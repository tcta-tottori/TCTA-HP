# 鳥取市テニス協会 公式サイト

ジンドゥーで運用していた旧サイト（https://www.tottori-tenis.net/）のリニューアル版です。

> **再設計（Ver.2）について**
> 複数のAI設計案を突き合わせた再設計を `docs/` に反映しています。
> - 全体設計・設計判断の記録: `docs/00_全体設計.md`
> - デザインガイドライン（水色ベース Ver.2）: `docs/design.md`
> - コンテンツ指示書: `docs/content.md` ／ 実装規約: `CLAUDE.md`
> - **新デザインの回遊サンプル**: `prototype/index.html`（単一ファイル。ブラウザで開くだけで動作）
>
> 以下の説明は初版実装（現行のHTML/CSS/JS）のものです。Ver.2 の見た目への置き換えは
> サンプル確定後に行います。
ビルド不要の静的サイト＋JSONデータ＋管理画面（Decap CMS）という構成で、
**スマートフォンのブラウザだけで日々の更新が完結**するように設計しています。

## 特徴

- **HTMLを触らずに更新できる**
  お知らせ・大会・結果はすべて `data/*.json` にまとまっており、
  ページ側が自動で読み込んで表示します。日々の更新でHTML/CSSの編集は不要です。
- **スマホから更新できる管理画面**
  公開サイトの `/admin/` にアクセスすると管理画面（Decap CMS）が開き、
  スマホからフォーム感覚でお知らせの追加・大会ステータスの変更・写真の掲載ができます。
- **画像が劣化しない**
  アップロードした画像は**原本のままGitリポジトリに保存**され、表示側でCSSにより
  サイズ調整します。ジンドゥーのような端末依存の再圧縮が起きないため、
  どの端末からアップロードしても品質が変わりません。
- **WEBエントリー対応の設計**
  各大会は「受付中/受付前/受付終了/終了」のステータスと申込URL欄を持ち、
  受付中の大会にだけ「エントリーする」ボタンが自動表示されます。
  当面はGoogleフォーム等のURLを設定し、将来専用のエントリーシステムに
  差し替える場合もURLを変えるだけで移行できます。

## ファイル構成

```
index.html            トップページ
news.html             新着情報（カテゴリ絞り込み付き）
tournaments.html      大会案内・エントリー（年間スケジュール）
results.html          大会結果（年度別タブ）
membership.html       協会登録
school.html           テニス教室
about.html            協会について
contact.html          お問い合わせ・LINE
css/style.css         全ページ共通スタイル（デザイントークンは docs/design.md 準拠）
js/common.js          ヘッダー/フッター・ナビ・データ読込などの共通処理
data/news.json        お知らせデータ
data/events.json      大会データ（ステータス・申込URL付き）
data/results.json     大会結果データ（年度別）
assets/img/           ロゴ・装飾SVG
assets/uploads/       管理画面からアップロードした写真の保存先
admin/                管理画面（Decap CMS）
docs/design.md        デザインガイドライン
docs/content.md       コンテンツ指示書
netlify.toml          Netlify設定
```

## 公開手順（Netlify・初回のみ）

1. このリポジトリをGitHubに置いたまま、[Netlify](https://www.netlify.com/) で
   「Add new site → Import an existing project」からこのリポジトリを選択
   （ビルドコマンドは空、Publish directory は `.` のまま）
2. Site configuration → **Identity を有効化**し、Registration を「Invite only」に設定
3. Identity → Services → **Git Gateway を有効化**
4. Identity → 「Invite users」で更新担当者のメールアドレスを招待
5. 招待メールからパスワードを設定すると、`https://＜サイトURL＞/admin/` にログインできます

※ `admin/config.yml` の `branch:` は公開に使うブランチ名（例 `main`）に合わせてください。

## 日々の更新方法（スマホでOK）

1. スマホのブラウザで `https://＜サイトURL＞/admin/` を開いてログイン
2. 「新着情報」「大会案内・エントリー」「大会結果」から編集したい項目を選ぶ
3. フォームに入力して「公開」を押すと、1〜2分で自動的にサイトへ反映されます

よくある操作:

- **大会のエントリー受付を開始する** → 大会案内で該当大会の「状況」を
  「エントリー受付中」に変え、「エントリーフォームURL」にGoogleフォーム等のURLを貼る
- **結果を載せる** → 大会結果に順位を入力し、あわせて新着情報にもお知らせを1件追加
- **写真を載せる** → 新着情報の「画像」欄からアップロード（原寸で保存されます）

## 今後の拡張

- **協会登録・大会エントリーのWEB化**: 現在は `https://forms.gle/replace-with-actual-form`
  のプレースホルダーURLが入っています。実際のGoogleフォーム（または専用システム）の
  URLに置き換えてください
- **LINE公式アカウント**: `contact.html` 内の `https://lin.ee/replace-with-actual-line-url`
  を実際の友だち追加URLに置き換えてください
- **オンライン決済**: 登録・エントリー費のオンライン決済（Squareリンク決済等）を
  フォームに組み込む拡張を想定しています

## 注意（公開前に必ず）

サンプルとして入っている以下は実データに置き換えてください。

- `data/*.json` の大会日程・結果（○○・△△などのプレースホルダー）
- `about.html` の役員名・加盟クラブ名
- `membership.html` の年会費金額
- 各所のフォームURL・LINE URL
