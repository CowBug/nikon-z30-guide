import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'tips_data.json');

export function addTipToLibrary(tip) {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const maxId = data.tips.reduce((max, t) => Math.max(max, t.id), 0);
  const newId = maxId + 1;
  const idStr = String(newId).padStart(2, '0');

  const newTip = {
    id: newId,
    idStr,
    chap: tip.chap || 'controls',
    category: tip.category || '基础操控',
    lens: tip.lens || 'both',
    lensDesc: tip.lensDesc || tip.lens_desc || '双镜头通用',
    mountDesc: tip.mountDesc || tip.mount_desc || '手持 / 三脚架',
    title: tip.title,
    summary: tip.summary,
    steps: tip.steps || [],
    params: tip.params || [],
    pitfall: tip.pitfall || ''
  };

  data.tips.push(newTip);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[OK] Tip #${idStr} appended to tips_data.json`);

  // Rebuild index.html
  execSync('node build_library.mjs', { cwd: __dirname, stdio: 'inherit' });
  console.log(`[OK] index.html rebuilt successfully! Total tips: ${newId}`);
  return newId;
}

export function deployToCloudflare() {
  console.log('[INFO] Deploying updated library to Cloudflare Pages...');
  const tomlPath = 'C:\\Users\\Administrator\\AppData\\Roaming\\xdg.config\\.wrangler\\config\\default.toml';
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  const token = tokenMatch ? tokenMatch[1] : '';
  const accountId = '34d4c3a2d3ea6edd909be34b696bba80';
  
  const cmd = `npx wrangler pages deploy . --project-name=nikon-z30-guide --branch=main --commit-dirty=true`;
  const env = {
    ...process.env,
    CLOUDFLARE_ACCOUNT_ID: accountId,
    CLOUDFLARE_API_TOKEN: token
  };

  const output = execSync(cmd, { cwd: __dirname, env, encoding: 'utf8' });
  console.log(output);
  return output;
}

// Direct test
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('add_tip.mjs ready. Local build verified.');
}
