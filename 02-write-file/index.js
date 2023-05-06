const fs = require("fs");
const readline = require("readline");

const filePath = "./02-write-file/output.txt"; // Путь к файлу, где будет сохранятся введенный текст

// Запись текста в файл
function writeToFile(text) {
  fs.appendFile(filePath, text + "\n", (err) => {
    if (err) {
      console.error("Ошибка записи в файл:", err);
    }
  });
}

// Обработка введенного текста
function handleInput(text) {
  if (text === "exit") {
    console.log("Процесс завершён.");
    process.exit(0);
  } else {
    writeToFile(text);
    console.log("Введенный текс был записан в файл");
    rl.prompt();
  }
}

// Интерфейс для считывания
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Введите текст (или "exit" для завершения): ',
});

// Обработка введения
rl.on("line", (input) => {
  handleInput(input);
});

// Запускаєм процесс
console.log('Введите текст (или "exit" для завершения):');
rl.prompt();
