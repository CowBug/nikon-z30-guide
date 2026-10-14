import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addTipToLibrary, deployToCloudflare } from './add_tip.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'tips_data.json');

/**
 * Prompt template and Gemini API caller for generating new Nikon Z30 tips.
 */
export async function generateNewTip(apiKey) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const currentCount = data.tips.length;
  const recentTitles = data.tips.slice(-15).map(t => `#${t.idStr} ${t.title}`).join('\n');

  const prompt = `你是一位精通尼康系统的国家级资深摄影师与尼康 Z30（搭配 NIKKOR Z DX 16-50mm f/3.5-6.3 VR 与 NIKKOR Z DX 50-250mm f/4.5-6.3 VR 双套头）顶级实战专家。

目前典藏馆已有 ${currentCount} 讲实战技巧。最近的 15 讲标题如下：
${recentTitles}

请为尼康 Z30 双镜头系统原创生成第 ${currentCount + 1} 讲全新进阶摄影技巧。
【要求】：
1. 必须针对 Z30 无取景器、侧翻屏、APS-C 画幅、两只套头光圈较小（f/3.5-6.3）的真实光学特性。
2. 内容真实、专业、硬核、可实操，严禁假大空。
3. 请从以下 8 大分卷中挑选一个最适合的主题：
   - controls (基础操控与核心设置卷)
   - landscape (16-50mm 广角大场景风光卷)
   - telephoto (50-250mm 长焦空间压缩卷)
   - nightscape (城市夜景与慢门流光卷)
   - astronomy (日月天象与深空星空卷)
   - portrait (人像与人文扫街纪实卷)
   - macro (微距特写与创意消除卷)
   - color (创意外观与色彩流派卷)
4. 输出必须为纯 JSON，不要包含任何 markdown 代码块（如 \`\`\`json ），直接返回合法的 JSON 对象。

【JSON 格式规范】：
{
  "chap": "所选专题英文ID，如 landscape 或 telephoto",
  "category": "专题中文名称，如 广角风光大场景",
  "lens": "wide 或 tele 或 both",
  "lensDesc": "镜头描述，如 50-250mm 长焦镜头",
  "mountDesc": "机位支撑，如 三脚架必备 或 手持抓拍",
  "title": "技巧大标题（格式：[镜头焦段] [拍摄场景]——[核心技术要点]）",
  "summary": "2-3句话阐明核心价值与视觉目标",
  "steps": [
    { "strong": "步骤一动作要领", "text": "机位与取景具体操作" },
    { "strong": "步骤二动作要领", "text": "测光、对焦与参数设置" },
    { "strong": "步骤三动作要领", "text": "快门释放与画面核验" }
  ],
  "params": [
    { "key": "焦段推荐", "val": "具体毫米数（如 16mm 或 200mm）", "desc": "设定理由" },
    { "key": "曝光模式与光圈", "val": "A档 / f/8", "desc": "设定理由" },
    { "key": "快门速度", "val": "具体快门（如 1/250s 或 2.5s）", "desc": "设定理由" },
    { "key": "ISO 与对焦", "val": "ISO 100 / 单点AF", "desc": "设定理由" },
    { "key": "色彩与VR", "val": "优化校准与防抖设定", "desc": "设定理由" }
  ],
  "pitfall": "针对该场景的典型翻车预警与大师级避坑秘诀（100字左右）"
}`;

  const candidateModels = [
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];

  let rawText = null;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      console.log(`[INFO] Attempting generation with ${model} for Tip #${currentCount + 1}...`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[WARN] Model ${model} returned status ${response.status}. Trying next...`);
        lastError = new Error(`Gemini API Error (${response.status}): ${errText}`);
        continue;
      }

      const result = await response.json();
      rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        console.log(`[SUCCESS] Generated successfully using ${model}!`);
        break;
      }
    } catch (e) {
      console.warn(`[WARN] Model ${model} failed with: ${e.message}`);
      lastError = e;
    }
  }

  if (!rawText) {
    throw lastError || new Error('All Gemini model candidates failed');
  }

  const tipObj = JSON.parse(rawText.trim());
  return tipObj;
}

// CLI runner
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(`
[ERROR] 未检测到 GEMINI_API_KEY 环境变量！
使用说明：
  1. 请先设置环境变量：$env:GEMINI_API_KEY="你的GeminiKey"
  2. 运行自动生成与发布：node daily_auto_generate.mjs
`);
    process.exit(1);
  }

  try {
    const newTip = await generateNewTip(apiKey);
    console.log('[OK] Gemini 成功生成新技巧：', newTip.title);
    const newId = addTipToLibrary(newTip);
    console.log(`[OK] 本地已同步第 ${newId} 讲！`);

    // Auto deploy if --deploy flag passed or by default in cloud
    if (process.argv.includes('--deploy') || process.env.AUTO_DEPLOY === 'true') {
      deployToCloudflare();
      console.log('[SUCCESS] 线上网站已自动更新上线：https://nikon-z30-guide.pages.dev');
    }
  } catch (err) {
    console.error('[FAILED] 自动生成失败：', err);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
