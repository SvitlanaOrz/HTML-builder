const fs = require("fs");
const path = require("path");
const folderPath = "./03-files-in-folder/secret-folder";

// получаем информацию о файлах в папке secret-folder
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("Ошибка считывания папки:", err);
    return;
  }

  // фильтруем файлы игнорируя директории
  const filteredFiles = files.filter((file) => file.isFile());

  // вывод информации о каждом файле
  filteredFiles.forEach((file) => {
    const fileName = file.name;
    const fileExtension = path.extname(fileName).slice(1);

    fs.stat(path.join(folderPath, fileName), (err, stats) => {
      if (err) {
        console.error("Помилка отримання інформації про файл:", err);
        return;
      }

      const fileSizeInKb = stats.size / 1024;

      console.log(
        `${fileName} - ${fileExtension} - ${fileSizeInKb.toFixed(3)}kb`
      );
    });
  });
});
