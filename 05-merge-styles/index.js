const fs = require("fs");
const path = require("path");

const stylesFolderPath = "./05-merge-styles/styles";
const outputFolderPath = "./05-merge-styles/project-dist";
const outputFile = "bundle.css";

function mergeStyles(stylesFolder, outputFolder, outputFile) {
  fs.readdir(stylesFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Ошибка считывания папки:", err);
      return;
    }
    // файлы с расширением .css
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === ".css"
    );
    // создать папку
    fs.mkdir(outputFolder, { recursive: true }, (err) => {
      if (err) {
        console.error("Ошибка создания папки:", err);
        return;
      }
      // считать и обьеденить стили
      const mergedStyles = cssFiles
        .map((file) =>
          fs.readFileSync(path.join(stylesFolder, file.name), "utf-8")
        )
        .join("\n");
      // записать стили в файл
      fs.writeFile(path.join(outputFolder, outputFile), mergedStyles, (err) => {
        if (err) {
          console.error("Ошибка записи:", err);
          return;
        }
        console.log("Создано файл bundle.css с обьедененными стилями");
      });
    });
  });
}

mergeStyles(stylesFolderPath, outputFolderPath, outputFile);
