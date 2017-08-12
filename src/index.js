import superagent from 'superagent';
import { handlePageRes, handlePostRes } from './handle';

/**
 * 生成url
 * @param {*页数} pageNum
 */
const generatePageUrl = (pageNum) => {
  const urlArr = [];
  for (let i = 0; i < pageNum; i++) {
    urlArr.push(`http://www.1point3acres.com/bbs/forum-82-${i + 1}.html`);
  }
  return urlArr;
};

/**
 * 将superagent转换为promise对象
 * @param {*} pageLink
 */
const requestPage = pageLink => () => Promise.resolve(superagent.get(pageLink));

const generateTasks = (sourceArr, singleTaskNum) => {
  const sourceArrLength = sourceArr.length; // 数组长度
  const TaskCount = Math.ceil(sourceArrLength / singleTaskNum); // 分组的人物次数
  const TaskQueues = []; // 总的任务队列，二维数组
  let childTaskQueue; // 子队列
  for (let i = 0; i < TaskCount; i++) {
    childTaskQueue = [];
    if (i === TaskCount - 1) { // 当在最后一次循环中
      const lastChildTaskLength = sourceArrLength - (i * singleTaskNum); // 取最后一组的数量
      for (let j = i * singleTaskNum; j < ((i * singleTaskNum) + lastChildTaskLength); j++) {
        childTaskQueue.push(requestPage(sourceArr[j]));
      }
    } else { // 其余循环中
      for (let j = i * singleTaskNum; j < (i + 1) * singleTaskNum; j++) {
        childTaskQueue.push(requestPage(sourceArr[j]));
      }
    }
    TaskQueues.push(childTaskQueue);
  }
  return TaskQueues;
};

// 手动启动运行队列
const runTasks = (TaskQueues) => {
  const RunQueues = [];
  for (let i = 0; i < TaskQueues.length; i++) {
    RunQueues.push(TaskQueues[i]());
  }
  return RunQueues;
};

const recordValue = (results, handleValue, value) => {
  results.push(handleValue(value));
  return results;
};


/**
 * 获取帖子链接
 */
const getPostLinks = (pageUrlArr) => {
  const TaskQueues = generateTasks(pageUrlArr, 20); // 生成任务队列
  const pushValue = recordValue.bind(null, [], handlePageRes);
  return TaskQueues.reduce((promise, task) =>
    promise.then(() => Promise.all(runTasks(task))).then(pushValue)
  , Promise.resolve());
};


const getPostInfo = (postUrlArr) => {
  const TaskQueues = generateTasks(postUrlArr, 20); // 生成任务队列
  const pushValue = recordValue.bind(null, [], handlePostRes);
  return TaskQueues.reduce((promise, task) =>
    promise.then(() => Promise.all(runTasks(task))).then(pushValue)
  , Promise.resolve());
};


(async () => {
  // 主程序
  try {
    console.log('start');
    // 获取帖子链接并进行处理
    const postLinks = await getPostLinks(generatePageUrl(1000));
    const result = await getPostInfo(postLinks);
    // 写入excel

  } catch (err) {
    console.log(err);
  }
})();
