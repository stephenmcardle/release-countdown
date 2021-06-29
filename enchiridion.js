let one;
let two;
let three;
let five;
let ten;
let twenty;
let oneHundred;
let twoHundred;

let iterations = 0;
let styles;
let canvas;
let ctx;
const fleets = {};

let globalStyles;

let rectangles;

let cantarell_bold;
function preload() {
  cantarell_bold = loadFont("assets/Cantarell-Bold.otf");
}

function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = projectNum * 1000000 + Math.floor(Math.random() * 1000);
  return data;
}
let tokenData = genTokenData();

const hashPairs = [];
for (let j = 0; j < 32; j++) {
  hashPairs.push(tokenData.hash.slice(2 + j * 2, 4 + j * 2));
}
const decPairs = hashPairs.map((x) => parseInt(x, 16));
let seed = parseInt(tokenData.hash.slice(0, 16), 16);

function setup() {
  noiseSeed(seed);
  styles = new Styles();
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.width = 200;
  canvas.height = 200;
  background(0);
  ctx = canvas.drawingContext;
  textFont(cantarell_bold);

  // Relative values based on 1080x1080 canvas
  one = width / 1080;
  two = width / 540;
  three = width / 360;
  five = width / 216;
  ten = width / 108;
  twenty = width / 54;
  oneHundred = width / 10.8;
  twoHundred = width / 5.4;

  fill(0);
  stroke(100);
  strokeWeight(one);

  globalStyles = new GlobalStyles();

  let x;
  let y;
  let fleetWidth;
  let fleetHeight;
  x = 0;
  y = 0;
  fleetWidth = width;
  fleetHeight = height;
  rectangles = createFleet(
    0,
    fleetWidth - ten,
    fleetHeight - ten,
    x + five,
    y + five
  );
  // noLoop();
}

function draw() {
  const release = moment("2021-07-05T12:00:00-04:00");
  const diff = release - moment.now();
  const time = msToTime(diff);
  background(0);
  push();
  translate(fleets[0].x, fleets[0].y);
  rectangles.forEach((rct) => {
    rct.show();
  });
  pop();
  push();
  stroke(255);
  translate(width / 2, height / 2);
  push();
  strokeWeight(three);
  rectMode(CENTER);
  if (isCursorInRectangle()) {
    fill(20, 200);
  } else {
    fill(0, 200);
  }
  rect(0, 0, width / 3, height / 4);
  pop();
  strokeWeight(one);
  textAlign(CENTER);
  fill(255);
  textSize(oneHundred / 3);
  text("Enchiridion", 0, -oneHundred / 3);
  textSize(ten);
  text("July 5th 12:00 EDT", 0, -ten);
  text("256 mints @ .08 ETH", 0, ten);
  if (diff > 0) {
    textSize(ten + five);
    text(time, 0, oneHundred / 2);
  } else {
    textSize(twenty + ten);
    text("LIVE", 0, oneHundred / 2);
  }
  textSize();
  pop();
}

const d = 1000 * 60 * 60 * 24;
const h = 1000 * 60 * 60;
const m = 1000 * 60;
const s = 1000;

function msToTime(ms) {
  if (ms <= 0) {
    return null;
  }
  const days = Math.floor(ms / d);
  ms -= days * d;
  const hours = Math.floor(ms / h);
  ms -= hours * h;
  const minutes = Math.floor(ms / m);
  ms -= minutes * m;
  const seconds = Math.floor(ms / s);
  return `${days} Day${days === 1 ? "" : "s"} ${hours} Hour${
    hours === 1 ? "" : "s"
  } ${minutes} Minute${minutes === 1 ? "" : "s"} ${seconds} Second${
    seconds === 1 ? "" : "s"
  }`;
}

function isCursorInRectangle() {
  return (
    mouseX > width / 3 &&
    mouseX < (width * 2) / 3 &&
    mouseY > (height * 3) / 8 &&
    mouseY < (height * 5) / 8
  );
}

