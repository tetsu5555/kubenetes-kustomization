## Podの安全な停止タイミング

Podの削除が行われる際には安全に停止するために何段階かに渡って処理が実行されている

起動中のPodの削除要求がKubenets APIサーバーに届くと、非同期に「preStop処理 + SIGTERM処理」と「Serviceからの除外」が行われる。

この二つは厳密には同時はではない（自立分散システムなため）
- Serviceが削除される前にプロセスが停止され、リクエストがエラーになる
  - 「Serviceからの除外設定」が完了する前（リクエストが届かなくなる前）に「preStop処理 + SIGTERM処理」でプロセスを停止すると一部のリクエストでエラーが発生するかも

解決策
- Serviceの除外処理が終わるであろう数秒間を「preStop処理 + SIGTERM処理」で待機する
- 「preStop処理 + SIGTERM処理」でリクエストを受けつつ停止処理を行う

spec.terminationGracePeriodSecondsという設定値（デフォルトは30秒）
- この期間に「preStop処理 + SIGTERM処理」を終わらせる必要がある
- 終わってない場合は、SIGKILLシグナルがコンテナに送られて強制的に終了される
- preStop処理は必須でないため、設定がない場合にはそのままSIGTERM処理に移行する
- preStop処理でterminationGracePeriodSecondsを使い切ってしまった場合はSIGTERM処理に2秒の時間が確保される

```
kubectl apply -f sample-termination.yaml

# grace-periodオプションを利用してすでに作成済みのPodに対してterminationGracePeriodSecondsを変更して削除することが可能
# terminationGracePeriodSecondsを3秒に設定するため、早く終わる
kubectl delete pod sample-termination --grace-period 3

# --forceオプションと組み合わせて強制的に削除できる
kubectl delete pod sample-termination --grace-period 0 --force
```

メモ
- SIGTERMとSIGKILLがわからん
