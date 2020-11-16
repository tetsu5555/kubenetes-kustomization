const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const targetDeploymentName = 'scale-app-worker';
const nameSpace = 'default';

const getPodNames = async () => {
  const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  const res = await k8sApi.listNamespacedPod(nameSpace);
  const names = res.body.items.map((item: any) => {
    return item.metadata.name
  })
  return names
}

let count = 6
let decrement = true
const MAX = 7
const MIN = 1

const scale = async (namespace: string, name: string, replicas: number) => {
  const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
  const res = await k8sApi.readNamespacedDeployment(name, namespace);
  let deployment = res.body;

  deployment.spec.replicas = replicas;

  await k8sApi.replaceNamespacedDeployment(name, namespace, deployment);
}

const runManager = async () => {
  const names = await getPodNames()

  console.log('[pod names]', names)
  count = names.length - 1
  console.log(`[pod count] count: ${count}`)

  // MINとMAXの間でpodを増減させる
  if (count > MIN && decrement) {
    count--
  } else {
    decrement = false
    count ++
    if (count === MAX) decrement = true
  }

  console.log(`[log] scale pod to ${count}`)
  await scale(nameSpace, targetDeploymentName, count)
};

const runMassPushV3Manager = async ({ interval_msec }: { interval_msec: number }) => {
  setInterval(runManager, interval_msec);
};

runMassPushV3Manager({ interval_msec: 5 * 1000 });