function mouseMoved() {
  if (isCursorInRectangle()) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mouseClicked() {
  if (isCursorInRectangle()) {
    window.location = "https://artblocks.io/project/101";
  }
}

function createFleet(id, fleetWidth, fleetHeight, x, y) {
  const fleet = new Fleet(id, fleetWidth, fleetHeight, x, y);
  fleets[id] = fleet;
  fleet.decideStyle();
  push();
  translate(fleet.x, fleet.y);
  fleet.draw();
  pop();
  return fleet.rectangles;
}

class Fleet {
  constructor(id, fleetWidth, fleetHeight, x, y) {
    this.id = id;
    this.fleetWidth = fleetWidth;
    this.fleetHeight = fleetHeight;
    this.x = x;
    this.y = y;
    this.colorPalette;
    this.strokeColor;
    this.lightColorPalette;
    this.rectangleDecoration;
    this.rectangles = [];
    this.percentWidthChop;
    this.percentHeightChop;
    this.percentRepeatChop;
  }

  decideStyle() {
    this.colorPalette = globalStyles.colorPalette;
    this.lightColorPalette = this.getLighterColors(this.colorPalette);

    this.percentWidthChop = rnd(0.01, 0.3);
    this.percentHeightChop = rnd(0.01, 0.3);
    this.percentRepeatChop = rnd(0.01, 0.2);

    let k = decPairToPercent(decPairs[1]);
    if (k < 0.09) {
      this.rectangleDecoration = styles.rectangleDecoration.PERPENDICULAR_LINES;
    } else if (k < 0.18) {
      this.rectangleDecoration = styles.rectangleDecoration.PARALLEL_LINES;
    } else if (k < 0.27) {
      this.rectangleDecoration = styles.rectangleDecoration.CROSS_HATCH;
    } else if (k < 0.315) {
      this.rectangleDecoration = styles.rectangleDecoration.MIXED_LINES_NOISE;
    } else if (k < 0.36) {
      this.rectangleDecoration = styles.rectangleDecoration.MIXED_LINES_RANDOM;
    } else if (k < 0.43) {
      this.rectangleDecoration = styles.rectangleDecoration.GRADIENT;
    } else if (k < 0.52) {
      this.rectangleDecoration = styles.rectangleDecoration.SPECKS_RANDOM;
    } else if (k < 0.61) {
      this.rectangleDecoration = styles.rectangleDecoration.SPECKS_GRID;
    } else if (k < 0.69) {
      this.rectangleDecoration = styles.rectangleDecoration.RANDOM;
    } else if (k < 0.77) {
      this.rectangleDecoration = styles.rectangleDecoration.NOISE;
    } else {
      this.rectangleDecoration = styles.rectangleDecoration.NONE;
    }
    this.rectangleDecoration = styles.rectangleDecoration.NONE;
  }

  draw() {
    this.rectangles = this.drawRect(
      0,
      0,
      this.fleetWidth,
      this.fleetHeight,
      rndFromArray(this.colorPalette),
      0
    );
    this.rectangles.forEach((rectangle) => {
      push();
      rectangle.show();
      pop();
    });
  }

  drawRect(x, y, w, h, randomColor, i) {
    const randPercent = rnd();
    const splitWidth = randPercent < this.percentWidthChop;
    const splitHeight =
      randPercent < this.percentWidthChop + this.percentHeightChop &&
      randPercent > this.percentWidthChop;
    const splitRepeat =
      randPercent <
        this.percentWidthChop +
          this.percentHeightChop +
          this.percentRepeatChop &&
      randPercent > this.percentWidthChop + this.percentHeightChop; // TODO fix this weird logic
    const splitWhere = rnd(0.3, 0.7);

    // if we're splitting the width
    if (splitWidth && w > twenty) {
      const rects1 = this.drawRect(
        x,
        y,
        w * splitWhere,
        h,
        this.getRandomColor(randomColor),
        i + 1
      );
      const rects2 = this.drawRect(
        x + w * splitWhere,
        y,
        w * (1 - splitWhere),
        h,
        this.getRandomColor(randomColor),
        i + 1
      );
      return [...rects1, ...rects2];
    }

    // else if we're splitting the height
    if (splitHeight && h > twenty) {
      const rects1 = this.drawRect(
        x,
        y,
        w,
        h * splitWhere,
        this.getRandomColor(randomColor),
        i + 1
      );
      const rects2 = this.drawRect(
        x,
        y + h * splitWhere,
        w,
        h * (1 - splitWhere),
        this.getRandomColor(randomColor),
        i + 1
      );
      return [...rects1, ...rects2];
    }

    if (splitRepeat && x > ten && y > ten) {
      const numRepetitionsX = floor(rnd(1, min(w / ten, 6))) || 1;
      const numRepetitionsY = floor(rnd(1, min(h / ten, 6))) || 1;
      const clones = this.drawRect(
        x,
        y,
        w / numRepetitionsX,
        h / numRepetitionsY,
        this.getRandomColor(randomColor),
        i + 1
      );
      const all = [];
      for (let repetitionX = 0; repetitionX < numRepetitionsX; repetitionX++) {
        for (
          let repetitionY = 0;
          repetitionY < numRepetitionsY;
          repetitionY++
        ) {
          for (let i = 0; i < clones.length; i++) {
            if (repetitionX === 0 && repetitionY === 0) continue;
            let r = clones[i];
            all.push(
              new Rectangle(
                r.x + (w / numRepetitionsX) * repetitionX,
                r.y + (h / numRepetitionsY) * repetitionY,
                r.w,
                r.h,
                r.color,
                r.strokeColor,
                r.decoration,
                r.fleetId,
                r.depth
              )
            );
          }
        }
      }
      return [...clones, ...all];
    }

    const rectangle = new Rectangle(
      x + noiseToVal(x, y, -five, five),
      y + noiseToVal(x, y, -five, five),
      w,
      h,
      randomColor,
      this.strokeColor,
      this.rectangleDecoration,
      this.id,
      i
    );
    let children = [];
    if (w > oneHundred && h > oneHundred / 2) {
      children = this.drawRect(
        x + five,
        y + five,
        w - ten,
        h - ten,
        this.getRandomColor(randomColor),
        ++i
      );
    }
    iterations = max(iterations, i);
    return [rectangle, ...children];
  }

  getRandomColor(randomColor) {
    if (rnd() < globalStyles.colorCohesion) {
      return rndFromArray(this.colorPalette);
    }
    return randomColor;
  }

  setColors() {
    this.strokeColor = color(0);
  }

  getLighterColors() {
    const lightColorArray = [];
    this.colorPalette.forEach((c) => {
      lightColorArray.push(this.getLighterColor(c));
    });
    return lightColorArray;
  }

  getLighterColor(c) {
    const r = c.levels[0] + 20;
    const g = c.levels[1] + 20;
    const b = c.levels[2] + 20;
    return color(r, g, b);
  }
}

class Rectangle {
  constructor(x, y, w, h, color, strokeColor, decoration, fleetId, depth) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.strokeColor = strokeColor;
    this.originalColor = color;
    this.originalStrokeColor = strokeColor;
    this.colorIndex = fleets[fleetId].colorPalette.indexOf(this.originalColor);
    this.strokeColorIndex = fleets[fleetId].colorPalette.indexOf(
      this.originalStrokeColor
    );
    this.decoration = decoration;
    this.direction = this.w > this.h ? 0 : 1;
    this.specks = [];
    this.fleetId = fleetId;
    this.depth = depth;

    this.decorationHelper();
  }

  decorationHelper() {
    const mixedLinesArray = [
      styles.rectangleDecoration.PERPENDICULAR_LINES,
      styles.rectangleDecoration.PARALLEL_LINES,
      styles.rectangleDecoration.CROSS_HATCH,
    ];
    if (this.decoration === styles.rectangleDecoration.MIXED_LINES_RANDOM) {
      this.decoration = rndFromArray(mixedLinesArray);
    } else if (
      this.decoration === styles.rectangleDecoration.MIXED_LINES_NOISE
    ) {
      const index = floor(
        map(
          noise(this.x / oneHundred, this.y / oneHundred),
          0,
          1,
          0,
          mixedLinesArray.length
        )
      );
      this.decoration = mixedLinesArray[index];
    }
    if (this.decoration === styles.rectangleDecoration.RANDOM) {
      this.decoration = rndFromArray(
        styles.rectangleDecorationsForRandomAndNoise
      );
    } else if (this.decoration === styles.rectangleDecoration.NOISE) {
      this.decoration =
        styles.rectangleDecorationsForRandomAndNoise[
          floor(
            map(
              noise(this.x / oneHundred, this.y / oneHundred),
              0,
              1,
              0,
              styles.rectangleDecorationsForRandomAndNoise.length
            )
          )
        ];
    }
    if (this.decoration === styles.rectangleDecoration.PARALLEL_LINES) {
      this.direction = 1 - this.direction;
    }
    if (this.decoration === styles.rectangleDecoration.SPECKS_RANDOM) {
      this.specks = this.getRandomSpecks(
        floor(map(max(this.w, this.h), 0, width, 1, 64))
      );
    }
  }

  show() {
    rect(this.x, this.y, this.w, this.h);
    push();
    // this.drawDecoration();
    pop();
  }

  drawDecoration() {
    if (
      [
        styles.rectangleDecoration.PERPENDICULAR_LINES,
        styles.rectangleDecoration.PARALLEL_LINES,
        styles.rectangleDecoration.CROSS_HATCH,
      ].includes(this.decoration)
    ) {
      const numLines = floor(
        map(
          this.decoration === styles.rectangleDecoration.PARALLEL_LINES
            ? min(this.w, this.h)
            : max(this.w, this.h),
          0,
          width,
          1,
          100
        )
      );
      if (this.decoration === styles.rectangleDecoration.CROSS_HATCH) {
        this.direction = null;
        const numHorizontalLines = floor(map(this.w, 0, width, 1, 50));
        const numVerticalLines = floor(map(this.h, 0, height, 1, 50));
        this.drawHorizontalLines(numHorizontalLines);
        this.drawVerticalLines(numVerticalLines);
      }
      if (this.direction === 0) {
        this.drawHorizontalLines(numLines);
      } else if (this.direction === 1) {
        this.drawVerticalLines(numLines);
      }
    } else if (this.decoration === styles.rectangleDecoration.SPECKS_RANDOM) {
      this.drawSpecksRandom();
    } else if (this.decoration === styles.rectangleDecoration.SPECKS_GRID) {
      const numHorizontal = floor(map(this.w, 0, width, 1, 50));
      const numVertical = floor(map(this.h, 0, height, 1, 50));
      this.drawSpecksGrid(numHorizontal, numVertical);
    } else if (this.decoration === styles.rectangleDecoration.GRADIENT) {
      this.drawGradient();
    }
  }

  drawHorizontalLines(numLines) {
    for (let i = 1; i <= numLines; i++) {
      const x = this.x + map(i, 0, numLines + 1, one / 2, this.w - one / 2);
      const y1 = this.y + three / 2 + one / 2;
      const y2 = this.y + this.h - three / 2 - one / 2;
      line(x, y1, x, y2);
    }
  }

  drawVerticalLines(numLines) {
    for (let i = 1; i <= numLines; i++) {
      const y = this.y + map(i, 0, numLines + 1, one / 2, this.h - one / 2);
      const x1 = this.x + three / 2 + one / 2;
      const x2 = this.x + this.w - three / 2 - one / 2;
      line(x1, y, x2, y);
    }
  }

  getRandomSpecks(numSpecks) {
    const specks = [];
    for (let i = 0; i < numSpecks; i++) {
      const x = rnd(this.x + three / 2, this.x + this.w - three / 2);
      const y = rnd(this.y + three / 2, this.y + this.h - three / 2);
      specks.push(new Speck(x, y));
    }
    return specks;
  }

  drawSpecksRandom() {
    for (let i = 0; i < this.specks.length; i++) {
      this.specks[i].show();
    }
  }

  drawSpecksGrid(numHorizontal, numVertical) {
    for (let i = 1; i <= numHorizontal; i++) {
      const x = this.x + map(i, 0, numHorizontal + 1, 0, this.w);
      for (let j = 1; j <= numVertical; j++) {
        const y = this.y + map(j, 0, numVertical + 1, 0, this.h);
        circle(x, y, one);
      }
    }
  }

  drawGradient() {
    let gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.w,
      this.y + this.h
    );
    const c1 = this.color;
    const c2 = this.getStrokeColor();
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    ctx.fillStyle = gradient;
    rect(this.x, this.y, this.w, this.h);
  }

  getStrokeColor(isLight = false) {
    const palette = isLight
      ? fleets[this.fleetId].lightColorPalette
      : fleets[this.fleetId].colorPalette;
    const i = fleets[this.fleetId].colorPalette.indexOf(this.color);
    if (i === 0) {
      return palette[palette.length - 1];
    }
    return palette[i - 1];
  }
}

