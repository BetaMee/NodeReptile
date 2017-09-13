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
        const postId = $tbody.attr('id').substring(13);
        linkArr.push(`http://www.1point3acres.com/bbs/thread-${postId}-1-1.html`);
      }
    });
  return linkArr;
};

/**
 * 处理单个帖子的页面，将信息提取出来
 * @param {*} $
 */
const handlePostHtml = ($) => {
  const $post = $('#ct>#postlist>div').first().find('tr .plc');
  // 获取作者
  const author = $post.find('.pi>.pti>.authi>a').first().text();
  // 获取主要信息
  const $body = $post.find('.pct>.pcb');
  // 解析
  const semester = $body.find('u>span>font').eq(0).text().substring(1);
  const degree = $body.find('u>span>font').eq(1).text();
  const offer = $body.find('u>span>font').eq(2).find('b').text();
  const major = $body.find('u>span>font').eq(3).find('b').text();
  const admission = $body.find('u>span>b').text();
  const noticeDate = $body.find('u').contents().last().text().substring(2);
  // 格式：  :  @ , GPA  3.4: 本科Top15 211   => ['','  @ , GPA  3.4',' 本科Top15 211']
  const graduateInfoArr = $body.find('li').eq(1).contents().last().text().split(':');
  const undergraduate = graduateInfoArr[2];
  const GPA = graduateInfoArr[1];
  const TOEFL = $body.find('li').eq(3).contents().last().text().substring(1);
  const GRE = $body.find('li').eq(4).contents().last().text().substring(1);
  const GRE_SUB = $body.find('li').eq(5).contents().last().text().substring(1);
  const background = $body.find('li').eq(6).contents().last().text().substring(1);
  const submitDate = $body.find('li').eq(7).contents().last().text().substring(1);
  const result = $body.find('li').eq(8).contents().last().text().substring(1);
  const searchStatus = $body.find('li').eq(9).contents().last().text().substring(1);
  const post = {
    author, // 发帖人
    semester, // 学期
    degree, // 学位
    offer, // offer
    major, // 专业
    admission, // 录取学校
    noticeDate, // 通知时间
    undergraduate, // 本科
    GPA, // GPA
    TOEFL, // TOEFL
    GRE, // GRE
    GRE_SUB, // GRE_SUB
    background, // background
    submitDate, // 提交时间
    result, // 结果学校国家、地区
    searchStatus, // 查到status的方式
  };
  return post;
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
    const post = handlePostHtml($);
    results.push(post);
  }
  return results;
};


export { handlePageRes, handlePostRes };
