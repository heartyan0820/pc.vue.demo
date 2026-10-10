// 检测 ecmweb 项目中迁移脚本残留的"会运行时崩溃"的写法。
//
// 迁移脚本（TypeScript → JavaScript）已知有以下几类 bug 会造成运行时异常：
//   1. defineProps()           泛型被清空，组件实际收不到任何 props
//   2. defineEmits()           泛型被清空，emit 事件未声明
//   3. defineProps<...>()      TS 写法未转换，类型擦掉但组件功能不完整
//   4. defineEmits<...>()      同上
//   5. <script ... lang="ts">  漏改的 TS 脚本块（需要 esbuild 支持，否则浏览器直接报错）
//
// 用法：
//   pnpm verify:migration     # 扫描并以非零退出码报告问题（CI 友好）
//   pnpm verify:migration -v  # 显示每条检查的说明
//
// 修复方式：对照源项目 E:/WorkSpace/ECMWeb/ 补回运行时声明或删除 lang="ts"。
// 自动修复风险较高（每个文件需要的 props 结构不同），所以本脚本只做检测，不做改写。

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(process.cwd(), "ecmweb", "src");
const VERBOSE = process.argv.includes("--verbose") || process.argv.includes("-v");

const checks = [
  {
    id: "empty-define-props",
    title: "空的 defineProps()",
    description: "迁移脚本没转换成功，泛型被清空；运行时所有 props 都是 undefined，组件表现异常。",
    regex: /(?<![<\w])defineProps\(\s*\)/g,
  },
  {
    id: "empty-define-emits",
    title: "空的 defineEmits()",
    description: "emit 事件未声明；模板中 @click 仍能触发，但 emit() 会触发 Vue warning。",
    regex: /(?<![<\w])defineEmits\(\s*\)/g,
  },
  {
    id: "type-define-props",
    title: '类型式 defineProps<{...}>()',
    description: "在 .vue SFC 中虽然 esbuild 会擦掉类型，但运行时声明一并丢失，等同于空。",
    regex: /defineProps\s*<[^>]*>\s*\(/g,
  },
  {
    id: "type-define-emits",
    title: '类型式 defineEmits<{...}>()',
    description: "同上，运行时声明丢失。",
    regex: /defineEmits\s*<[^>]*>\s*\(/g,
  },
  {
    id: "script-lang-ts",
    title: '<script ... lang="ts"> 残留',
    description: "脚本块仍是 TypeScript；要么 esbuild 自动转译（项目支持则 OK），要么浏览器报语法错误。",
    regex: /<script\s[^>]*\blang\s*=\s*["']ts["'][^>]*>/g,
  },
];

/** @type {{file:string, checkId:string, line:number, snippet:string}[]} */
const findings = [];
let scannedFiles = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      walk(full);
    } else if (entry.isFile() && full.endsWith(".vue")) {
      scan(full);
    }
  }
}

function isInLineComment(content, idx) {
  // 取从上一个换行到 idx 之间的内容，看是否在 // 注释里（简单启发式：查找 // 即可）
  const before = content.slice(0, idx);
  const lastNewline = before.lastIndexOf("\n");
  const linePrefix = before.slice(lastNewline + 1);
  return linePrefix.indexOf("//") !== -1;
}

function scan(file) {
  scannedFiles++;
  const content = fs.readFileSync(file, "utf8");
  for (const c of checks) {
    c.regex.lastIndex = 0;
    let m;
    while ((m = c.regex.exec(content)) !== null) {
      // 跳过行内注释里的命中（避免解释性注释里的 defineProps() 字样被误报）
      if (isInLineComment(content, m.index)) continue;
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      const snippet = m[0].replace(/\s+/g, " ").trim();
      findings.push({
        file: path.relative(process.cwd(), file).replace(/\\/g, "/"),
        checkId: c.id,
        line,
        snippet: snippet.length > 80 ? snippet.slice(0, 77) + "..." : snippet,
      });
    }
  }
}

walk(ROOT);

console.log(`扫描 ${scannedFiles} 个 .vue 文件（${path.relative(process.cwd(), ROOT).replace(/\\/g, "/")}/）\n`);

if (findings.length === 0) {
  console.log("✓ 未发现迁移残留。");
  process.exit(0);
}

for (const c of checks) {
  const items = findings.filter((f) => f.checkId === c.id);
  if (items.length === 0) continue;
  console.log(`[${c.id}] ${c.title}  ×${items.length}`);
  if (VERBOSE) console.log(`    ${c.description}`);
  for (const f of items) {
    console.log(`    ${f.file}:${f.line}  ${f.snippet}`);
  }
  console.log();
}

console.log(`共发现 ${findings.length} 处问题。`);
console.log(`参考源项目 E:/WorkSpace/ECMWeb/ 补回运行时声明，详见每个文件上方注释。`);
process.exit(1);
