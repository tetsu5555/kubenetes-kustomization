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

起動時と終了時に任意のコマンドを実行する
- postStart
  - spec.containers[].command(Entrypoint)とほぼ同じタイミングで実行されるため、Entrypointが実行されるよりも前にpostStartが実行される可能性がある
  - 起動に必要なファイルの配置などを行う場合にはinitContainersで行うか、Entrypointの中で行ってから起動する
- preStop

```
kubectl apply -f sample-lifecycle.yaml
kubeclt exec -it sample-lifecycle -- ls /tmp
kubeclt delete -f sample-lifycle.yaml
kubeclt exec -it sample-lifecycle -- ls /tmp
```