const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const getPodNames = async () => {
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const res = await k8sApi.listNamespacedPod('default')
  const names = res.body.items.map((item: any) => {
    return item.metadata.name
  })
  console.log('[pod names]', names)
}

let count = 2
const scale = async (namespace: string, name: string, replicas: number) => {
  const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
  // find the particular deployment
  const res = await k8sApi.readNamespacedDeployment(name, namespace);
  let deployment = res.body;
  // console.log('deployment', deployment)

  // edit
  deployment.spec.replicas = replicas;

  // replace
  await k8sApi.replaceNamespacedDeployment(name, namespace, deployment);

  console.log(`pod scaled to ${count}`)
  count++
}



const runManager = async () => {
  await getPodNames()

  const targetDeploymentName = 'scale-app-worker';
  scale('default', targetDeploymentName, count);
};

const runMassPushV3Manager = async ({ interval_msec }: { interval_msec: number }) => {
  setInterval(runManager, interval_msec);
};

runMassPushV3Manager({ interval_msec: 5 * 1000 });
