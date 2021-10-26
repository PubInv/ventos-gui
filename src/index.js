import React from 'react';
import Plot from "react-plotly.js";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';
import Plotly from 'plotly.js-dist';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

var DATA_RETRIEVAL_PERIOD = 500;
var intervalID = null;

var MAX_SAMPLES_TO_STORE_S = 2000;
var MAX_REFRESH = false;
var samples = [];
var INITS_ONLY = true;

const SMALL_HEIGHT = 500;
const LARGE_HEIGHT = 800;

const CONVERT_PIRDS_TO_SLM = 1/1000;

const SEVENINCHEL14TS = false;

  // Experimental timing against the data server

function stop_interval_timer() {
  clearInterval(intervalID);
  intervalID = null;
  $("#livetoggle").prop("checked",false);
}
function start_interval_timer() {
  if (intervalID) {
    stop_interval_timer();
  }
  intervalID = setInterval(
    function() {
      getPIRDSData();
    },
    DATA_RETRIEVAL_PERIOD);
  $("#livetoggle").prop("checked",true);
}
function toggle_interval_timer() {
  if (intervalID) {
    stop_interval_timer();
  } else {
    start_interval_timer();
  }
}

function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}

// we have now changed this, there will be flow and
// pressure in the same samples, and we should filter.
// TODO: I need to add maximal start and end
// samples to equalize all the plots.
function samplesToLine(samples) {
    var flows = samples.filter(s => s.event == 'M' && s.type == 'F');

    // These are slm/1000, or ml/minute...
    // so we multiply by 1000 to get liters per minute
    var flow_values = unpack(flows,"val").map(v => v * CONVERT_PIRDS_TO_SLM);
    var fmillis = unpack(flows, 'ms');
    // Convert to seconds...
    var fmin = Math.min(...fmillis);
    var fzeroed = fmillis.map(m =>(m-fmin)/1000.0);

  var pressures = samples.filter(s => s.event == 'M' && s.type == 'D' && (s.loc == 'A' || s.loc == 'I'));

    var pmillis = unpack(pressures, 'ms');
    var pmin = Math.min(...pmillis);
    var pzeroed = pmillis.map(m =>(m-pmin)/1000.0);
    // the PIRDS standard is integral mm H2O, so we divide by 10
    var delta_p = unpack(pressures, 'val').map(p => p / 10);
    var diff_p = {type: "scatter", mode: "lines",
		  name: "pressure",
		  x: pzeroed,
		  y: delta_p,
		  line: {color: "#00FF00"}
		 };

  var flow = {type: "scatter", mode: "lines",
		name: "flow",
		x: fzeroed,
	      y: flow_values,
              xaxis: 'x2',
              yaxis: 'y2',
              fill: 'tozeroy',
		line: {color: '#FFFF00'}
             };

  var max_flow = flow_values.reduce(
    function(a, b) {
      return Math.max(Math.abs(a), Math.abs(b));
    }
    ,0);
  var scaled_flow = flow_values.map(f => 100.0 * (f / max_flow));
  var flow_hollow = {type: "scatter", mode: "lines",
		name: "flow ghost",
		     x: fzeroed,
                     // Convert to a percentage
	             y: scaled_flow,
                     xaxis: 'x3',
                     yaxis: 'y3',
		line: {color: '#8888FF'}
               };
  return [diff_p,flow,flow_hollow];
}


function processNewSamples(samples) {
    var new_data = samplesToLine(samples);
  var millis = unpack(samples, 'ms');
  var min = Math.min(...millis);
  var zeroed = millis.map(m =>(m-min)/1000.0);
  var max = Math.max(...millis);
  var total_seconds = (max-min)/1000.0;
  var double_plot = [new_data[0],new_data[1]];

   var maxseconds = Math.ceil(total_seconds);
    var layout = {
//      title: SEVENINCHEL14TS ? '' : 'VentMon Breath Analysis',
      height: SEVENINCHEL14TS ? SMALL_HEIGHT : LARGE_HEIGHT,
      // Here I attempt to match Paulino's style
      plot_bgcolor: "#000",
      paper_bgcolor : "#000",
      showlegend: false,

      xaxis: {domain: [0.0,1.0],
              range : [0,maxseconds],
              tickfont: {color: 'green'}},
      yaxis: {
        title: 'P(cm H2O)',
        titlefont: {color: 'green'},
        tickfont: {color: 'green'},
      },
      xaxis2: {domain: [0.0,1.0],
               range : [0,maxseconds],
               tickfont: {color: 'yellow'}},
      yaxis2: {
        title: 'l/min',
        titlefont: {color: 'yellow'},
        tickfont: {color: 'yellow'}
      },
      grid: {
        rows: 2,
        columns: 1,
        pattern: 'independent',
        roworder: 'top to bottom'}
    }
  Plotly.newPlot('PFGraph',
                 double_plot,
                 layout,
                 {displayModeBar: false,
                  displaylogo: false,
                  responsive: true});

}

// WARNING: This is a hack...if the timestamp is negative,
// we treat it as a limited (beyond range of sensor) measurement.
// Our goal is to warn about this, but for now we will just
// ignore and correct.
function sanitize_samples(samples) {
  samples.forEach(s =>
                  {
                    if (s.event == "M") {
                      if ("string" == (typeof s.ms))
                        s.ms = parseInt(s.ms);
                      if ("string" == (typeof s.val))
                        s.val = parseInt(s.val);
                      if ("string" == (typeof s.num))
                        s.num = parseInt(s.num);
                      if (s.ms < 0) {
                        s.ms = -s.ms;
                      } else if (s.event == "E") {
                      }
                    }

                  });
  return samples;
}

function add_samples(cur_sam) {
  cur_sam = sanitize_samples(cur_sam);
  var discard = Math.max(0,
                         samples.length + cur_sam.length - MAX_SAMPLES_TO_STORE_S);
  samples = samples.slice(discard);
  samples = samples.concat(cur_sam);
  samples.sort((a,b) => a.ms < b.ms);
  // We are not guaranteeed to get samples in order
  // we sort them....
  // We also need to de-dup them.
  // This would be more efficient if done after sorting..
  var n = samples.length;

  // I think this is de-dupeing code...
  samples = samples.filter((s, index, self) =>
    self.findIndex(t => t.ms === s.ms
                   && t.type === s.type
                   && t.loc === s.loc
                   && t.num === s.num
                   && t.event === s.event
                   && t.val === s.val) === index);
}

function getPIRDSData() {
  const DSERVER_URL = "https://ventos.dev/ventos";
//  const DSERVER_URL = "http://127.0.0.1:8000";
  const url = DSERVER_URL + "/"+ MAX_SAMPLES_TO_STORE_S;
  $.ajax({url: url,
          success: function(cur_sam){
            add_samples(cur_sam);
            processNewSamples(samples);
          },
          error: function(xhr, ajaxOptions, thrownError) {
	    console.log("Error!" + xhr.status);
	    console.log(thrownError);
            stop_interval_timer();
            $("#livetoggle").prop("checked",false);
          }
         });
}

$("#livetoggle").change(toggle_interval_timer);

$( document ).ready(function() {
  start_interval_timer();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
