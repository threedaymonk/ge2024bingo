import Alea from './Alea.js';
import Cell from './Cell.js';

const predictableSort = (seed, array) => {
  let prng = new Alea(seed);
  return array
    .map(v => [v, prng()])
    .sort((a, b) => a[1] - b[1])
    .map(v => v[0]);
}

export default class Game {
  constructor(container, choices) {
    this.seed = this.getSeed();

    const shuffled = predictableSort(this.seed, choices);
    const labels = [...shuffled.slice(0, 12), "FREE", ...shuffled.slice(12, 24)]
    this.cells = this.createNodes(container, labels);

    this.loadState();
    this.cells[12].set(true);
    this.saveState();

    this.installHandlers();
  }

  createNodes(container, labels) {
    let cells = [];
    let table = document.createElement("table");

    for(let y = 0; y < 5; y++) {
      let tr = document.createElement("tr");

      for(let x = 0; x < 5; x++) {
        let label = labels[x + 5 * y];
        let td = document.createElement("td");
        let span = document.createElement("span");
        let text = document.createTextNode(label);

        span.appendChild(text);
        td.appendChild(span);
        tr.appendChild(td);

        cells.push(new Cell(label, td));
      }
      table.appendChild(tr);
    }

    container.appendChild(table);
    
    return cells;
  }

  loadState() {
    const bitmap = parseInt(window.location.hash.slice(1));
    this.cells.forEach((cell, i) => {
      cell.set(!!(bitmap & (1 << i)));
    });
  }

  saveState() {
    const bitmap = this.cells.reduce((acc, cell, i) => {
      if (cell.state) return acc + (1 << i);
      else return acc;
    }, 0);
    window.location.hash = bitmap;
  }

  installHandlers() {
    this.cells.forEach(cell => {
      let handler = (event) => {
        cell.toggle();
        this.saveState();
      }
      cell.element.addEventListener("click", handler);
      cell.element.addEventListener("touchstart", handler);
      cell.element.addEventListener("touchend", e => e.preventDefault());
    });
  }

  getSeed() {
    const urlParams = new URLSearchParams(window.location.search);
    const suppliedSeed = urlParams.get("seed");

    if (suppliedSeed) return parseInt(suppliedSeed, 10);

    const newSeed = Math.floor(Math.random() * 1000000);
    urlParams.set("seed", newSeed);
    window.location.search = urlParams.toString();
    return newSeed;
  }
}

