function updatePolandTime() {
  const now = new Date();

  const time = now.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Warsaw',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    timeZoneName: 'shortOffset',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const tzPart = parts.find(function (part) {
    return part.type === 'timeZoneName';
  });

  const gmt = tzPart ? tzPart.value.replace('UTC', 'GMT') : 'GMT+1';
  const content = 'local time<br>' + time + ' (' + gmt + ')';

  const el1 = document.getElementById('local-time');
  const el2 = document.getElementById('timezone');
  const el3 = document.getElementById('nav_time');

  if (el1) el1.innerHTML = content;
  if (el2) el2.innerHTML = content;
  if (el3) el3.innerHTML = content;
}

updatePolandTime();
setInterval(updatePolandTime, 1000);
