Init Containers
- Pod内でメインとなるコンテナを起動する前に別のコンテナを起動させるための機能
- セットアップ用のスクリプトをコンテナに含まない状態を保つことができる

具体的な利用シーン
- リポジトリからファイルなどを取得する
- コンテナの起動を遅延させる処理
- 設定ファイルを動的に生成する
- Serviceが作成されているかの確認
- その他メインコンテナを起動する前のチェック

メモ

```
kubectl apply -f sample-initcontainer.yaml
kubeclt get pods sample-initcontainer
kubectl exec -it sample-initcontainer -- cat /usr/share/nginx/html/index.html
```
