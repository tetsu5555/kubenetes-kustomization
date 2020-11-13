const executeMassPush = async () => {
  console.log('mass-push start');
  console.log(`mass-push end`);
};

const runMassPushV3Worker = async ({ interval_msec }: { interval_msec: number }) => {
  setInterval(executeMassPush, interval_msec);
};

runMassPushV3Worker({ interval_msec: 5 * 1000 });