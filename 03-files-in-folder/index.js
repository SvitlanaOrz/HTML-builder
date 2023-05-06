const fs = require("fs");
const path = require("path");
const folderPath = "./03-files-in-folder/secret-folder";

// получаем информацию о файлах в папке secret-folder
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("Помилка зчитування папки:", err);
    return;
  }

  // фильтруем файлы игнорируя директории
  const filteredFiles = files.filter((file) => file.isFile());

  // вывод информации о каждом файле
  filteredFiles.forEach((file) => {
    const fileName = file.name;
    const fileExtension = path.extname(fileName).slice(1);
    const fileSize = getFileSize(path.join(folderPath, fileName));

    console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
  });
});

// получение размеров файлов вкилобайтах
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKb = fileSizeInBytes / 1024;
  return `${fileSizeInKb.toFixed(3)}kb`;
}
