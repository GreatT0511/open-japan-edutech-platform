# コントリビューションガイド

Open Japan EduTech Platform (OJETP) へのコントリビューションを歓迎します！

## 開発環境のセットアップ

```bash
bash setup.sh
```

## 開発フロー

1. Issue を確認し、作業するものを選びます
2. フィーチャーブランチを作成します: `git checkout -b feat/your-feature`
3. 変更を加えます
4. リントと型チェックを実行します: `pnpm lint && pnpm typecheck`
5. コミットします（[Conventional Commits](https://www.conventionalcommits.org/) に従ってください）
6. Pull Request を作成します

## コミットメッセージ規約

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの変更
style: コードの意味に影響しない変更
refactor: リファクタリング
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```

## コードスタイル

- Biome でフォーマットとリントを行います
- TypeScript の strict モードを使用します
- 日本語のUIテキストを使用します

## データの追加・更新

- `data/` ディレクトリの JSON ファイルを編集します
- 公的データソースからのデータのみ使用してください
- データソースのURLを必ず記録してください
