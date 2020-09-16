```
kustomize build . > generated/sample-ingress-app.yaml

openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ~/tls.key -out ~/tls.crt -subj "/CN=sample.example.com"

kubectl create secret tls --save-config tls-sample --key ~/tls.key --cert ~/tls.crt

INGRESS_IP=`kubectl get ingress sample-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`

curl http://${INGRESS_IP}/path1/ -H "Hos: sample.example.com"
```