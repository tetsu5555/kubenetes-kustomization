```
kubectl exec -it sample-job-never-restart-<> -- sh -c 'kill -9 `pgrep sleep`'

sed -e 's|parallelism: 2|parallelism: 3|' sample-paralleljob.yaml | kubectl apply -f -

kubectl patch cronjob sample-cronjob -p '{"spec":{"suspend":true}}'

kubectl logs <pod name>

kubectl patch clusterrole sub-clusterrole1 --patch '{"rules": []}'

kubectl patch clusterrole sub-clusterrole2 --patch '{"rules": []}'
```
