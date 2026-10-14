import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Match all chapters
const chapterInfo = {
  controls: {
    id: 'controls',
    vol: 'Vol.01',
    name: '基础操控与核心设置卷',
    icon: '⚙️',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    desc: 'Z30 专属单手操控流、i 菜单深度配置、脚架 d3 防震锁、U1/U2 模式固化、低光度 AF 与 3D 追踪对焦。'
  },
  landscape: {
    id: 'landscape',
    vol: 'Vol.02',
    name: '16-50mm 广角大场景风光卷',
    icon: '🏔️',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    desc: '1.6m 超焦距贴地大前景、BKT 包围曝光攻克大光比、6000万像素全景接片、全景深焦距变化拍摄与太阳 14 芒星芒。'
  },
  telephoto: {
    id: 'telephoto',
    vol: 'Vol.03',
    name: '50-250mm 长焦空间压缩卷',
    icon: '🔭',
    color: '#fb923c',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    desc: '透视扁平化叠压、建筑极简几何硬影切割、远山晨雾水墨意境、画中画远距框架构图与丁达尔神光压缩。'
  },
  nightscape: {
    id: 'nightscape',
    vol: 'Vol.04',
    name: '城市夜景与慢门流光卷',
    icon: '🌃',
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    desc: '蓝调时刻冷暖调校、立交桥车轨与 f/11 星芒、多层立体光之过山车、斜拉桥钢索夜景、隔窗消反光长曝与变焦拉焦特技。'
  },
  astronomy: {
    id: 'astronomy',
    vol: 'Vol.05',
    name: '日月天象与深空星空卷',
    icon: '✨',
    color: '#e879f9',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)',
    desc: '月面环形山与悬日特写、间隔定时星轨录制、银河核心堆栈降噪、雷暴闪电捕获与机内多重曝光变亮合成。'
  },
  portrait: {
    id: 'portrait',
    vol: 'Vol.06',
    name: '人像与人文扫街纪实卷',
    icon: '👥',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
    desc: '眼部侦测人像特写、50mm 黄金扫街视角、慢速同步闪光灯、下雨天倒影人文与黑白街头纪实调校。'
  },
  macro: {
    id: 'macro',
    vol: 'Vol.07',
    name: '微距特写与创意消除卷',
    icon: '🔬',
    color: '#a3e635',
    gradient: 'linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%)',
    desc: '50-250mm 1米近摄虚化特写、动态消人术连拍堆栈、雨后水滴倒影微距与光影质感提炼。'
  },
  color: {
    id: 'color',
    vol: 'Vol.08',
    name: '创意外观与色彩流派卷',
    icon: '🎨',
    color: '#facc15',
    gradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
    desc: '柯达金调胶片直出、富士 NC 胶片模拟风格、日系清透蓝调微调、深色电影调校与自定义色温微调。'
  }
};

const cardRegex = /<article class="tip-card" id="card-(\d+)" data-id="(\d+)" data-lens="([^"]+)" data-chap="([^"]+)">([\s\S]*?)<\/article>/g;
const tips = [];
let match;

while ((match = cardRegex.exec(html)) !== null) {
  const id = parseInt(match[1], 10);
  const lens = match[3];
  const chap = match[4];
  const body = match[5];

  // extract badges
  const catMatch = body.match(/<span class="card-badge cb-category">([^<]+)<\/span>/);
  const lensMatch = body.match(/<span class="card-badge cb-lens">([^<]+)<\/span>/);
  const mountMatch = body.match(/<span class="card-badge cb-mount">([^<]+)<\/span>/);

  // extract title & summary
  const titleMatch = body.match(/<h3 class="card-title">([\s\S]*?)<\/h3>/);
  const summaryMatch = body.match(/<p class="card-summary">([\s\S]*?)<\/p>/);

  // extract steps
  const steps = [];
  const stepRegex = /<li class="step-item">(?:<strong>([\s\S]*?)<\/strong>[：:\s]*)?([\s\S]*?)<\/li>/g;
  let sm;
  while ((sm = stepRegex.exec(body)) !== null) {
    steps.push({
      strong: sm[1] ? sm[1].trim() : '',
      text: sm[2] ? sm[2].trim() : ''
    });
  }

  // extract table rows
  const params = [];
  const tbodyMatch = body.match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (tbodyMatch) {
    const trRegex = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g;
    let trm;
    while ((trm = trRegex.exec(tbodyMatch[1])) !== null) {
      params.push({
        key: trm[1].trim(),
        val: trm[2].trim(),
        desc: trm[3].trim()
      });
    }
  }

  // extract pitfall
  const pitfallMatch = body.match(/<div class="pitfall-text">([\s\S]*?)<\/div>/);

  tips.push({
    id,
    idStr: String(id).padStart(2, '0'),
    chap,
    category: catMatch ? catMatch[1].trim() : (chapterInfo[chap]?.name || ''),
    lens,
    lensDesc: lensMatch ? lensMatch[1].trim() : '',
    mountDesc: mountMatch ? mountMatch[1].trim() : '',
    title: titleMatch ? titleMatch[1].trim() : '',
    summary: summaryMatch ? summaryMatch[1].trim() : '',
    steps,
    params,
    pitfall: pitfallMatch ? pitfallMatch[1].trim() : ''
  });
}

console.log(`Parsed ${tips.length} tips successfully!`);

// Save to data.js
const outData = {
  chapters: chapterInfo,
  tips
};

fs.writeFileSync(path.join(__dirname, 'tips_data.json'), JSON.stringify(outData, null, 2), 'utf8');
console.log('Saved tips_data.json successfully.');
