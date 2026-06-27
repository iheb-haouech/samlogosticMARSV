import fs from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');
const files = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replaceAll('http://fb.me/use-check-prop-types', 'https://fb.me/use-check-prop-types');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
  }
}
