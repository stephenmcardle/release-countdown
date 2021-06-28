function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function update() {
  const elem = document.getElementById("countdown");
  const release = moment("2021-07-05T12:00:00-04:00");
  const diff = release - moment.now();
  elem.innerHTML = msToTime(diff);
  await sleep(1000);
  update();
}

const d = 1000 * 60 * 60 * 24;
const h = 1000 * 60 * 60;
const m = 1000 * 60;
const s = 1000;

function msToTime(ms) {
  const days = Math.floor(ms / d);
  ms -= days * d;
  const hours = Math.floor(ms / h);
  ms -= hours * h;
  const minutes = Math.floor(ms / m);
  ms -= minutes * m;
  const seconds = Math.floor(ms / s);
  return `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
}

update();
