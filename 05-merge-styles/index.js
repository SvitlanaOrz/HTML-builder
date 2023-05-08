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
      // обьеденить стили
      const readPromises = cssFiles.map((file) => {
        const filePath = path.join(stylesFolder, file.name);
        return fs.promises.readFile(filePath, "utf-8");
      });

      Promise.all(readPromises)
        .then((styles) => styles.join("\n"))
        .then((mergedStyles) => {
          // записать стили в файл
          const outputPath = path.join(outputFolder, outputFile);
          return fs.promises.writeFile(outputPath, mergedStyles);
        })
        .then(() => {
          console.log("Создан файл bundle.css с объединенными стилями");
        })
        .catch((err) => {
          console.error("Ошибка записи:", err);
        });
    });
  });
}
mergeStyles(stylesFolderPath, outputFolderPath, outputFile);
