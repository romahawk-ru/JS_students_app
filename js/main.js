import Student from './students.js';

// Валидация
const validation = new window.JustValidate('#add-student');

validation
  .addField('#input-surname', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Фамилия должна быть более 2 символов',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Фамилия должна быть менее 30 символов',
    },
  ])
  .addField('#input-name', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Имя должно быть более 2 символов',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Имя должно быть менее 30 символов',
    },
  ])
  .addField('#input-lastname', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Отчество должно быть более 2 символов',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Отчество должно быть менее 30 символов',
    },
  ])
  .addField('#input-birthDate', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      plugin: JustValidatePluginDate(() => ({
        required: true,
        format: 'dd.MM.yyyy',
        isBefore: '26.08.2023',
        isAfter: '01.01.1899',
      })),
      errorMessage: 'Дата должна быть в промежутке от 01.01.1900 до 24.08.2023',
    },
  ])
  .addField('#input-startStudy', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      rule: 'number',
      errorMessage: 'Год начала обучения должен числом',
    },
    {
      rule: 'minNumber',
      value: 2000,
      errorMessage: 'Год начала обучения должен быть не раньше 2000',
    },
    {
      rule: 'maxNumber',
      value: 2023,
      errorMessage: 'Год начала обучения должен быть не позже 2023',
    },
  ])
  .addField('#input-faculty', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно для заполнения',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Факультет должен быть не менее 3 символов',
    },
    {
      rule: 'maxLength',
      value: 30,
      errorMessage: 'Факультет должен быть не более 30 символов',
    },
  ]);

// Массив студентов
const students = [
  new Student('Анисимов', 'Антон', 'Алексеевич', new Date(1991, 2, 21), 2011, 'Дизайн'),
  new Student('Данилов', 'Дмитрий', 'Денисович', new Date(2001, 7, 20), 2022, 'Фронтенд'),
  new Student('Гаврилов', 'Георгий', 'Григорьевич', new Date(1965, 2, 2), 2014, 'История'),
  new Student('Владимиров', 'Владимир', 'Владимирович', new Date(1987, 1, 23), 2001, 'История'),
  new Student('Борисов', 'Борис', 'Борисович', new Date(1993, 4, 11), 2021, 'Фронтенд'),
];

let column = 'fio';
let columnDir = true;

// Создание элементов
const $studentList = document.getElementById('studentsList');
const $studentListTHALL = document.querySelectorAll('.table th');

// Форма добавления нового студента
const $addForm = document.getElementById('add-student');
const $nameInp = document.getElementById('input-name');
const $surenameInp = document.getElementById('input-surname');
const $lastnameInp = document.getElementById('input-lastname');
const $birthDateInp = document.getElementById('input-birthDate');
const $startStudyInp = document.getElementById('input-startStudy');
const $facultyInp = document.getElementById('input-faculty');
const $addStudentBtn = document.getElementById('add-student-btn');

// Форма фильтрации
const $filterForm = document.getElementById('filter-form');
const $getFio = document.getElementById('input-search-fio');
const $getFaculty = document.getElementById('input-search-faculty');
const $getStartStudy = document.getElementById('input-search-start-study');
const $getStopStudy = document.getElementById('input-search-stop-study');

// Добавление "Правильного" постфикса к возрасту
function ageYearOrYears(age) {
  let txt;
  let count = age % 100;
  // eslint-disable-next-line no-unused-expressions,no-nested-ternary,no-sequences
  count >= 5 && count <= 20 ? (txt = 'лет') : (count %= 10), count === 1
    ? (txt = 'год')
    : count >= 2 && count <= 4 ? (txt = 'года') : (txt = 'лет');
  return `${age} ${txt}`;
}

