export default class Student {
  constructor(surname, name, lastname, birthDate, startStudy, faculty) {
    this.surname = surname;
    this.name = name;
    this.lastname = lastname;
    this.startStudy = startStudy;
    this.stopStudy = startStudy + 4;
    this.birthDate = birthDate;
    this.faculty = faculty;
  }

  get fio() {
    return `${this.surname} ${this.name} ${this.lastname}`;
  }

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getBirthDateString() {
    const yyyy = this.birthDate.getFullYear();
    let mm = this.birthDate.getMonth() + 1;
    let dd = this.birthDate.getDay();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    return `${dd}.${mm}.${yyyy}`;
  }

  getStudyPeriod() {
    const currentTime = new Date();
    return (currentTime.getFullYear() - this.startStudy) >= 4 ? 'закончил' : `${currentTime.getFullYear() - this.startStudy} курс`;
  }

  getFaculty() {
    return this.faculty;
  }
}
