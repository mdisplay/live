const rawEl = document.getElementById('prayer-data-raw-string');
const parsedEl = document.getElementById('prayer-data-parsed-string');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonth(month) {
  return months.filter(mon => mon.toUpperCase().indexOf(month.toUpperCase()) !== -1)[0];
}

function downloadFile(fileName, fileContent, doneCallback) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([fileContent], {
      type: 'text/plain',
    })
  );
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if(doneCallback) {
    setTimeout(function() {
      doneCallback();
    }, 1000);
  }
}

function convertTo12Hr(val) {
  let [hr, min] = val.split(':');
  hr = parseInt(hr);
  // min = parseInt(min);
  if(hr == 12) {
    val += ' PM';
  } else if(hr > 12) {
    hr -= 12;
    if(hr < 12) {
      hr = '0' + hr;
    }
    val = hr + ':' + min + ' PM';
    // val += ' PM';
  } else {
    val += ' AM';
  }
  return val;
}

function areEqualTimes(times1, times2) {
  let areEqual = true;
  for(let i = 0; i < times1.length; i++) {
    areEqual = areEqual && times1[i] === times2[i];
  }
  return areEqual && times1.length == times2.length;
}

function parseRawText() {
  const lines = rawEl.value.split(/\r?\n|\r|\n/g).map(line => line.trim());
  const times = {};
  let lastDate = '';
  const allData = {};
  for (let line of lines) {
    line = line.trim().toUpperCase();
    if (line === '') {
      continue;
    }
    if (line.indexOf(':') !== -1) {
      if (line.indexOf('PM') !== -1) {
        line = line.replace('PM', '').trim();
        let [hour, minutes] = line.split(':');
        hour = parseInt(hour);
        minutes = parseInt(minutes);
        if (hour != 12) {
          hour += 12;
        }
        line = hour + ':' + minutes;
      } else {
        line = line.replace('AM', '').trim();
      }
      times[lastDate].times.push(line);
    } else {
      lastDate = line.replace(/O/g, '0');
      let [month, day] = lastDate.split('-');
      month = getMonth(month);
      day = parseInt(day);
      times[lastDate] = {month, day, range: [day, day], times: []};
      if (!allData[month]) {
        allData[month] = {};
      }
      allData[month][day] = times[lastDate];
    }
  }

  const allDataProcessed = {};

  for (const month in allData) {
    const data = allData[month];
    allDataProcessed[month] = [];
    let lastRange = null;
    for(let i = 1; i <= 31; i++) {
      const areEqual = lastRange && areEqualTimes(lastRange.times, data[i].times);
      if (areEqual) {
        lastRange.range[1] = i;
      } else {
        lastRange = {range: data[i].range, times: data[i].times};
        allDataProcessed[month].push(lastRange);
      }
    }  
  }

  console.log(allData);
  console.log(allDataProcessed);
  let allParsedValue = '{\n';
  for(const month in allDataProcessed) {
    let parsedValue = `  ${month}: [\n`;
    for (let t of allDataProcessed[month]) {
      parsedValue += `    { range: [${t.range[0]}, ${t.range[1]}], times: ['${t.times.join("', '")}'] },\n`;
    }
    parsedValue += `  ],\n`;
    allParsedValue += parsedValue
  }
  allParsedValue += '}\n';
  // let parsedValue = JSON.stringify(allDataProcessed, null, 2);
  console.log(allParsedValue);
  parsedEl.value = allParsedValue;
}

const monthSelectEl = document.getElementById('download-month-select');
const dataSelectEl = document.getElementById('download-name-select');

monthSelectEl.innerHTML = months.map(mon => `<option value="${mon}">${mon}</option>`).join('');

let dataNames = '';
for (const name in window.PRAYER_DATA) {
  dataNames += `<option value="${name}">${name}</option>`;
}

dataSelectEl.innerHTML = dataNames;


function downloadSelected() {
  // alert(monthSelectEl.value);
  // alert(dataSelectEl.value);
  const dataName = dataSelectEl.value;
  const monthName = monthSelectEl.value;
  const selectedData = window.PRAYER_DATA[dataName][monthName];
  let output = 'Date, Subah, Sunrise, Luhar, Asr, Maghrib, Isha\n';
  if (document.getElementById('download-12hr-check').checked) {
    for(let row of selectedData) {
      for(i = 0; i < row.times.length; i++) {
        row.times[i] = convertTo12Hr(row.times[i]);
      }
      output += row.range[0] + (row.range[0] === row.range[1] ? '' : '-' + row.range[1]) + ', ';
      output += row.times.join(' , ') + '\n';
    }
  }
  for(const row of selectedData) {

  }
  console.log(selectedData);
  console.log(output);
  const fileName = 'Prayer-Data-' + dataName + '-' + monthName + '.csv';
  downloadFile(fileName, output);
}