const lastEventId = sessionStorage.getItem('lastEventId')
  ? sessionStorage.getItem('lastEventId')
  : '';

const sse = new EventSource(`http://localhost:9090/stream?lastEventId=${lastEventId}`);

sse.onmessage = function (ev) {
  if (ev.lastEventId) {
    const lastEventId = ev.lastEventId;
    sessionStorage.setItem('lastEventId', lastEventId);
    const data = JSON.parse(ev.data);
    saveEvent(data, lastEventId);
    renderEvents();
  } else {
    console.info(ev.data);
  }
};

function saveEvent(data, id) {
  sessionStorage.setItem(`events__${id}`, JSON.stringify(data));
}

function loadEvents() {
  const events = [];
  try {
    const keys = Object.keys(sessionStorage).filter((key) => key.startsWith('events__'));
    keys.sort();
    keys.forEach((key) => {
      events.push(JSON.parse(sessionStorage.getItem(key)));
    });
  } catch (error) {}
  return events;
}

function renderEvents() {
  const events = loadEvents();
  let htmlStr = ``;
  events.forEach((i) => {
    htmlStr += `
        <div class="list-item">
            <p><strong>Score: </strong>${i.score}</p>
            <p><strong>Time: </strong>${new Date(i.time).toLocaleString()}</p>
        </div>
    `;
  });
  document.getElementById('events').innerHTML = htmlStr;
}

renderEvents();
