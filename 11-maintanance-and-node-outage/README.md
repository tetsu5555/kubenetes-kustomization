## ノードの停止とPodの停止
SIGTERM、SIGKILLのシグナルの

### スケジュール対象からの除外と復帰

Kubentesのノードは以下のどちらかのステータスを持つ
- SchedulingEnabled
  - デフォルトのステータスはSchedulingEnabled
- SchedulingDisabled
  - スケジューリング対象から外れ、ノード上でPodが新規に作成されなくなる
  - ノードをSchedulingDisabledステータスに変更しても、すでにそのノード上で実行されているPodに影響はない

kubectl cordonコマンド
- ノードをSchedulingDisabledに変更し、スケジューラ候補から外す

kubectl uncordonコマンド
- SchedulingEnabeldに変更し、スケジューリングの候補に戻す

### ノードの排出処理によるPodの退避(drain)
ステータスをSchedulingDisabledに変更しても、以降のスケジューリング候補から外れるだけで、すでにノード上で実行されているPodは停止されない。

kubectl drain
- ノード上で実行されている全てのPodを退避させる排出処理を行う
- ノードが排出処理を開始するとノードをSchedulingDisabledステータスに変更してから、各Podに関してSIGTERMシグナルを送信し、Podを退避していく
- 排出処理にはそれ以降のスケジューリング候補から除外する処理も含まれているため、前もってcordonを実行する必要はない

```
kubectl drain docker-desktop --force --ignore-daemonsets
kubectl get nodes
```


## PodDisruptionBudgetによる安全な退避

PodDisruptionBudget
- ノードが排出処理を行う際にPodを停止することができる最大数を設定するリソース
  - 条件にマッチするPodの最小起動数と最大の停止数をみながら、ノード上からPodの追い出しを行うことが可能になる
- Podが退避される際に特定のDeployment管理下のレプリカが同時に全て停止してしまうとダウンタイムが発生する可能性がある
  - 複数ノードで同時に排出処理をした場合にはこれが起きる確率がさらに上がる

