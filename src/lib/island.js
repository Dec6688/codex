export const islandTips = [
  '今天适合整理一篇旅行见闻。',
  '别忘了给文章加一个可爱的 cover emoji。',
  '海风提醒你：下载资源也可以写成 Markdown 说明。',
  '路过狸克商店时，顺手记录一个小灵感吧。',
];

// 根据真实月份判断季节：3-5 春、6-8 夏、9-11 秋、12-2 冬。
export const getSeason = (monthIndex) => {
  const month = monthIndex + 1;
  if (month >= 3 && month <= 5) return { name: '春季', icon: '🌸', mood: '樱花和嫩芽正在给小岛换新装' };
  if (month >= 6 && month <= 8) return { name: '夏季', icon: '🌻', mood: '阳光、海浪和蝉鸣正在营业' };
  if (month >= 9 && month <= 11) return { name: '秋季', icon: '🍄', mood: '落叶、蘑菇和温暖灯光很适合写作' };
  return { name: '冬季', icon: '❄️', mood: '雪地脚印和热可可陪你慢慢更新' };
};

// 根据当前小时判断早 / 中 / 晚，让首页问候更贴近打开页面时的时间。
export const getDayPart = (hour) => {
  if (hour >= 5 && hour < 11) return { name: '早晨', icon: '🌅', greeting: '早安，适合在露珠还没消失时写下新灵感' };
  if (hour >= 11 && hour < 14) return { name: '中午', icon: '☀️', greeting: '午安，阳光正好，可以整理一篇轻松的文章' };
  if (hour >= 14 && hour < 18) return { name: '下午', icon: '🍹', greeting: '下午好，海风很适合陪你慢慢改稿' };
  if (hour >= 18 && hour < 23) return { name: '夜晚', icon: '🌙', greeting: '晚上好，岛上的灯亮起来了，适合安静记录' };
  return { name: '深夜', icon: '✨', greeting: '夜深啦，写完这一点就早点休息吧' };
};
