import Alea from './Alea.js';

const predictableSort = (seed, array) => {
  let prng = new Alea(seed);
  return array
    .map(v => [v, prng()])
    .sort((a, b) => a[1] - b[1])
    .map(v => v[0]);
}

class Game {
  constructor(container, choices) {
    this.seed = this.getSeed();

    const shuffled = predictableSort(this.seed, choices);
    const labels = [...shuffled.slice(0, 12), "FREE", ...shuffled.slice(12, 24)]
    this.cells = this.createNodes(container, labels);
    this.cells[12].set(true);

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

  changed() {
    const bitmap = this.cells.reduce((acc, cell, i) => {
      if (cell.state) return acc + (1 << i);
      else return acc;
    }, 0);
    window.location.hash = bitmap;
  }

  installHandlers() {
    this.cells.forEach(cell => {
      cell.element.addEventListener("click", (event) => {
        cell.toggle();
        this.changed();
      });
    });
  }

  getSeed() {
    const urlParams = new URLSearchParams(window.location.search);
    const suppliedSeed = urlParams.get("seed");

    if (suppliedSeed) return suppliedSeed;

    const newSeed = Math.floor(Math.random() * 1000000);
    urlParams.set("seed", newSeed);
    window.location.search = urlParams.toString();
    return newSeed;
  }
}

class Cell {
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

const choices = [
  "A Sir or Dame loses their seat",
  "Braverman loses seat",
  "Truss loses seat",
  "Sunak loses seat",
  "Jenrick loses seat",
  "Priti Patel loses seat",
  "Therese Coffey loses seat",
  "James Cleverly loses seat",
  "Rees-Mogg loses seat",
  "Shapps loses seat",
  "A Tory moans about boundary changes",
  "Labour majority over 50",
  "Labour majority over 75",
  "Labour majority over 100",
  "Labour majority over 150",
  "Sunderland first to declare",
  "Newcastle first to declare",
  "Tory seat goes to Labour",
  "Tory seat goes to Lib Dem ",
  "Tory seat goes to Reform",
  "Tory seat flips to Labour for first time ever",
  "Small boats",
  "Rwanda",
  "Trussonomics",
  "Partygate",
  "Mention of Tony Blair",
  "Mention of John Major",
  "Mention of Boris Johnson ",
  "COVID",
  "‘Better than 1997’",
  "‘A landslide’",
  "‘Supermajority’",
  "‘Blue Wall’",
  "‘Red Wall’",
  "Tory insists ‘this is not what I heard on the doorstep’",
  "Candidate swears",
  "Sighting of Count Binface ",
  "Drunk candidate interviewed",
  "Reform beaten by a joke candidate in any seat",
  "Greens win 1 seat",
  "Greens win 2 seats",
  "Greens win 3 seats",
  "Lib Dems win more than 50 seats",
  "Lib Dems win more than 60 seats"
];

const game = new Game(document.querySelector("#board"), choices);
