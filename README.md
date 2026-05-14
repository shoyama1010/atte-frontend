# atte-frontend（勤怠管理：フロントエンド）

# 作成した目的

Laravelでのバックエンド側だけでなく、API連携により、Next.jsで画面構成（CSRにて）を実装することで、高速なページを表示させる機能を目的としてます。
（開発の途中なので、フロントエンドのスキル習得も目的にしており、管理側などのマルチログインも未完成です）

# アプリケーションURL
ローカル環境
http://localhost/3000/attendance

# 機能一覧

＊ログイン機能は、開発中ですが、仮のマルチログイン画面を実装。

①バックエンド側のマルチログイン(一般、新規登録、管理者)ページの「Next版」ボタンから仮ログインページに遷移

②localhost:3000/login(仮のログインページ) で、一般ユーザーか管理者を選んで、ログイン。

③Laravel が XSRF-TOKEN + laravel_session Cookie を発行。

④Next.js 側の API リクエスト時に、その Cookie が自動的に送信される⇒Laravel は「ログイン済みユーザー」として認証。

・マルチログイン（仮）
<img width="1204" height="666" alt="Image" src="https://github.com/user-attachments/assets/6eb85adb-bf37-43a2-ad47-7feb0c7471da" />

・全ユーザー取得機能
- http://localhost/3000/attendance は、個人別ではなく、「全ユーザー取得機能」として、フロントエンド用にページ作成しました。
<img width="1352" height="679" alt="Image" src="https://github.com/user-attachments/assets/bddf26e2-0949-4511-83af-cf170cf686c2" />

・ユーザー側・ＣＲＵＤ機能（勤怠情報取得、月情報取得、詳細遷移）
<img width="1366" height="683" alt="Image" src="https://github.com/user-attachments/assets/aac35554-3815-443d-9011-3b0acce3fdfc" />

・ユーザー側・勤怠詳細⇒修正申請機能（承認待ち＝承認済情報取得、申請詳細表示）
<img width="1359" height="675" alt="Image" src="https://github.com/user-attachments/assets/52c9a38c-6621-4ee0-9348-c52b55a3dffe" />

管理側・申請一覧⇒修正申請機能　（管理側へのログインも実装しておりません。http://localhost:3000/admin/corrections/list　）
<img width="1355" height="671" alt="Image" src="https://github.com/user-attachments/assets/fa207cad-ae2b-4715-98c0-7f84b6055bcc" />

ユーザー側・勤怠一覧機能
<img width="1335" height="660" alt="Image" src="https://github.com/user-attachments/assets/39e3bd19-a94a-44fb-af6a-a493ddcf8df9" />

# 使用技術
・Next.js 14

・React.js 19.2　＊レンダリング技術（CSR）

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

NEXT_PUBLIC_API_BASE_URL=http://localhost/api

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
