## リソースを削除した時の挙動
- KubenetesではReplicasetなどの親リソースが削除された際には、子リソースとなるPodなどを削除するためにガベージコレクションを行う
- metadata.ownerReference
  - ReplicastなどではPodを作成していくが、作成されたPodにはどのReplicasetから作成されたかを判別するためにmetadataa.ownerReference以下に自動的に情報が保存されている

### Replicasetを削除した時の挙動（3パターン）
- Background
  - Replicasetを直ちに削除し、Podはガベージコレクタがバックグラウンドで非同期に削除
- Foreground（API経由のみ）
  - ReplicaSetを直ちに削除はせず、deletionTimestamp, metadata.finalizers = foregroundDeletionに設定
- Orphan
  - Replicaset削除時にPodの削除を行わない

```
kubectl get pods sample-rs-8rrsq - o json | jq .metadata.ownerReference
kubectl delete replicaset sample-rs
kubectl delete --cascade=true replicaset sample-rs

# Orphan削除
# --cascade=falseオプションを設定して削除を行うことでPodを残したまま削除する
kubeclt delete --cascade=false replicaset sample-rs
kubectl get replicaasets
kubectl get pods
```

Foreground削除

```
kubectl proxy --port=8080
curl -X DELETE localhost:8080/api/apps/v1/namespaces/default/deplicasets/sample-rs \
  -H "Content-Type: application/json" \
  -d '{"kind": "DeleteOptions", "apiVersion": "v1", "propagationPolicy": "Foreground"}'
```
