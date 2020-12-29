let isExiting = false;
let isProcessing = false;

// const getRandomError = () => {
//   // 10%の確率でエラーを起こす
//   if (Math.random() < 0.1) throw new Error('Random Error!!')
// }

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

process.on('SIGTERM', () => {
  isExiting = true
  console.log(`[log] 配信処理が終わり次第processをkillします`)

  setInterval(() => {
    console.log('>> [log] ', '配信終了待ち')
    if (!isProcessing) {
      console.log(`[log] processをkillします`)
      process.exit(0);
    }
  }, 0.5 * 1000)
});

const executeMassPush = async () => {
  // 1ワーカーで同時に複数配信をしないように処理中の場合はreturn
  if (isProcessing) return

  console.log('[log][all]', `isExiting: ${isExiting}, isProcessing: ${isProcessing}`)
  if (isExiting) {
    console.log('[log] 配信停止中なため処理を停止')
    return;
  }
  
  try {
    isProcessing = true
    console.log('[log] ','mass-push start');
    // getRandomError();
    // 配信処理の終了をmock、10秒待つ
    await sleep(10 * 1000);
    console.log('[log] ', `mass-push end`);
    isProcessing = false
  } catch (error) {
    isProcessing = false
    console.log('[error] ', error)
  }
};

setInterval(executeMassPush, 5 * 1000);
