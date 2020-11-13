const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const getPodNames = async () => {
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const res = await k8sApi.listNamespacedPod('default')
  const names = res.body.items.map((item: any) => {
    return item.metadata.name
  })
  return names
}

let count = 6
let decrement = true
const max = 7;
const min = 7;

const scale = async (namespace: string, name: string, replicas: number) => {
  const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
  // find the particular deployment
  const res = await k8sApi.readNamespacedDeployment(name, namespace);
  let deployment = res.body;

  // edit
  deployment.spec.replicas = replicas;

  // replace
  await k8sApi.replaceNamespacedDeployment(name, namespace, deployment);
}

const runManager = async () => {
  const names = await getPodNames()

  console.log('[pod names]', names)
  count = names.length - 1
  console.log(`[pod count] count: ${count}`)
  if (count > 1 && decrement) {
    count--
    if (count === min) decrement = false
  } else {
    decrement = false
    count ++
    if (count === max) decrement = true
  }

  const targetDeploymentName = 'scale-app-worker';
  console.log(`[log] scale pod to ${count}`)
  await scale('default', targetDeploymentName, count);
};

const runMassPushV3Manager = async ({ interval_msec }: { interval_msec: number }) => {
  setInterval(runManager, interval_msec);
};

runMassPushV3Manager({ interval_msec: 5 * 1000 });
