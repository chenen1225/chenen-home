const fs = require('fs');
const path = require('path');
const marked = require('marked');
const puppeteer = require('puppeteer');

async function mdToPdf(inputPath, outputPath) {
  const md = fs.readFileSync(inputPath, 'utf8');
  const html = marked.parse(md);

  const template = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MD to PDF</title>
    <link rel="stylesheet" href="file://${path.join(__dirname, 'pdf-style.css')}">
  </head>
  <body>
    <div class="markdown-body">${html}</div>
  </body>
</html>`;

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setContent(template, {waitUntil: 'networkidle0'});
  await page.pdf({path: outputPath, format: 'A4', printBackground: true});
  await browser.close();
}

async function main() {
  const input = process.argv[2] || path.join(__dirname, '..', '2.企业战略机遇分析.md');
  const output = process.argv[3] || path.join(__dirname, '..', '2.企业战略机遇分析.pdf');

  if (!fs.existsSync(input)) {
    console.error('输入文件不存在:', input);
    process.exit(2);
  }

  try {
    console.log('正在转换:', input, '->', output);
    await mdToPdf(input, output);
    console.log('转换完成:', output);
  } catch (err) {
    console.error('转换失败:', err);
    process.exit(1);
  }
}

if (require.main === module) main();
