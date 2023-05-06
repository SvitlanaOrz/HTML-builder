const fs = require("fs");
const path = require("path");

const sourceFolderPath = "./04-copy-directory/files";
const destinationFolderPath = "./04-copy-directory/files-copy";

// копирование папки
function copyDir(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      console.error("Ошибка считывания папки:", err);
      return;
    }

    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error("Ошибка записи папки:", err);
        return;
      }

      files.forEach((file) => {
        const sourceFilePath = path.join(source, file.name);
        const destinationFilePath = path.join(destination, file.name);

        if (file.isDirectory()) {
          copyDir(sourceFilePath, destinationFilePath);
        } else {
          copyFile(sourceFilePath, destinationFilePath);
        }
      });
    });
  });
}

// укопирования файла
function copyFile(source, destination) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  readStream.on("error", (err) => {
    console.error("Ошибка считывания файла:", err);
  });

  writeStream.on("error", (err) => {
    console.error("Ошибка записи файла:", err);
  });

  readStream.pipe(writeStream);
}

// запуск функции копирования файла
copyDir(sourceFolderPath, destinationFolderPath);
