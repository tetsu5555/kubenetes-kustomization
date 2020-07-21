### 高度なスケジューリングとAffinity / Anti-Affinity
リソースにラベルをつける、それを用いて様々なマネジメントを行う。スケジューリングもNodeやPodのラベルを使うことで実現する。

Affinity
- 特定の条件に一致するところにスケジューリングする
Anti-Affinity
- 特定の条件に一致しないところにスケジューリングする

Kubenetesのスケジューリング
- Podのスケジューリング時に特定のNodeを選択する方法（5種類）
  - nodeSelector
    - 簡易的なNode Affinity機能
  - Node Affinity
    - 特定のノード上だけで実行する
  - Node Anti-Affinity
    - 特定のノード上だけで実行する
  - Inter-Pod Affinity
    - 特定のPodがいるドメイン(ノード、ゾーン、etc)上で実行する
  - Inter-Pod Anti-Affinity
    - 特定のPodがいないドメイン(ノード、ゾーン、etc)上で実行する
- Nodeに対して汚れ(Taints)をつけておき、それを許容できるPodのみスケジューリングを許可する方法

### ビルトインノードラベルとラベルの追加
ビルトインノードラベル
- Nodeにあらかじめ付与されているラベル
- ホスト名 / OS / アーキテクチャ / インスタンスタイプ / リージョン / ゾーン
- 環境によってはKubenetes PlatformやDistributionの環境独自のラベルも付与される

ラベルの追加
- 手動でノードにラベルを追加することも可能

```
kubectl get nodes -o json | jq ".items[] | .metadata.labels"
kubectl label node docker-desktop disktype=ssd cputype=low disksize=200

# -Lってなんだろう？
# -Lを追加すると表示項目が増えるのか
kubectl -L=disktype,cputype,disksize get node
```

### nodeSelector(Simplest Node Affinity)
あるラベルを持つ特定のノードに配置するといったスケジューリングが可能
- 高いディスクIO性能が必要なPodを配置したい場合、disktype=ssdラベルを持つ、特定のノードに配置するといったスケジューリングが可能
equality-based条件を使用するため、それほど柔軟に条件を指定することはできない

```
kubectl get pods sample-nodeselector -o wid
```

### Node Affinity
Podを特定のノード上へスケジューリングするポリシー
