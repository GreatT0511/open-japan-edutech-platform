# Open Japan EduTech Platform (OJETP)

日本の教育政策データを可視化するオープンソースプラットフォーム。学校の先生と保護者が、教育の現状を直感的に理解できることを目指しています。

## アプリ一覧

| アプリ | ポート | 説明 |
|--------|--------|------|
| **EduBudget** | :4000 | 文科省予算の推移を分野別に可視化 |
| **SchoolStats** | :4001 | 都道府県別の学校数・児童生徒数・クラスサイズ |
| **CurriculumMap** | :4002 | 学習指導要領の教科×学年比較 |
| **UniScope** | :4003 | 大学の基本情報・学費・就職率比較 |
| **TeacherPulse** | :4004 | 教員の労働環境・採用倍率・年齢構成 |
| **PolicyCompass** | :4005 | 政党別教育政策スタンスの比較 |

## クイックスタート

### 前提条件

- Node.js 20+
- pnpm 10+
- Docker / Docker Compose

### セットアップ

```bash
git clone https://github.com/your-org/open-japan-edutech-platform.git
cd open-japan-edutech-platform
bash setup.sh
```

### 開発サーバーの起動

```bash
pnpm dev
```

## 技術スタック

- **フレームワーク**: Next.js 15 / React 19
- **言語**: TypeScript 5.9
- **ORM**: Prisma 6
- **スタイリング**: Tailwind CSS v4
- **アニメーション**: Motion / Lenis
- **チャート**: Recharts
- **ビルド**: pnpm 10 + Turborepo
- **リンター**: Biome
- **テスト**: Vitest
- **DB**: PostgreSQL 16

## リポジトリ構成

```
├── apps/                 6つのNext.jsアプリ
│   ├── edu-budget/       教育予算の可視化
│   ├── school-stats/     学校基本統計
│   ├── curriculum-map/   学習指導要領の比較
│   ├── uni-scope/        大学データ
│   ├── teacher-pulse/    教員データ
│   └── policy-compass/   政党別教育政策
├── packages/             共有パッケージ
│   ├── ui/               @ojetp/ui — 共通UIコンポーネント
│   ├── db/               @ojetp/db — Prisma スキーマ + Client
│   ├── api/              @ojetp/api — APIユーティリティ
│   └── ingestion/        @ojetp/ingestion — データ取り込み
├── data/                 静的データファイル (JSON)
├── docs/                 ドキュメント
└── scripts/              デプロイスクリプト
```

## データソース

- [文部科学省](https://www.mext.go.jp/) — 予算・政策データ
- [学校基本調査](https://www.mext.go.jp/b_menu/toukei/chousa01/kihon/1267995.htm) — 学校統計
- [e-Stat](https://www.e-stat.go.jp/) — 政府統計ポータル
- [OECD Education at a Glance](https://www.oecd.org/education/education-at-a-glance/) — 国際比較
- [TALIS](https://www.oecd.org/education/talis/) — 教員勤務時間調査

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `pnpm dev` | 全アプリの開発サーバー起動 |
| `pnpm build` | 全アプリのビルド |
| `pnpm lint` | Biome リント |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm test` | Vitest テスト実行 |
| `pnpm db:generate` | Prisma クライアント生成 |
| `pnpm db:push` | DBスキーマ適用 |
| `pnpm db:studio` | Prisma Studio 起動 |
| `pnpm ingest:all` | 全データ投入 |

## ライセンス

[AGPL-3.0](LICENSE)

## コントリビューション

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。
