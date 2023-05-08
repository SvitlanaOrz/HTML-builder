const fs = require("fs");
const path = require("path");

function copyDir(sourceDir, destinationDir) {
  fs.mkdir(destinationDir, { recursive: true }, (err) => {
    if (err) {
      console.error("ошибка считывания папки:", err);
      return;
    }

    fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error("ошибка считывания папки:", err);
        return;
      }

      files.forEach((file) => {
        const sourceFilePath = path.join(sourceDir, file.name);
        const destinationFilePath = path.join(destinationDir, file.name);

        if (file.isDirectory()) {
          copyDir(sourceFilePath, destinationFilePath);
        } else {
          copyFile(sourceFilePath, destinationFilePath);
        }
      });

      // удаление файлов
      fs.readdir(
        destinationDir,
        { withFileTypes: true },
        (err, destinationFiles) => {
          if (err) {
            console.error("ошибка считывания папки:", err);
            return;
          }

          const destinationFileNames = destinationFiles.map(
            (file) => file.name
          );

          destinationFiles.forEach((file) => {
            const sourceFilePath = path.join(sourceDir, file.name);
            const destinationFilePath = path.join(destinationDir, file.name);

            if (!fs.existsSync(sourceFilePath)) {
              fs.unlink(destinationFilePath, (err) => {
                if (err) {
                  console.error("ошибка считывания файла:", err);
                }
              });
            }
          });
        }
      );
    });
  });
}

function copyFile(sourceFile, destinationFile) {
  const readStream = fs.createReadStream(sourceFile);
  const writeStream = fs.createWriteStream(destinationFile);

  readStream.on("error", (err) => {
    console.error("ошибка считывания файла:", err);
  });

  writeStream.on("error", (err) => {
    console.error("Пошибка записи файла:", err);
  });

  readStream.pipe(writeStream);
}

const sourceDir = "./04-copy-directory/files";
const destinationDir = "./04-copy-directory/files-copy";

copyDir(sourceDir, destinationDir);
