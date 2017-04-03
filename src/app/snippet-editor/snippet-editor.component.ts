import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

const {ipcRenderer} = require('electron');

@Component({
  selector: 'snippet-editor',
  templateUrl: './snippet-editor.component.html',
})
export class SnippetEditor {
  fileList: Array<any>;
  @Input() src: String = `
window.chartColors = {
  red: 'rgba(240, 98, 146,1.0)',
  orange: 'rgba(244, 143, 177,1.0)',
  yellow: 'rgba(255,183,77 ,1)',
  green: 'rgba(102, 187, 106,1.0)',
  blue: 'rgba(77,208,225 ,1)',
  purple: 'rgba(236, 64, 122,1.0)',
  grey: 'rgba(161,136,127 ,1)'
};

const bornDate = moment({
  year: 2016,
  month: 10,
  day: 15
});

window.randomScalingFactor = function() {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}


function pickByKey(key, arr) {
  return arr.map((item, index) => item[key]);
}

var MONTHS = pickByKey('Month', boyZScores).map(month => moment(bornDate).add(month, 'month').toDate());
const SD3neg = pickByKey('SD3neg', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD2neg = pickByKey('SD2neg', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD1neg = pickByKey('SD1neg', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD0 = pickByKey('SD0', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD1 = pickByKey('SD1', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD2 = pickByKey('SD2', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const SD3 = pickByKey('SD3', boyZScores).map((item, index) => ({x:MONTHS[index], y: item}));
const baby = [
  {x: bornDate.toDate(), y: 2.95},
  {x: moment(bornDate).add(2, 'month').toDate(), y: 5.5},
  {x: moment({year: 2017, month: 1, day: 5}).toDate(), y: 5.8},
]

var config = {
  type: 'line',
  data: {
    labels: MONTHS,
    datasets: [{
        label: "Baby",
        borderColor: 'rgba(255, 255, 255,1.0)',
        fill: 0,
        data: baby,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(244, 67, 54,1.0)',
        showLine: true,
      },{
        label: "SD3neg",
        borderColor: 'rgba(158, 158, 158,1.0)',
        borderWidth:2,
        backgroundColor: 'rgba(240, 98, 146,1.0)',
        data: SD3neg,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD2neg",
        borderColor: 'rgba(236, 64, 122,1.0)',
        borderWidth:2,
        backgroundColor: 'rgba(244, 143, 177,1.0)',
        data: SD2neg,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD1neg",
        borderWidth:2,
        borderColor: 'rgba(129, 212, 250,1.0)',
        backgroundColor: 'rgba(129, 212, 250,1.0)',
        data: SD1neg,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD0",
        borderWidth:2,
        borderColor: 'rgba(76, 175, 80,1.0)',
        backgroundColor: 'rgba(129, 212, 250,1.0)',
        data: SD0,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD1",
        borderWidth:2,
        borderColor: 'rgba(129, 212, 250,1.0)',
        backgroundColor: 'rgba(129, 212, 250,1.0)',
        data: SD1,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD2",
        borderWidth:2,
        borderColor: 'rgba(236, 64, 122,1.0)',
        backgroundColor: 'rgba(129, 212, 250,1.0)',
        data: SD2,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      }, {
        label: "SD3",
        borderWidth:2,
        borderColor: 'rgba(158, 158, 158,1.0)',
        backgroundColor: 'rgba(255, 241, 118,1.0)',
        data: SD3,
        pointRadius: 0,
        pointHoverBorderColor: 'rgba(224,224,224 ,1)',
      },

    ]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Baby Growth - Weight"
    },
    tooltips: {
      mode: 'x',
      intersect: true,
    },
    hover: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        type: 'time',
        scaleLabel: {
          display: true,
          labelString: 'Month'
        },
        ticks: {
          autoSkip: true,
          autoSkipPadding: 30,
        },
        time: {
          min: bornDate.toDate(),
          displayFormats: {
            quarter: 'MMM.YY'
          }
        }

      }],
      yAxes: [{
        scaleLabel: {
          display: false,
          labelString: 'Value'
        },
      }]
    }
  }
};

window.onload = function() {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myLine = new Chart(ctx, config);
};
  `;

  constructor(){
    this.fileList = _.times(_.random(8, 20), (n:number) => ({name: `file ${n}`, active: n === 0}));
  }

  runSnippet(){
    ipcRenderer.send('snippet.run');
    ipcRenderer.on('snippet.run.ready', () => {
      console.log('snippet ready!!!');
      window.open('http://localhost:15106/test');
    })
    // poc of we can run the snippet with webpack on new window
  }
 }
