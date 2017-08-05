import http from 'http';
import Url from 'url';
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
 * 处理响应
 * @param {*响应} response
 */
const handleResponse = (response) => {
  const results = [];
  for (let i = 0; i < response.length; i++) {
    const $ = cheerio.load(response[0].text); // 将每一个页面用cheerio处理
    const linkArr = handleHtml($); // 传给handleHtml，返回一个链接数组
    results.push(...linkArr);
  }
  console.log(results.length);
  return results;
};


/**
 * 异步获取汇报页的链接
 */
const asyncGetForumPage = async () => {
  const pageUrlArr = generatePageUrl(1000);
  const results = [];
  for (let i = 0; i < pageUrlArr.length; i++) {
    results.push(superagent.get(pageUrlArr[i]));
  }
  handleResponse(await Promise.all(results));
};

asyncGetForumPage();
