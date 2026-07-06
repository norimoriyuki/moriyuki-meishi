# meishi3d — 3Dデジタル名刺

スマホで見せる3D名刺アプリ。トップページのQRを相手にスキャンしてもらうと、相手のスマホで3D名刺が開きます。

## ページ構成

| URL | 内容 |
|---|---|
| `/` | QR表示ページ（見せる用）。国を選ぶとQRが切り替わる |
| `/jp` | 日本 — 夜桜と月 |
| `/cn` | 中国 — 水墨山水と梅 |
| `/lk` | スリランカ — 青睡蓮（ニルマネル）と蛍 |
| `/mz` | モザンビーク — バオバブと夕陽 |
| `/cr` | コスタリカ — モルフォ蝶と熱帯雨林 |
| `/kh` | カンボジア — アンコールワットの暁 |
| `/ph` | フィリピン — 海中の光と魚群 |

各名刺ページの「QRを表示」ボタン（現地語）で X (https://x.com/kushiro_mtg) のQRが出ます。

## ローカルで確認

```bash
npx serve .
```

http://localhost:3000 を開く（`/jp` などのクリーンURLもそのまま動きます）。

## Vercelへデプロイ

```bash
npm i -g vercel
vercel --prod
```

またはGitHubにpushしてVercelでImportするだけ（ビルド設定不要・静的サイト）。
`vercel.json` の `cleanUrls` により `/jp` → `jp.html` が解決されます。

トップページのQRは `location.origin` から自動生成されるので、デプロイ先URLが何であってもそのまま正しいQRになります。

## 技術

- three.js (CDN, importmap) — WebGLパーティクル/インスタンシング
- qrcode.js (CDN) — QR生成
- ビルド不要の静的サイト。スマホはジャイロ（対応時）またはタッチでパララックス
