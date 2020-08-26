## Discovery & LBリソース

コンテナを外部公開するようなエンドポイントを提供するリソース

2種類のDiscovery & LBリソース
- Service
  - L4ロードバランシングを提供
  - 種類
    - ClusterIP
    - ExternalIP
    - NodePort
    - LoadBalancer
    - Headless
    - ExternalName
    - None-Selector
- Ingress
  - L7ロードバランシングを提供

```
kubectl apply -f sample-deployment
kubectl get pods sample-deployment-c6c6778b4-9jzxw -o jsonpath='{.metadata.labels}'
kubectl get pods -l app=sample-app \
  -o custom-columns="NAME:{metadata.name},IP:{status.podIP}"

kubectl apply -f sample-clusterip.yaml
kubectl get services sample-clusterip
kubectl describe svc sample-clusterip

for PODNAME in `kubectl get pods -l app=sample-app -o jsonpath='{.items[*].metadata.name}'`; do
  kubectl exec -it ${PODNAME} -- cp /etc/hostname /usr/share/nginx/html/index.html;
done

kubectl run --image=centos:6 --restart=Never --rm -i testpod -- curl -s http://10.100.234.40:8080
```

## KubernetesクラスタのネットワークとService

同じPodであれば全てのコンテナは同じIPアドレスが割り当てられている
- 同じPod内であれば、localhost宛に通信を行う
あるPodのコンテナから別Podのコンテナへ通信を行う場合にはPod


GCEとGCSのマウントをした後にインスタンスを停止するとマウントが解除される
→ GCE起動時に常にマウントするコマンドを実行する
  → カスタムメタデータのstartup-scriptを利用する。startup-scriptのキーに対して指定したスクリプトがGCEインスタンス起動時に毎回実行される


