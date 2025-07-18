const rawEl = document.getElementById('prayer-data-raw-string');
const parsedEl = document.getElementById('prayer-data-parsed-string');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getMonth(month) {
  return months.filter(mon => mon.toUpperCase().indexOf(month.toUpperCase()) !== -1)[0];
}

var padZero = function padZero(number) {
  number = parseInt(number);
  if (number < 10) {
    return '0' + number;
  }
  return '' + number;
};

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

function to24Raw(txt) {
  if (txt.indexOf('PM') !== -1) {
    txt = txt.toUpperCase().replace('O', '0');
    txt = txt.replace('PM', '').trim();
    let [hour, minutes] = txt.split(':');
    hour = parseInt(hour);
    minutes = parseInt(minutes);
    if (hour != 12) {
      hour += 12;
    }
    txt = padZero(hour) + ':' + padZero(minutes);
  } else if(txt.indexOf('AM') !== -1) {
    txt = txt.toUpperCase().replace('O', '0');
    txt = txt.replace('AM', '').trim();
    let [hour, minutes] = txt.split(':');
    txt = padZero(hour) + ':' + padZero(minutes);
  } else {
    return false;
  }
  return txt;
}

function applyAllData(allData) {
  const allDataProcessed = {};

  for (const month in allData) {
    const data = allData[month];
    allDataProcessed[month] = [];
    let lastRange = null;
    const totalDays = monthDays[months.indexOf(month)];
    for(let i = 1; i <= totalDays; i++) {
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
  allParsedValue = '';
  for(const month in allDataProcessed) {
    let parsedValue = `  ${month}: [\n`;
    for (let t of allDataProcessed[month]) {
      parsedValue += `    { range: [${t.range[0]}, ${t.range[1]}], times: ['${t.times.join("', '")}'] },\n`;
    }
    parsedValue += `  ],\n`;
    allParsedValue += parsedValue
  }
  // let parsedValue = JSON.stringify(allDataProcessed, null, 2);
  console.log(allParsedValue);
  function wrapZone(zone, val) {
    val = '{\n' + val;
    val = 'window.PRAYER_DATA.' + zone.name + ' = ' + val;
      // val += '}\n';
    val += '}\n';
    return val;
  }
  // allParsedValue = wrapZone(zoneDetails, allParsedValue);
  parsedEl.value = allParsedValue;
}

function parseRawText() {
  const lines = rawEl.value.split(/\r?\n|\r|\n/g).map(line => line.trim());
  const times = {};
  let lastDate = '';
  const allData = {};
  const zoneDetails = {};
  for (let line of lines) {
    line = line.trim().toUpperCase();
    if (line === '') {
      continue;
    }
    line = line.replace('•', ':');
    if(line.toUpperCase().indexOf('ZONE') !== -1) {
        let [zoneName, zoneDescription] = line.split(':');
        zoneName = zoneName.replace('0', '').replace(' ', '');
        zoneDetails.name = zoneName.toUpperCase();
        zoneDetails.description = zoneDescription.trim().replace('(', '').replace(')', '');
    } else if (line.indexOf(':') !== -1) {
      const converted = to24Raw(line);
      if(!converted) {
        continue;
      }
      times[lastDate].times.push(converted);
    } else {
      line = line.replace(/O/g, '0');
      let [month, day] = line.split('-');
      month = getMonth(month);
      if (!month) {
        continue;
      }
      day = parseInt(day);
      lastDate = line;
      times[lastDate] = {month, day, range: [day, day], times: []};
      if (!allData[month]) {
        allData[month] = {};
      }
      allData[month][day] = times[lastDate];
    }
  }

  applyAllData(allData);
}

function parseRawTextPdf() {
  const lines = rawEl.value.split(/\r?\n|\r|\n/g).map(line => line.trim());
  const times = {};
  let lastDate = '';
  const allData = {};
  const zoneDetails = {};
  for (let line of lines) {
    line = line.trim().toUpperCase();
    if (line === '') {
      continue;
    }
    line = line.replace('•', ':');
    if(line.toUpperCase().indexOf('ZONE') !== -1) {
        let [zoneName, zoneDescription] = line.split(':');
        zoneName = zoneName.replace('0', '').replace(' ', '');
        zoneDetails.name = zoneName.toUpperCase();
        zoneDetails.description = zoneDescription.trim().replace('(', '').replace(')', '');
    } else if (line.indexOf(':') !== -1) {
      let date = line.match(/(\w+?)-(\d+)/);
      let monthIndex = 1;
      let dayIndex = 2;
      if (!date) {
        date = line.match(/(\d+?)-(\w+)/);
        monthIndex = 2;
        dayIndex = 1;
      }
      const month =  getMonth(date[monthIndex]);;
      const day = parseInt(date[dayIndex]);
      const timesNow = {month, day, range: [day, day], times: []};
      if (!allData[month]) {
        allData[month] = {};
      }
      // line.match(/(\d\d):(\d\d).+?([A|P]M)/g);
      line.matchAll(/(\d+?):(\d+?)\s+?([A|P]M)/g).forEach((match => {
        const converted = to24Raw(match[0]);
        if(converted) {
          timesNow.times.push(converted);
        }
      }));
      allData[month][day] = timesNow;
      // console.log(date[1], date[2], timesRaw);
    } else {
    }
  }
  console.log('allData', allData);
  applyAllData(allData);
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