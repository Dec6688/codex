export const islandTips = [
  '今天适合整理一篇旅行见闻。',
  '别忘了给文章加一个可爱的 cover emoji。',
  '海风提醒你：下载资源也可以写成 Markdown 说明。',
  '路过狸克商店时，顺手记录一个小灵感吧。',
];

export const getSeason = (month) => {
  if ([2, 3, 4].includes(month)) return { name: '春季', icon: '🌸', mood: '樱花和嫩芽正在给小岛换新装' };
  if ([5, 6, 7].includes(month)) return { name: '夏季', icon: '🌻', mood: '阳光、海浪和蝉鸣正在营业' };
  if ([8, 9, 10].includes(month)) return { name: '秋季', icon: '🍄', mood: '落叶、蘑菇和温暖灯光很适合写作' };
  return { name: '冬季', icon: '❄️', mood: '雪地脚印和热可可陪你慢慢更新' };
};
