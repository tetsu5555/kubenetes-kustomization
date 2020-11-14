x   ```
kubectl exec -it sample-serviceaccount-pod -- ls /var/run/secrets/kubernetes.io/serviceaccount

apt update && apt -y install curl

TOKEN=`cat /var/run/secrets/kubernetes.io/serviceaccount/token`

curl -H "Authorization: Bearer ${TOKEN}" --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt https://kubernetes/api/v1/namespaces/default/pods

kubectl patch serviceaccount sample-serviceaccount -p '{\"imagePullSecrets\":[{\"name\":\"myregistrykey\"}]}'
```
