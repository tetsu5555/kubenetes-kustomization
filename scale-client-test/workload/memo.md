```
docker-compose build
kubectl delete -f deployment.yaml && kubectl apply -f deployment.yaml
kubectl get pods
kubectl logs <pod name> <container name> # scale-manager or scale-worker
```
