## Daemonset
各ノードにPodを1つずつ配置するリソース（レプリカ数は指定できない、1ノードに2つ配置することもできない）

ユースケース：必ず全ノード上で動作させたいプロセスのために利用する
- 各Podが出力するログをホスト単位で収集するFluented
- 各Podのリソース使用状況やノードの状態をモニタリングするDatadog

```
kubectl apply -f sample-ds.yaml
kubectl get pods -o wide
```

### Daemonsetのアップデート戦略
OnDelete
- マニフェストが更新された際にPodの更新はせず、別要因でPodが再作成される時に新しい定義でPodを作成する
- 死活監視やログ転送といった用途に利用されることが多い為、アップデートを次回再作成時や主導による任意タイミングに行えるようになっている
- 長期間古いバージョンで稼働し続けてしまうことに注意
- 任意のタイミングでPodのアップデートを行う場合には、Daemonsetに紐づくPodを「kubectl delte pod」コマンドで手動削除して、セルフヒーリングの機能によって新しいPodを作成する

RollingUpdate
- maxUnavailableの数と同じだけ　同時にPodをアップデートしていく
- maxUnavailableを0にすることはできない
