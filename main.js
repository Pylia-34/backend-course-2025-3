const fs = require('fs');
const { program } = require('commander');

program
  .requiredOption('-i, --input <path>', 'Шлях до вхідного файлу')
  .option('-o, --output <path>', 'Шлях до файлу результату')
  .option('-d, --display', 'Вивести результат у консоль')
  .option('-c, --cylinders', 'Показати кількість циліндрів')
  .option('-m, --mpg <number>', 'Фільтр: економність менша за значення');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Будь ласка, вкажіть вхідний файл");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Не вдалося знайти вхідний файл");
  process.exit(1);
}

//Читання файлу (NDJSON)
const fileContent = fs.readFileSync(options.input, 'utf-8');

let data = fileContent
  .trim()
  .split('\n')
  .map(line => JSON.parse(line));

let result = data;

if (options.mpg) {
  result = result.filter(car => car.mpg < Number(options.mpg));
}

const output = result.map(car => {
  let line = `${car.model}`;

  if (options.cylinders) {
    line += ` ${car.cyl}`;
  }

  line += ` ${car.mpg}`;

  return line;
}).join('\n');

if (!options.output && !options.display) {
  process.exit(0);
}

if (options.output) {
  fs.writeFileSync(options.output, output);
}

if (options.display) {
  console.log(output);
}