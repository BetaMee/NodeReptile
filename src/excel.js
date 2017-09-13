import XLSX from 'xlsx';
import path from 'path';

const exportDataToExcel = (_data) => {
  console.log('excel');
  const _headers = ['author',
    'semester',
    'degree',
    'offer',
    'major',
    'admission',
    'noticeDate',
    'undergraduate',
    'GPA',
    'TOEFL',
    'GRE',
    'GRE_SUB',
    'background',
    'submitDate',
    'result',
    'searchStatus',
  ];
  const headers = _headers
    // 为 _headers 添加对应的单元格位置
    .map((v, i) => Object.assign({}, { v, position: String.fromCharCode(65 + i) + 1 }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  const data = _data
    .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  // 合并 headers 和 data
  const output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, { '!ref': ref }),
    },
  };

  // 导出 Excel
  XLSX.writeFile(wb, path.resolve(__dirname, '../dist/testN.xlsx'));
};

export default exportDataToExcel;
