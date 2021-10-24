import React from "react";
import Plot from "react-plotly.js";
import $ from 'jquery';

const ran = () => {
  return Math.random();
};


var DATA_RETRIEVAL_PERIOD = 500;
var intervalID = null;

var MAX_SAMPLES_TO_STORE_S = 2000;
var MAX_REFRESH = false;
var samples = [];
var INITS_ONLY = true;

function PressureGraph() {
  return (
    <div>
      <Plot
        className="flex"
        data={[
          {
            x: [1, 2, 3, 4, 5, 6],

            y: [5, 20, 30, 39, 12, 16],

            type: "line",

            mode: "lines+markers",

            marker: { color: "green" },

            setInterval: 200,
          },
        ]}
        layout={{
          autosize: false,
          width: 320,
          height: 320,
          title: "Pressure",
          plot_bgcolor: "transparent",
          paper_bgcolor: "transparent",
          margin: {
            l: 25,

            r: 0,

            b: 25,

            t: 40,

            pad: 4,
          },
          xaxis: {
            showgrid: false,
            color: "#00FF00",
          },
          yaxis: {
            showgrid: false,
            showline: true,
            color: "#00FF00",
          },
        }}
        revision={(ran(), 200)}
      />
    </div>
  );
}

function processNewSamples(samples) {
}

function getPIRDSData() {
  const DSERVER_URL = "https://ventos.dev/ventos";
  const url = "/"+ MAX_SAMPLES_TO_STORE_S;
  $.ajax({url: url,
          success: function(cur_sam){
            console.log("cur_sam",cur_sam);
            processNewSamples(cur_sam);
          },
          error: function(xhr, ajaxOptions, thrownError) {
	    console.log("Error!" + xhr.status);
	    console.log(thrownError);
            stop_interval_timer();
            $("#livetoggle").prop("checked",false);
          }
         });
}

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


export default PressureGraph;
