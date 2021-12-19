import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import $ from 'jquery';
import {add_samples} from './PIRUtils';
import {plot} from './PlotlyPlotter';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

var DATA_RETRIEVAL_PERIOD = 500;
var intervalID = null;

var MAX_SAMPLES_TO_STORE_S = 2000;
var samples = [];


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

function getPIRDSData() {
  const DSERVER_URL = "https://ventos.dev/ventos";
//  const DSERVER_URL = "http://127.0.0.1:8000";
  const url = DSERVER_URL + "/"+ MAX_SAMPLES_TO_STORE_S;
  $.ajax({url: url,
          success: function(cur_sam){
            samples = add_samples(samples, cur_sam, MAX_SAMPLES_TO_STORE_S);
            plot(samples);
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

$(document ).ready(function() {
  start_interval_timer();
});
