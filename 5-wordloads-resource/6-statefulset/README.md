## StatefulSet
データベースなどのステートフルなワークロードに対応する為のリソース

Replicasetとの違い
- 作成されるPod名のサフィックスは数字のインデックスが付与されたものになる
  - sample-statefulset-1, sample-statefulset-2, ... sample-statefulset-N
- データを永続化する為の仕組みを有している
  - PersistentVolumeを使ってる場合は、Podの再起動時に同じディスクを利用して再作成される
  - Pod名が変わらない
- Pod削除
  - Podを一つずつ作成/削除するため、時間がかかる
  - スケールアウトする際にはインデックスが小さいものから作成する
  - 前に作られたPodがReadyになってから次のPodを作成し始める
  - スケールインの場合はインデックスが一番大きいものから削除される
- 特定のPodがマスターになるようなアプリケーションに使うとよい

PersistentVolumeClaimを利用することでクラスタ外のネットワーク越しに提供されるPersistentVolumeをPodにアタッチすることができる
  - Podの再起動時や別ノードへの移動時に同じデータを保存した状態で渾天が再作成されるようになる

```
# Podが作られなくて動かなかった
kubectl apply -f sample-statefulset.yaml
kubectl get statefulsets
kubectl get pods
kubectl get persistentvolumeclaims
kubectl get persistentvolumes
```

Podが作られない？
- `pod has unbound immediate PersistentVolumeClaims`
- https://qiita.com/silverbirder/items/d3522237b28703a9adb6
↓
原因わかった
- Docker for macのFile Sharingの設定で/usrをシェアしてないからだ
- https://github.com/docker/for-mac/issues/3488

### Statefulsetのスケーリング

```
kubectl scale statefulset sample-statefulset --replicas=5
sed -e 's|replicase: 3|replicas: 5|' sample-statefulset.yaml | kubectl apply -f -
```

### StatefulSetのライフサイクル
- spec.podManegementPolicyをParallelにすることで同時並列に起動させることが可能

### StatefulSetのアップデート戦略

OnDelete
- StatefulSetのマニフェストを変更してイメージを差し替えたとしても、既存のPodにアップデートは行わない
- 手動でアップデートを行なっていきたい場合はOnDeleteを使って任意のタイミングや次回再起動時に更新をすることができるようになっている

RollingUpdate
- 1つのPodごと更新していく
- 並列を指定していても並列処理はされず、１つずつPodをアップデートしていく
- partitonを指定することで全体のPodのうちどこPodまでを更新するかを指定することができる
  - 手動で再起動した場合でもpartitionより小さいインデックスを持つPodはアップデートされない

```
kubectl apply -f sample-statefulset-rollingupdate.yaml
kubectl get statefulsets
kubectl get pods --watch

# マニフェストのimageのバージョンを変更
kubectl apply -f sample-statefulset-rollingupdate.yaml
```

### 永続化領域のデータ保持の確認

```
# 一番最初のが動いてないから確認できなかった
# 動いたけど確認できなかった
kubectl exec -it sample-statefulset-0 -- df -h | grep /dev/sh
kubectl exec -it sample-statefulset-0 -- ls /usr/share/nginx/html/sample.html
kubectl exec -it sample-statefulset-0 -- touch /usr/share/nginx/html/sample.html
kubectl exec -it sample-statefulset-0 -- ls /usr/share/nginx/html/sample.html

# podの予期せぬ停止
kubectl delete pod sample-statefulset-0
kubectl exec -it sample-statefulset-0 -- /bin/bash -c 'kill 1'

# ファイルは欠損していない
kubectl exec -it sample-statefulset-0 -- ls /usr/share/nginx/html/sample.html

# 復帰後もpod名は変わらない
kubectl get pods
```

### StatefulSetの削除とPersistentVolumeの削除

StatefulSetが削除されても永続化領域は削除されない

```
kubectl delete statefulsets sample-statefulset
kubectl get persistentclaims
kubectl get persistentvolumes
kubectl apply -f sample-statefulset.yaml
kubectl exec -it sample-statefulset-0 -- ls /usr/share/nginx/html/sample.html

# StatefulSetが確保した永続化領域の解放

kubectl delete persistentvolumeclaims www-sample-statefulset-{0..2}
```

PersistentVolumeClaimを消すとPersistentVolumeも削除される。ただしClaimPolicyによっては削除されないものもある
