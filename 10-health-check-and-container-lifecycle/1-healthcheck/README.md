## ヘルスチェック
2種類のヘルスチェック機構 x 3種類のヘルスチェック方式（計6通り）

### ヘルスチェック機構（2種類）
- Liveness Probe
  - Podが正常に動作しているかの確認
    - プロセスにバグがあった場合、長時間実行しているとメモリリークなどによって応答しなくなってしまう
  - 失敗時にはPodを再起動する
- Readiness Prbve
  - Podをサービスインする準備ができているかを確認する
    - バックエンドのDBとの接続が完了しているか
    - キャッシュをロードし終わっているか
    - 起動に時間のかかるプロセスの起動が完了しているか
  - 失敗時にはトラフィックを流さない（Podを再起動しない）

- 「type: LoadBalancer」のServiceでロードバランサを作成した場合、ロードバランサからNodeへのヘルスチェックはICMPによる簡易的なチェックしか行われない
- Readiness Probeもしくは、Liveness Probeをきちんと設定しておくことが必要

### ヘルスチェック方式（3種類）
- exec
  - コマンドを実行し、終了コードが0でなければ失敗
- httpGet
  - HTTP GETリクエストのStatus Codeによって確認を行う
- tcpSocket
  - TCPセッションが確率できるかどうかで確認

### ヘルスチェックの間隔
- initialDelaySeconds
  - 初回ヘルスチェック開始までの遅延
- periodSeconds
  - ヘルスチェックの間隔
- timeoutSeconds
  - タイムアウトまでの時間
- successThreshold
  - 成功と判断するまでのチェック回数
- failureThredshold
  - 失敗と判断するまでのチェック回数

### メモ

```
kubectl apply -f sample-healthcheck.yaml
kubectl describe pod sample-healthckeck | egrep "Liveness|Readiness"
```

```
kubeclt apply -f sample-liveness.yaml
kubectl get pods sample-liveness --watch

# liveness probeが失敗し、restartPolicyに従ってコンテナの再起動が行われる
kubectl exec -it sample-liveness -- rm /usr/share/nginx/html/index.html

# Liveness Probeの履歴を確認できる
kubectl describe pod sample-liveness
```

```
kubectl apply -f sample-readiness.yaml
kubeclt get pods sample-readiness --watch

# Readiness Probeが失敗するようになる
kubectl exec -it sample-readiness -- rm /usr/share/nginx/html/50x.html

# Readiness Probeが成功するようになる
kubectl exec -it sample-readiness -- touch /usr/share/nginx/html/50x.html

kubectl describe pod sample-readiness
```
