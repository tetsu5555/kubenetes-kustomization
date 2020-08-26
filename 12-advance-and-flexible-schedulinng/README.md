### 高度なスケジューリングとAffinity / Anti-Affinity
リソースにラベルをつける、それを用いて様々なマネジメントを行う。スケジューリングもNodeやPodのラベルを使うことで実現する。

AffinityとAnti-Affinityという概念
- Affinity
  - 特定の条件に一致するところにスケジューリングする
- Anti-Affinity
  - 特定の条件に一致しないところにスケジューリングする

Kubenetesのスケジューリング
- Podのスケジューリング時に特定のNodeを選択する方法（5種類）
  - nodeSelector
    - 簡易的なNode Affinity機能
  - Node Affinity
    - 特定のノード上だけで実行する
  - Node Anti-Affinity
    - 特定のノード以外の上だけで実行する
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
# ラベルを確認
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

requiredDuringSchedulingIgnoredDuringExecution
  - 必須スケジューリングポリシー
  - この条件を満たさないノードにはスケジューリングされない
preferredDuringSchedulingIgnoreedDuringExecution
  - 優先的に考慮されるスケジューリングポリシー
  - あくまでも優先的にスケジューリングを行うだけなので、ノードが停止状態などの場合にはrequiredDuringSchedulingIgnordDuringExecutionが満たされていれば、スケジューリングされる
  - 優先度の重みと条件のペアを複数持つ

nodeSelectorTerm
- どういったノードがスケジューリング可能なノードかを定義
- 配列なので、複数指定可能 → OR条件
- matchExpressionsはAND条件

↓の例の場合(A and B) or (C and D)にスケジューリングされる

```
nodeSelectorTerm:
- matchExpressions:
  - A
  - B
- matchExpressions:
  - C
  - D
```

```
# (disktype=hdd and cputype=high) or (disktype=ssd and cputype=low)
requiredDuringSchedulingIgnoredDuringExecution:
  nodeSelectorTerms:
    - matchExpressions:
      - key: disktype
        operator: In
        values:
          - hdd
      - key: cputype
        operator: In
        values:
          - low
    - matchExpressions:
      - key: disktype
        operator: In
        values:
          - ssd
      - key: cputype
        operator: In
        values:
          - high
```

(A and B)が重み1、 (C and D)が重み2の優先度でスケジューリングを行う

```
preferredDuringSchedulingIgnoredDuringExecution
  - weight: 1
    preference:
      matchExpressions:
        - key: disktype
          operator: In
          values:
            - hdd
        - key: kubernetes.io/hostname
          operator: In
          values:
            - docker-desktop
  - weight: 2
    preference:
      matchExpressions:
        - key: disktype
          operator: In
          values:
            - hdd
        - key: kubernetes.io/hostname
          operator: In
          values:
            - docker-desktop
```