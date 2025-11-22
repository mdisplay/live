const fs = require('fs');
const pdf = require('pdf-parse');

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

// import fs from "fs";
// import PDFParser from "pdf2json"; 
// import pdf from 'pdf-parse';


// const pdfParser = new PDFParser();

// pdfParser.on("pdfParser_dataError", (errData) =>
//  console.error(errData.parserError)
// );

// pdfParser.on("pdfParser_dataReady", (pdfData) => {
//     const content = pdfParser.getRawTextContent();
//     console.log(content);
// });

// const fileName = '01-COLOMBO-DISTRICT-GAMPAHA-DISTRICT-KALUTARA-DISTRICT-1-Jan.pdf';
// const filePath = './prayer-times/' + fileName;
// // pdfParser.loadPDF(filePath);


// let dataBuffer = fs.readFileSync(filePath);



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

//   console.log(allData);
//   console.log(allDataProcessed);
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
//   console.log(allParsedValue);
  function wrapZone(zone, val) {
    val = '{\n' + val;
    val = 'window.PRAYER_DATA.' + zone.name + ' = ' + val;
      // val += '}\n';
    val += '}\n';
    return val;
  }
  // allParsedValue = wrapZone(zoneDetails, allParsedValue);
  return allParsedValue;
}

function parseRawTextPdf(value) {
  const lines = value.split(/\r?\n|\r|\n/g).map(line => line.trim());
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
      if (!date) {
        continue;
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
//   console.log('allData', allData);
  const finalData = applyAllData(allData);
//   console.log(finalData);
//   fs.writeFileSync('./output.txt', finalData);
  return finalData;
}


// default render callback
function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
	.then(function(textContent) {
		let lastY, text = '';
		for (let item of textContent.items) {
			if (lastY == item.transform[5] || !lastY){
				text += ' ' + item.str;
			}  
			else{
				text += '\n' + item.str;
			}    
			lastY = item.transform[5];
		}
		return text;
	});
}

let pdfOptions = {
    pagerender: render_page
}

function parsePdfFiles() {

  const directoryPath = './prayer-times'; // Replace with your directory path

  try {
    const files = fs.readdirSync(directoryPath);
  //   console.log('Files in directory:');
    files.forEach(fileName => {
      const filePath = directoryPath + '/' + fileName;
      let dataBuffer = fs.readFileSync(filePath);
      pdf(dataBuffer, pdfOptions).then(data => {
          const outputPath = './output/' + fileName + '.txt';
          const content = parseRawTextPdf(data.text);
          fs.writeFileSync(outputPath, content);
      });
    });
  } catch (err) {
    console.error('Error reading directory:', err);
  }

}

function processTextFiles() {
  const directoryPath = './output'; // Replace with your directory path

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  try {
    const files = fs.readdirSync(directoryPath);
  //   console.log('Files in directory:');
    let index = 1;
    const zoneData = {};
    let dataStr = 'if(!window.PRAYER_DATA) {\n  window.PRAYER_DATA = {};\n}\n\n';
    files.forEach(fileName => {
      const filePath = directoryPath + '/' + fileName;
      let dataBuffer = fs.readFileSync(filePath, 'utf8');
      // console.log(filePath);
      const match = fileName.match(/(\d+?)-(.+)-(\d+?)-(\w+)\.pdf\.txt/);
      const zoneNum = parseInt(match[1]);
      const zoneName = match[2].replace(/-/g, ' ');
      const month = match[4];
      // console.log(index, match[1], match[2], match[3], match[4]);
      // console.log(zoneNum, zoneName, month);
      if (!zoneData[zoneNum]) {
        zoneData[zoneNum] = {
          zoneNum,
          zoneName,
          rawData: {},
          data: [],
          // allMonths: [],
        };
      }
      zoneData[zoneNum].rawData[month] = dataBuffer;
      index++;
    });
    for (const zoneNum in zoneData) {
      dataStr += `// Zone ${zoneNum}: ${zoneData[zoneNum].zoneName}
window.PRAYER_DATA.ZONE${zoneNum} = {\n`;
      for(const month of months){
        zoneData[zoneNum].data.push(zoneData[zoneNum].rawData[month]);
        dataStr += zoneData[zoneNum].rawData[month];
        // zoneData[zoneNum].allMonths.push(month);
      }
      delete zoneData[zoneNum].rawData;
      dataStr += '};\n\n';
    }
    console.log(dataStr);
    // fs.writeFileSync('./output-all.json', JSON.stringify(zoneData));
    fs.writeFileSync('./output-prayernew-data.js', dataStr);
  } catch (err) {
    console.error('Error reading directory:', err);
  }

}

processTextFiles();
