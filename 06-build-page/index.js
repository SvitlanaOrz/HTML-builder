const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

const stylesFolderPath = path.join(__dirname, "styles");
const outputFolderPath = path.join(__dirname, "project-dist");
const outputFile = "bundle.css";

function mergeStyles(stylesFolder, outputFolder, outputFile) {
  fsPromises
    .mkdir(outputFolder, { recursive: true })
    .then(() => {
      return fsPromises.readdir(stylesFolder, { withFileTypes: true });
    })
    .then((files) => {
      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === ".css"
      );
      const readPromises = cssFiles.map((file) => {
        const filePath = path.join(stylesFolder, file.name);
        return fsPromises.readFile(filePath, "utf-8");
      });
      return Promise.all(readPromises);
    })
    .then((fileContents) => {
      const mergedStyles = fileContents.join("\n");
      const outputPath = path.join(outputFolder, outputFile);
      return fsPromises.writeFile(outputPath, mergedStyles);
    })
    .then(() => {
      console.log("Создано файл bundle.css с объединенными стилями");
    })
    .catch((err) => {
      console.error("Ошибка:", err);
    });
}

async function copyAssets() {
  const assetsFolder = path.join(__dirname, "assets");
  const outputAssetsFolder = path.join(outputFolderPath, "assets");

  try {
    await fsPromises.mkdir(outputAssetsFolder, { recursive: true });
    const files = await fsPromises.readdir(assetsFolder);

    for (const file of files) {
      const sourcePath = path.join(assetsFolder, file);
      const destPath = path.join(outputAssetsFolder, file);

      const stat = await fsPromises.stat(sourcePath);
      if (stat.isDirectory()) {
        await fsPromises.mkdir(destPath, { recursive: true });
        await copyDirectory(sourcePath, destPath);
      } else {
        await fsPromises.copyFile(sourcePath, destPath);
      }
    }
    console.log("Ресурсы успешно скопированы.");
  } catch (err) {
    console.error("Ошибка при копировании ресурсов:", err);
  }
}

async function replaceTags(content) {
  const tagRegex = /\{\{(\w+)\}\}/g;
  let replacedContent = content;

  for await (const match of content.matchAll(tagRegex)) {
    const tagName = match[1];
    const componentPath = path.join(__dirname, "components", `${tagName}.html`);

    try {
      const componentContent = await fsPromises.readFile(componentPath, "utf8");
      replacedContent = replacedContent.replace(match[0], componentContent);
    } catch (err) {
      console.error(`Ошибка при чтении компонента ${tagName}.html:`, err);
    }
  }

  return replacedContent;
}

async function generateIndexHtml() {
  try {
    const templateContent = await fsPromises.readFile(
      path.join(__dirname, "template.html"),
      "utf8"
    );
    const replacedContent = await replaceTags(templateContent);
    await fsPromises.writeFile(
      path.join(outputFolderPath, "index.html"),
      replacedContent,
      "utf8"
    );
  } catch (err) {
    console.error("Ошибка при генерации index.html:", err);
  }
}
async function copyDirectory(source, destination) {
  try {
    const files = await fsPromises.readdir(source);
    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      const stat = await fsPromises.stat(sourcePath);
      if (stat.isDirectory()) {
        await fsPromises.mkdir(destPath, { recursive: true });
        await copyDirectory(sourcePath, destPath);
      } else {
        await fsPromises.copyFile(sourcePath, destPath);
      }
    }
  } catch (err) {
    console.error("Ошибка при копировании ресурсов:", err);
  }
}

async function main() {
  try {
    await mergeStyles(stylesFolderPath, outputFolderPath, outputFile);
    await copyAssets();
    await generateIndexHtml();
  } catch (err) {
    console.error("Ошибка при выполнении основной функции:", err);
  }
}

main();
