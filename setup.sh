#!/usr/bin/env bash
set -euo pipefail

echo "============================================"
echo "  Open Japan EduTech Platform (OJETP)"
echo "  セットアップスクリプト"
echo "============================================"
echo ""

# 1. .env ファイルの作成
if [ ! -f .env ]; then
  echo "📄 .env ファイルを作成中..."
  cp .env.example .env
  echo "   ✅ .env ファイルを作成しました"
else
  echo "📄 .env ファイルは既に存在します"
fi

# 2. Docker で PostgreSQL を起動
echo ""
echo "🐘 PostgreSQL を起動中..."
docker compose up -d --wait
echo "   ✅ PostgreSQL が起動しました (port: 54323)"

# 3. 依存関係のインストール
echo ""
echo "📦 依存関係をインストール中..."
pnpm install
echo "   ✅ 依存関係のインストールが完了しました"

# 4. Prisma クライアント生成
echo ""
echo "🔧 Prisma クライアントを生成中..."
pnpm db:generate
echo "   ✅ Prisma クライアントの生成が完了しました"

# 5. データベースマイグレーション
echo ""
echo "🗃️  データベーススキーマを適用中..."
pnpm db:push
echo "   ✅ データベーススキーマの適用が完了しました"

# 6. データ投入
echo ""
echo "📊 初期データを投入中..."
pnpm ingest:all
echo "   ✅ 初期データの投入が完了しました"

# 7. ビルド
echo ""
echo "🏗️  アプリケーションをビルド中..."
pnpm build
echo "   ✅ ビルドが完了しました"

echo ""
echo "============================================"
echo "  セットアップ完了！"
echo ""
echo "  以下のコマンドで開発サーバーを起動できます:"
echo "    pnpm dev"
echo ""
echo "  各アプリのURL:"
echo "    EduBudget      : http://localhost:4000"
echo "    SchoolStats     : http://localhost:4001"
echo "    CurriculumMap   : http://localhost:4002"
echo "    UniScope        : http://localhost:4003"
echo "    TeacherPulse    : http://localhost:4004"
echo "    PolicyCompass   : http://localhost:4005"
echo "============================================"
