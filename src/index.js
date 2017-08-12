import superagent from 'superagent';
import cheerio from 'cheerio';

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
 * 解析html,获取参数链接
 * @param {*} $
 */
const handleHtml = ($) => {
  const linkArr = [];
  $('table#threadlisttableid>tbody')
    .each((idx, element) => {
      const $tbody = $(element);
      if (/^normalthread/.test($tbody.attr('id'))) {
        linkArr.push($tbody.find('.xst').attr('href'));
      }
    });
  return linkArr;
};


/**
 * 将superagent转换为promise对象
 * @param {*} pageLink
 */
const requestPage = (pageLink) => {
  return Promise.resolve(superagent.get(pageLink));
}

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


const main = () => {
  const arr = generatePageUrl(10);
  const q = generateTasks(arr, 1);
  console.log(q);
}

