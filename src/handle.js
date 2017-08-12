import cheerio from 'cheerio';

/**
 * 解析录取汇报页的html,获取参数链接
 * @param {*} $
 */
const handlePageHtml = ($) => {
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
 * 处理单个帖子的页面，将信息提取出来
 * @param {*} $
 */
const handlePostHtml = ($) => {

};

/**
 * 处理录取汇报页响应
 * @param {*响应} response
 */
const handlePageRes = (response) => {
  const results = [];
  for (let i = 0; i < response.length; i++) {
    const $ = cheerio.load(response[0].text); // 将每一个页面用cheerio处理
    const linkArr = handlePageHtml($); // 传给handleHtml，返回一个链接数组
    results.push(...linkArr);
  }
  return results;
};


const handlePostRes = (response) => {
  const results = [];
  for (let i = 0; i < response.length; i++) {
    const $ = cheerio.load(response[0].text); // 将每一个页面用cheerio处理
    const grade = handlePostHtml($); // 传给handleHtml，返回一个链接数组
    results.push(grade);
  }
  return results;
};


export { handlePageRes, handlePostRes };
