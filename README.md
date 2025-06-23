# Sleep Peep - 夢の投稿アプリ

https://new-sleep-peep.deno.dev/

## 概要
Deno + Tailwind CSSで構築された夢の投稿アプリケーション。ユーザーは夢の内容を投稿し、他のユーザーの投稿を閲覧できます。

## 技術スタック
- **バックエンド**: Deno + HTTP Server
- **フロントエンド**: HTML + Tailwind CSS + JavaScript
- **データベース**: インメモリDB (Deno Deploy用) / SQLite (開発環境用)
- **デプロイ**: Deno Deploy

## 機能
- ✅ ユーザー登録・ログイン
- ✅ 夢の投稿作成・閲覧
- ✅ タグ機能
- ✅ プロフィール表示
- ✅ レスポンシブデザイン

## 解決済みの問題
- ✅ 登録後のログイン詳細反映問題
- ✅ ログイン・登録ページ間の遷移
- ✅ Deno Deployでのデプロイ問題

## 今後の改善点

### 高優先度
1. **画像アップロード機能**
   - アバター画像の保存機能
   - データベース構造の見直し

2. **投稿詳細・返信機能**
   - 投稿クリック時の詳細表示
   - 返信機能の実装
   - データベース設計の拡張

3. **UI/UX改善**
   - プロフィールページのヘッダー・フッター統一
   - フッター位置の調整
   - プロフィールページに投稿ボタン追加
  
4. **DB作成**
   - ローカルで動かすときはsqliteでも良かったが,本番ではそうもいかないのでDBを用意する。

### 中優先度
4. **エラーハンドリング**
   - 重複ユーザー登録時の適切なエラー表示
   - アバター未選択時のエラーメッセージ
   - 全体的なエラー処理の改善

5. **データベース設計**
   - SQLiteでの画像保存対応
   - 返信機能用のテーブル設計
   - データ永続化の検討

## 開発・デプロイ

### ローカル開発
```bash
# 開発環境（SQLite使用）
deno task dev

# デプロイ環境と同じ設定
deno task deploy
```

### デプロイ
```bash
# Deno Deploy
deno deploy server-deploy.js
```

## ファイル構成
```
├── server.js              # 開発用サーバー（SQLite）
├── server-deploy.js       # デプロイ用サーバー（インメモリDB）
├── public/
│   ├── index.html         # メインページ
│   ├── login.html         # ログインページ
│   ├── register.html      # 登録ページ
│   ├── profile.html       # プロフィールページ
│   ├── index.js           # メインページのJS
│   ├── profile.js         # プロフィールページのJS
│   └── utils/
│       ├── db.ts          # SQLite用DB
│       └── db-deploy.ts   # インメモリDB
└── deno.json              # 設定ファイル
```