// Получиние TR одного студента
function newStudentTR(student) {
  const $studentTR = document.createElement('tr');
  const $fioTD = document.createElement('td');
  const $facultyTD = document.createElement('td');
  const $birthDateTD = document.createElement('td');
  const $startStudyTD = document.createElement('td');

  $fioTD.textContent = student.fio;
  $facultyTD.textContent = student.getFaculty();
  $birthDateTD.textContent = `${student.getBirthDateString()} (${ageYearOrYears(student.getAge())})`;
  $startStudyTD.textContent = `${student.startStudy} - ${student.startStudy + 4} (${student.getStudyPeriod()})`;

  $studentTR.append($fioTD);
  $studentTR.append($facultyTD);
  $studentTR.append($birthDateTD);
  $studentTR.append($startStudyTD);

  return $studentTR;
}

// Функция фильтрации
function filter(arr, prop, value) {
  const result = [];
  const copyArray = [...arr];
  for (const item of copyArray) {
    if (String(item[prop]).includes(value) === true) result.push(item);
  }
  return result;
}

// Функция отрисовки
function render() {
  $studentList.innerHTML = '';
  let studentsCopy = [...students];

  // Сортировка
  studentsCopy = studentsCopy.sort((a, b) => {
    let sort = a[column] < b[column];
    if (columnDir === false) sort = a[column] > b[column];
    return sort ? -1 : 1;
  });

  // Фильтрация
  if ($getFio.value.trim() !== '') {
    studentsCopy = filter(studentsCopy, 'fio', $getFio.value);
  }

  if ($getFaculty.value.trim() !== '') {
    studentsCopy = filter(studentsCopy, 'faculty', $getFaculty.value);
  }

  if ($getStartStudy.value.trim() !== '') {
    studentsCopy = filter(studentsCopy, 'startStudy', $getStartStudy.value);
  }

  if ($getStopStudy.value.trim() !== '') {
    studentsCopy = filter(studentsCopy, 'stopStudy', $getStopStudy.value);
  }

  // Отрисовка
  for (const student of studentsCopy) {
    const $newTr = newStudentTR(student);
    $studentList.append($newTr);
  }
}

// Обработка кликов по заголовкам колонки (событие сортировки)
$studentListTHALL.forEach((element) => {
  element.addEventListener('click', function() {
    column = this.dataset.column;
    columnDir = !columnDir;
    render();
  });
});

// Добавление нового студента
$addForm.addEventListener('submit', (event) => {
  // отменяем стандартное поведение формы
  event.preventDefault();

  // Валидация
  // Проверяем у каждого инпута отсутствие класса с ошибкой,
  // если отсутствуют таковые - добавляем студента,
  // очищаем инпуты и отрисовываем.
  if ($surenameInp.classList.contains('just-validate-error-field') === false && $nameInp.classList.contains('just-validate-error-field') === false && $lastnameInp.classList.contains('just-validate-error-field') === false && $birthDateInp.classList.contains('just-validate-error-field') === false && $startStudyInp.classList.contains('just-validate-error-field') === false && $facultyInp.classList.contains('just-validate-error-field') === false) {

    // Добавление студента
    students.push(new Student(
      $surenameInp.value.trim(),
      $nameInp.value.trim(),
      $lastnameInp.value.trim(),
      new Date($birthDateInp.value),
      Number($startStudyInp.value.trim()),
      $facultyInp.value.trim(),
    ));

    // Очистка инпутов
    event.target.reset();
    // Запуск функции отрисовки
    render(students);
  }
});

// Автоматическая фильтрация при вводе в инпуты
$filterForm.addEventListener('submit', (event) => {
  // отменяем стандартное поведение формы
  event.preventDefault();
});

$getFio.addEventListener('input', () => {
  $getFio.value.toLowerCase();
  render(students);
});

$getFaculty.addEventListener('input', () => {
  render(students);
});

$getStartStudy.addEventListener('input', () => {
  render(students);
});

$getStopStudy.addEventListener('input', () => {
  render(students);
});

// Запуск функции отрисовки
render(students);