class Speck {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    circle(this.x, this.y, one / 2);
  }
}

function noiseToVal(x, y, low, high) {
  const tempX = map(x, 0, width, 0, 25);
  const tempY = map(y, 0, height, 0, 25);
  return map(noise(tempX, tempY), 0, 1, low, high);
}

function rnd(min = 0, max = 1) {
  seed ^= seed << 13;
  seed ^= seed >> 17;
  seed ^= seed << 5;
  return map(((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000, 0, 1, min, max);
}

function rndFromArray(arr) {
  return arr[floor(rnd(0, arr.length))];
}

function decPairToPercent(decPair) {
  return map(decPair, 0, 255, 0, 1);
}

class GlobalStyles {
  constructor() {
    this.colorPaletteName = rndFromArray(Object.keys(styles.colorPalette));
    this.colorPalette = styles.colorPalette[this.colorPaletteName];
    this.hasBackground = decPairToPercent(decPairs[0]) < 0.399;
    if (this.hasBackground) {
      this.backgroundColor = rndFromArray(this.colorPalette);
    } else {
      this.backgroundColor = 255;
    }
    let k = decPairToPercent(decPairs[2]); // RIP Color Shift :(
    if (k < 0.06) {
      this.colorCohesionName = "MONO";
      this.colorCohesion = styles.colorCohesion.MONO;
    } else if (k < 0.16) {
      this.colorCohesionName = "HIGH";
      this.colorCohesion = styles.colorCohesion.HIGH;
    } else if (k < 0.36) {
      this.colorCohesionName = "RANDOM";
      this.colorCohesion = styles.colorCohesion.RANDOM;
    } else {
      this.colorCohesionName = "NORMAL";
      this.colorCohesion = styles.colorCohesion.NORMAL;
    }
    k = decPairToPercent(decPairs[3]);
    if (k < 0.2) {
      this.partition = true;
      k = decPairToPercent(decPairs[6]);
      if (k < 0.5) {
        this.percentWidthChop = rnd(0.3, 0.4);
        this.percentHeightChop = rnd(0.3, 0.4);
        this.percentRepeatChop = rnd(0.1, 0.2);
      } else {
        this.percentWidthChop = rnd(0.3, 0.7);
        this.percentHeightChop = rnd(0.3, 0.7);
        this.percentRepeatChop = 0;
      }
      this.numCols = 0;
      this.numRows = 0;
    } else {
      this.partition = false;
      k = decPairToPercent(decPairs[4]);
      if (k < 0.73) {
        this.numCols = 1;
      } else if (k < 0.82) {
        this.numCols = 2;
      } else if (k < 0.91) {
        this.numCols = 3;
      } else {
        this.numCols = 4;
      }
      k = decPairToPercent(decPairs[5]);
      if (k < 0.73) {
        this.numRows = 1;
      } else if (k < 0.82) {
        this.numRows = 2;
      } else if (k < 0.91) {
        this.numRows = 3;
      } else {
        this.numRows = 4;
      }
    }

    if (this.numCols > 1) {
      if (this.numRows > 1) {
        this.fleetSplit = styles.split.GRID;
      } else {
        this.fleetSplit = styles.split.VERTICAL;
      }
    } else if (this.numRows > 1) {
      this.fleetSplit = styles.split.HORIZONTAL;
    } else if (this.partition) {
      this.fleetSplit = styles.split.PARTITION;
    } else {
      this.fleetSplit = styles.split.NONE;
    }
    this.fleetSplit = styles.split.NONE;
  }
}
class Styles {
  constructor() {
    this.colorPalette = {
      LAVENDER: [
        color("#a2b58b"),
        color("#a064fa"),
        color("#e3e2bc"),
        color("#c896c8"),
        color("#64f0fa"),
      ],
      BW: [color("#141414"), color("#f3f3f3")],
      REEF: [
        color("#0D3D63"),
        color("#1D9275"),
        color("#25B7C3"),
        color("#EFE5AD"),
        color("#E35123"),
      ],
      BRICK: [
        color("#563621"),
        color("#CF4B3B"),
        color("#ECC0AE"),
        color("#A5988F"),
        color("#D59273"),
      ],
      DOLPHIN: [
        color("#11304F"),
        color("#365558"),
        color("#6DBDD7"),
        color("#D8E2DE"),
        color("#FEFEFD"),
      ],
      OAXACA: [
        color("#E4572E"),
        color("#17BEBB"),
        color("#2E282A"),
        color("#fad350"),
        color("#76B041"),
      ],
      MERCIA: [
        color("#8a2f2f"),
        color("#d3ebd3"),
        color("#0a0a59"),
        color("#e0ca79"),
      ],
      WHO_ATE_THE_CRANS: [
        color("#FF9FB2"),
        color("#FBDCE2"),
        color("#0ACDFF"),
        color("#60AB9A"),
        color("#A17AB8"),
      ],
      MOSS_AGATE: [
        color("#F5FBEF"),
        color("#92AD94"),
        color("#748B75"),
        color("#C6EF80"),
        color("#503D42"),
      ],
      FIREWATER: [
        color("#F0A202"),
        color("#581F18"),
        color("#F18805"),
        color("#D95D39"),
        color("#202C59"),
      ],
      FAST_Ag: [
        color("#46E0E0"),
        color("#959ba1"),
        color("#758396"),
        color("#47C4AD"),
        color("#9DA3A1"),
      ],
    };
    this.rectangleDecoration = {
      NONE: "None",
      PERPENDICULAR_LINES: "Perpendicular Lines",
      PARALLEL_LINES: "Parallel Lines",
      MIXED_LINES_RANDOM: "Mixed Lines (Random)",
      MIXED_LINES_NOISE: "Mixed Lines (Noise)",
      CROSS_HATCH: "Cross Hatch",
      SPECKS_RANDOM: "Specks (Random)",
      SPECKS_GRID: "Specks (Grid)",
      RANDOM: "Random (Random)",
      NOISE: "Random (Noise)",
      GRADIENT: "Gradient",
    };

    this.colorCohesion = {
      MONO: 0,
      RANDOM: 1,
      HIGH: 0.1,
      NORMAL: 0.38,
    };
    // TODO should probably have a better way to maintain this
    this.rectangleDecorationsForRandomAndNoise = [
      this.rectangleDecoration.NONE,
      this.rectangleDecoration.PERPENDICULAR_LINES,
      this.rectangleDecoration.PARALLEL_LINES,
      this.rectangleDecoration.CROSS_HATCH,
      this.rectangleDecoration.SPECKS_RANDOM,
      this.rectangleDecoration.SPECKS_GRID,
    ];

    this.split = {
      NONE: "None",
      HORIZONTAL: "Horizontal",
      VERTICAL: "Vertical",
      GRID: "Grid",
      PARTITION: "Partition",
    };
  }
}
