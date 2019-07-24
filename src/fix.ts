import { getContributes } from './config';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }));
  const contributes = await getContributes();
  packageJson.contributes = contributes;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
})();
