const path = require("path");
const globby = require("globby");
const fs = require("fs");

const languageConfig = {
  markdown: ["markdown"],
  javascript: ["javascript"],
  javascriptreact: ["javascript", "react"],
  typescript: ["javascript", "typescript"],
  typescriptreact: ["javascript", "react", "typescript"],
  scss: ["scss"]
};

const cache = {};

function flatten(arr) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

async function getContributes() {
  const snippets = await globby(["**/**.json"], {
    cwd: path.join(__dirname, "./snippets/"),
    deep: true
  });
  for (const snippet of snippets) {
    const [language] = snippet.split("/");
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
        path: p
      }));
    })
  );
  return {
    snippets: result
  };
}

(async () => {
  const packageJsonPath = path.join(__dirname, "./package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
  const contributes = await getContributes();
  packageJson.contributes = contributes;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
})();
