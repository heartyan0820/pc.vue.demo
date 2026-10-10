// 验证两个项目的入口 index.html 是否正确。
// 用法：
//   pnpm verify:entry          # 仅检查，发现问题退出码 1
//   pnpm fix:entry             # 自动恢复到下面的标准内容
//
// 为什么需要它：5173（app1）的 Vite 根目录是 pc.vue.demo/，@ 别名指向本项目 src/；
// 如果根 index.html 被改成加载 ecmweb/src/main.js，@/store 等会全部解析失败。
// 同样的坑也存在于 ecmweb/index.html。

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ROOT_INDEX = path.join(ROOT, "index.html");
const ECMWEB_INDEX = path.join(ROOT, "ecmweb", "index.html");
const FIX = process.argv.includes("--fix");

// ——— 标准内容（与可工作的 dev server 严格一致） ———

const APP1_OK = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>订单管理系统</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- app1 入口：只引用本项目 /src/main.js。
         千万不要改成 ecmweb/src/main.js —— 5173 的 @ 别名指向 pc.vue.demo/src，
         加载 ecmweb 后会报 "Failed to resolve @/store/@/plugins"。
         想开 ecmweb 请用 pnpm dev:ecmweb 或 pnpm dev:all。 -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;

const ECMWEB_OK = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>易齿盟</title>
    <meta name="keywords" content="易齿盟|e齿盟|E齿盟众硕|众硕慧通">
    <meta name="description" content="易齿盟是一个为口腔门诊提供整体数字化解决方案的平台.我们提供简便快捷的电子定单系统,先进的即时3D数字云会诊平台,专业的专家级技师技术支持,义齿从下单到生产的全流程监督.作为一站式服务平台，我们用最先进的技术和最优质的服务,全流程赋能口腔门诊.">
    <script type="module" src="/images/JsBarcode.js"></script>
  </head>

  <body>
    <div id="app">
      <div class="loader"></div>
    </div>
  </body>
  <script type="module" src="/src/main.js"></script>
  <style>
   html, body {
  width: 100%;
  min-width: fit-content; /* 关键：处理横向滚动 */
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  min-height: 100vh;
}

    .loader {
      --d: 22px;
      width: 4px;
      height: 4px;
      color: #254fb0;
      border-radius: 50%;
      box-shadow:
        calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
        calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
        calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
        calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
        calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
        calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
        calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
      animation: l27 1s infinite steps(8);
    }

    @keyframes l27 {
      100% {
        transform: rotate(1turn);
      }
    }
  </style>
</html>
`;

// ——— 检查逻辑 ———

function isApp1Ok(content) {
  // app1 入口必须是 /src/main.js，且不能引用 ecmweb/src
  return (
    /<script\s+type="module"\s+src="\/src\/main\.js"/.test(content) &&
    !/src=["']ecmweb\/src\//.test(content)
  );
}

function isEcmwebOk(content) {
  // ecmweb 入口必须是 /src/main.js
  return /<script\s+type="module"\s+src="\/src\/main\.js"/.test(content);
}

function detectProblem(content) {
  if (/src=["']ecmweb\/src\/main\.[jt]s/.test(content)) {
    return "入口被改成了 ecmweb/src/main.js";
  }
  if (/<script\s+type="module"\s+src="\/src\/main\./.test(content)) {
    return "入口指向了 /src/main.ts（应当是 .js）";
  }
  if (!/<script\s+type="module"/.test(content)) {
    return "找不到任何 <script type=\"module\"> 入口";
  }
  return "未知异常";
}

let problems = 0;

function checkOne(label, file, isOk, goodContent) {
  if (!fs.existsSync(file)) {
    console.log(`!! ${label}: 文件不存在 (${path.relative(ROOT, file)})`);
    problems++;
    if (FIX) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, goodContent, "utf8");
      console.log(`   ↳ 已重新创建`);
    }
    return;
  }
  const content = fs.readFileSync(file, "utf8");
  if (isOk(content)) {
    console.log(`OK  ${label}`);
    return;
  }
  console.log(`!! ${label}: ${detectProblem(content)}`);
  problems++;
  if (FIX) {
    fs.writeFileSync(file, goodContent, "utf8");
    console.log(`   ↳ 已恢复为标准内容`);
  }
}

console.log("=== 检查两个项目的入口 index.html ===");
checkOne("app1     (根 index.html)         ", ROOT_INDEX, isApp1Ok, APP1_OK);
checkOne("ecmweb   (ecmweb/index.html)    ", ECMWEB_INDEX, isEcmwebOk, ECMWEB_OK);

console.log("");
if (FIX) {
  if (problems === 0) {
    console.log("两个项目入口都正确，无需修复。");
  } else {
    console.log(`已修复 ${problems} 个文件。重启 dev server 后生效：pnpm dev:all`);
  }
  process.exit(0);
} else {
  if (problems === 0) {
    console.log("两个项目入口都正确 ✓");
    process.exit(0);
  } else {
    console.log(`发现问题 ${problems} 个。运行 \`pnpm fix:entry\` 自动修复。`);
    process.exit(1);
  }
}
