import globby from 'globby';
import * as path from 'path';

const languageConfig = {
  markdown: ['markdown'],
  javascript: ['javascript'],
  javascriptreact: ['javascript', 'react'],
  typescript: ['javascript', 'typescript'],
  typescriptreact: ['javascript', 'react', 'typescript'],
  scss: ['scss'],
};

const cache = {};

function flatten<T>(arr: (T[] | T)[]) {
  let result: T[] = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const data = arr[i];
    if (Array.isArray(data)) {
      result = result.concat(flatten(data));
    } else {
      result.push(data);
    }
  }
  return result;
}

export async function getContributes() {
  let snippets: string[] = await globby(['**/**.json'], {
    cwd: path.join(__dirname, '../snippets/'),
    deep: true,
  });
  snippets = snippets.sort();
  for (const snippet of snippets) {
    const [language] = snippet.split('/');
    const relativePath = `./snippets/${snippet}`;
    if (cache[language]) {
      cache[language].push(relativePath);
    } else {
      cache[language] = [relativePath];
    }
  }
  const result = flatten(
    Object.keys(languageConfig).map(language => {
      return flatten(
        languageConfig[language]
          .map(snippetLanguage => cache[snippetLanguage])
          .filter(o => Array.isArray(o))
      ).map(p => ({
        language,
        path: p,
      }));
    })
  );
  return {
    snippets: result,
  };
}
