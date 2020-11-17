動かす

```
cd ./app

# イメージを作成
docker-compose build

cd ..

# manifestをapplyする
kubectl apply -f deployment.yaml

# podを確認
kubectl get pod

# ログを確認
kubectl logs <manager pod name>
```

コマンドメモ

```
docker-compose build
kubectl delete -f deployment.yaml && kubectl apply -f deployment.yaml
kubectl get pods
kubectl logs <pod name> <container name> # scale-manager or scale-worker

kubectl apply -k scale-client-test
kubectl delete -k scale-client-test
```
