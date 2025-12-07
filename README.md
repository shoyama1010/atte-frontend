# attendance-frontend（勤怠管理：フロントエンド）

# 作成した目的

Laravelでのバックエンド側だけでなく、API連携により、Next.jsでのフロントエンドを実装することで、高速なページを表示させる

# アプリケーションURL
ローカル環境
http://localhost/3000/attendance

# 機能一覧

＊ログイン機能は、「Laravel Fortify + Sanctum + API連携」で行う＊

①ユーザーは Laravel の /login でログイン。

②Laravel が XSRF-TOKEN + laravel_session Cookie を発行。

③Next.js 側の API リクエスト時に、その Cookie が自動的に送信される⇒Laravel は「ログイン済みユーザー」として認証。

＊http://localhost/3000/attendance は、個人別ではなく、「全ユーザー取得機能」として、フロントエンド用にページ作成しました。

# 使用技術
・Next.js 14

・React.js

・Node.js

・TypeScript（型定義は最小限）

・Webpack（Next.js 内部で使用）

・Babel（Next.js 内部で使用）

・html

・css(Tailwind CSS)

# 環境構築

## 1. リポジトリをクローン

git clone https://github.com/shoyama1010/fruit-furima-frontend.git

cd fruit-furima-frontend

## 2.　パッケージをインストール

npm install

## 3. 環境変数ファイルを作成

.env.local をプロジェクト直下に作成し、以下を設定してください。

（API エンドポイントをバックエンド側 Laravel の URL に合わせてください）

NEXT_PUBLIC_API_BASE_URL=http://localhost

## 4. 開発サーバーを起動

yarn dev

## 5. ビルド（本番用）

yarn run build

npm run start




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
