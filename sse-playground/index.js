const express = require('express');
const app = express();

const events = [];
let connections = [];

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('connection', 'keep-alive');

  res.write('data: ' + 'Connection Established\n\n');
  connections.push(res);
  sendEventsToClient(req, res);

  res.on('close', () => {
    connections = connections.filter((conn) => conn !== res);
  });
});

app.post('/score', (req, res) => {
  const eventId = new Date().getTime();
  const event = {
    id: eventId,
    data: {
      score: req.body.score,
      time: req.body.time,
    },
  };
  events.push(event);
  sendEventToClients(event);
  res.status(200).send('score updated');
});

app.listen(9090, () => {
  console.log('listening on 9090');
});

function sendEventToClients(event) {
  connections.forEach(function (conn) {
    if (conn.closed) {
      console.warn('connection closed');
      return;
    }
    conn.write('id: ' + event.id + '\n' + 'data: ' + JSON.stringify(event.data) + '\n\n');
  });
}

function sendEventsToClient(request, response) {
  if (response.closed) {
    console.warn('connection closed');
    return;
  }
  let lastEventId = request.query.lastEventId;
  if (!lastEventId) {
    console.warn('last event id not supplied default to zero');
    lastEventId = 0;
  }
  const remEvents = events.filter((ev) => ev.id > lastEventId);
  remEvents.forEach((ev) => {
    response.write('id: ' + ev.id + '\n' + 'data: ' + JSON.stringify(ev.data) + '\n\n');
  });
}
