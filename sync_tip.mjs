import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addTipToLibrary, deployToCloudflare } from './add_tip.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parses raw text (e.g. copied from Gemini web chat) into structured tip object.
 */
export function parseRawTipText(text) {
  // Extract title
  let titleMatch = text.match(/(?:第\s*\d+\s*讲[：:\s]*)?(?:【标题】|标题[：:\s]*|#+\s*)?([^\n\r]+)/);
  let title = titleMatch ? titleMatch[1].replace(/^[#\s*]+/, '').trim() : "尼康 Z30 实战进阶摄影技巧";

  // Determine chapter and category based on keywords
  let chap = "controls";
  let category = "基础操控";
  let lens = "both";
  let lens_desc = "16-50mm / 50-250mm 通用";
  let mount_desc = "手持 / 三脚架";

  if (text.includes("50-250") || text.includes("长焦") || text.includes("空间压缩")) {
    chap = "telephoto";
    category = "长焦空间压缩";
    lens = "tele";
    lens_desc = "50-250mm 长焦镜头";
  } else if (text.includes("16-50") || text.includes("广角") || text.includes("大场景") || text.includes("风光")) {
    chap = "landscape";
    category = "广角风光大场景";
    lens = "wide";
    lens_desc = "16-50mm 广角镜头";
  } else if (text.includes("夜景") || text.includes("车轨") || text.includes("慢门") || text.includes("流光")) {
    chap = "nightscape";
    category = "城市夜景与慢门";
    lens = "both";
    lens_desc = "双镜头通用";
    mount_desc = "三脚架必备";
  } else if (text.includes("星空") || text.includes("月亮") || text.includes("天文") || text.includes("银河")) {
    chap = "astronomy";
    category = "日月天象与星空";
    lens = "both";
    lens_desc = "长焦/广角双头协同";
    mount_desc = "三脚架必备";
  } else if (text.includes("人像") || text.includes("扫街") || text.includes("人文") || text.includes("街拍")) {
    chap = "portrait";
    category = "人像与人文扫街";
    lens = "both";
    lens_desc = "16-50 / 50-250 双焦段";
    mount_desc = "手持抓拍";
  } else if (text.includes("微距") || text.includes("水滴") || text.includes("近摄") || text.includes("特写")) {
    chap = "macro";
    category = "微距特写与创意";
    lens = "tele";
    lens_desc = "50-250mm 长焦特写";
    mount_desc = "手持 / 独脚架";
  } else if (text.includes("色彩") || text.includes("白平衡") || text.includes("滤镜") || text.includes("色调")) {
    chap = "color";
    category = "创意外观与色彩";
    lens = "both";
    lens_desc = "全焦段适用";
  }

  // Extract Summary
  let summary = "通过精细参数控制与针对性实战构图，挖掘尼康 Z30 系统的极致成像素质。";
  let summaryMatch = text.match(/(?:【概要】|概要[：:\s]*|简介[：:\s]*|核心亮点[：:\s]*)([\s\S]*?)(?=(?:【|###|🛠️|📊|💡|操作|步骤|参数|$))/);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }

  // Extract Steps
  let steps = [];
  let stepMatches = [...text.matchAll(/(?:步骤\s*\d+|第\s*[一二三四1234]\s*步|\d+\.)[：:\s]*([^\n\r]+)/g)];
  if (stepMatches.length >= 2) {
    for (let sm of stepMatches) {
      let parts = sm[1].split(/[：:—\-]/);
      let strong = parts[0].trim();
      let stepText = parts.slice(1).join('：').trim() || strong;
      steps.push({ strong, text: stepText });
    }
  } else {
    steps = [
      { strong: "第一步：机位规划与焦段选定", text: "根据被摄主体距离锁定最佳焦段，观察光照方向。" },
      { strong: "第二步：测光与曝光微调", text: "根据场景明暗反差调整曝光补偿，确保高光不溢出。" },
      { strong: "第三步：精准对焦与稳固释放", text: "放大核验对焦点焦点锐度，配合低速连拍或延时曝光完成拍摄。" }
    ];
  }

  // Extract Params
  let params = [];
  let paramKeyVal = [...text.matchAll(/(光圈|快门|ISO|感光度|对焦|测光|优化校准|白平衡|焦段)[：:\s]*([^\n\r,，;；]+)/g)];
  if (paramKeyVal.length > 0) {
    for (let p of paramKeyVal) {
      params.push({
        key: p[1].trim(),
        val: p[2].trim(),
        desc: "根据现场光线与动态需求针对性设定"
      });
    }
  } else {
    params = [
      { key: "拍摄模式", val: "A 档（光圈优先）或 M 档", desc: "精确控制景深与动态" },
      { key: "优化校准", val: "自然 (NL) 或 风光 (LS)", desc: "保留充足直出宽容度" },
      { key: "测光模式", val: "矩阵测光", desc: "智能兼顾全景明暗平衡" }
    ];
  }

  // Extract Pitfall
  let pitfall = "拍摄前请务必确认镜头前后镜片清洁，大风天气在三脚架上务必挂载重物以避免长焦微震。";
  let pitfallMatch = text.match(/(?:【避坑】|避坑[：:\s]*|翻车预警[：:\s]*|注意事项[：:\s]*)([\s\S]*?)(?=(?:【|###|$))/);
  if (pitfallMatch) {
    pitfall = pitfallMatch[1].trim();
  }

  return {
    chap,
    category,
    lens,
    lens_desc,
    mount_desc,
    title,
    summary,
    steps,
    params,
    pitfall
  };
}

// CLI entry
const args = process.argv.slice(2);
if (args.includes('--help') || args.length === 0) {
  console.log(`
使用方式:
  1. 从文件导入并一键上线:
     node sync_tip.mjs --file today_tip.txt

  2. 从 JSON 导入并一键上线:
     node sync_tip.mjs --json tip.json

  3. 仅重新部署当前页面:
     node sync_tip.mjs --deploy-only
`);
  process.exit(0);
}

if (args.includes('--deploy-only')) {
  deployToCloudflare();
  process.exit(0);
}

let tip = null;
const fileIdx = args.indexOf('--file');
if (fileIdx !== -1 && args[fileIdx + 1]) {
  const filePath = path.resolve(process.cwd(), args[fileIdx + 1]);
  const rawText = fs.readFileSync(filePath, 'utf8');
  tip = parseRawTipText(rawText);
}

const jsonIdx = args.indexOf('--json');
if (jsonIdx !== -1 && args[jsonIdx + 1]) {
  const jsonPath = path.resolve(process.cwd(), args[jsonIdx + 1]);
  tip = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

if (tip) {
  const newId = addTipToLibrary(tip);
  console.log(`[OK] 本地已更新第 ${newId} 讲！如需发布至云端可加参数或运行发布命令。`);
}
