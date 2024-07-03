export default class Cell {
  constructor(label, element) {
    this.label = label;
    this.element = element;
    this.state = false;
  }

  toggle() {
    this.state = !this.state;
    this.sync();
  }

  set(newState) {
    this.state = newState;
    this.sync();
  }

  sync() {
    if (this.state)
      this.element.classList.add("active");
    else
      this.element.classList.remove("active");
  }
}
