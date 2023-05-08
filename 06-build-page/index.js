const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

const componentsDir = path.join(__dirname, "components");
const templatePath = path.join(__dirname, "template.html");
const outputPath = path.join(__dirname, "project-dist", "index.html");

fs.readFile(templatePath, "utf8", (err, templateContent) => {
  if (err) {
    console.error("Ошибка чтения шаблона:", err);
    return;
  }

  const replaceTags = (content, callback) => {
    const tagRegex = /\{\{(\w+)\}\}/g;
    let componentCount = 0;
    return content.replace(tagRegex, (match, tagName) => {
      const componentPath = path.join(componentsDir, `${tagName}.html`);
      if (!fs.existsSync(componentPath)) {
        console.error(`Компонент "${tagName}" не найден.`);
        return match;
      }

      componentCount++;
      fs.readFile(componentPath, "utf8", (err, componentContent) => {
        if (err) {
          console.error(`Ошибка чтения компонента "${tagName}":`, err);
          return;
        }
        content = content.replace(match, componentContent);
        componentCount--;
        if (componentCount === 0) {
          callback(content);
        }
      });
      return match;
    });
  };

  replaceTags(templateContent, (content) => {
    fsPromises
      .mkdir(path.join(__dirname, `project-dist`), { recursive: true })
      .then(() => {
        const promises = [];

        promises.push(
          fsPromises.writeFile(
            path.join(__dirname, "project-dist", "index.html"),
            content,
            "utf8"
          )
        );
        promises.push(
          fsPromises.writeFile(
            path.join(__dirname, "project-dist", "style.css"),
            "",
            "utf8"
          )
        );

        const assetsDir = path.join(__dirname, "project-dist", "assets");
        promises.push(fsPromises.mkdir(assetsDir, { recursive: true }));
        const srcAssetsDir = path.join(__dirname, "assets");

        promises.push(
          fsPromises.readdir(srcAssetsDir).then((files) => {
            const filePromises = [];
            files.forEach((file) => {
              const srcDir = path.join(srcAssetsDir, file);
              const destDir = path.join(assetsDir, file);
              filePromises.push(fsPromises.mkdir(destDir, { recursive: true }));
              filePromises.push(
                fsPromises.readdir(srcDir).then((filesT) => {
                  filesT.forEach((fileT) => {
                    const srcPath = path.join(srcDir, fileT);
                    const destPath = path.join(destDir, fileT);
                    filePromises.push(fsPromises.copyFile(srcPath, destPath));
                  });
                })
              );
            });
            return Promise.all(filePromises);
          })
        );

        Promise.all(promises)
          .then(() => {
            console.log("Все файлы успешно записаны в project-dist.");
          })
          .catch((err) => {
            console.error("Ошибка записи файлов:", err);
          });
      })
      .catch((err) => {
        console.error("Ошибка создания папки project-dist:", err);
      });
  });
});
