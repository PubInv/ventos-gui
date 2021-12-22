/* Module to provide HTTP/AJAX comms with a VentOS server */
import $ from 'jquery';
import {concatSamples, pircsParameter, pircsValue, pircsInterpretation} from './PIRUtils';
import {plot} from './PlotlyPlotter';
import axios from "axios";
import qs from "qs";

var intervalId = 0
var DATA_RETRIEVAL_PERIOD = 500;
var MAX_SAMPLES_TO_STORE_S = 2000;
var settings = {}
var samples = []

const sendPIRCS = (name, value) => {
  const par = pircsParameter(name)
  const val = pircsValue(par, value)
  const int = pircsInterpretation(name)
  var url = process.env.REACT_APP_DSERVER_URL + "/control/";

  // name = TV
  var data = {com: "C", par, int, mod: 0, val};
  const options = {
    url: url,
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify(data),
  };
  axios(options).then(function (response) {
    console.log(response);
  });
};

const halt = () => {
  clearInterval(intervalId);
  intervalId = 0;
  console.log('stopped server')
}

export const server = {
  default_ventilator_session: {
        dserverurl: 'https://ventos.dev/ventos',
        traceid: '102',
        samples_to_plot: '1000',
        live: false,
  },
  halt,
  start: (session_settings) => {
    if (intervalId) {
      halt();
      settings.live = false;
    }
    settings = session_settings || settings
    intervalId = setInterval(
      function() {getPIRDS()},
      DATA_RETRIEVAL_PERIOD);
    console.log('starting server', intervalId)
    settings.live = true;
  },
  isLive: () => settings.live,
  settings: () => settings,
  sendPIRCS,
}

function getPIRDS() {
  const DSERVER_URL = settings.dserverurl; //"https://ventos.dev/ventos";
  const url = DSERVER_URL + "/"+ MAX_SAMPLES_TO_STORE_S;
  // fixme change to axios
  $.ajax({
    url: url,
    success: function(new_samples){
//      console.log(
//        `adding ${new_samples.length} to existing ${samples.length} samples`)
      if (new_samples) {
        samples = concatSamples(samples, new_samples, MAX_SAMPLES_TO_STORE_S);
        plot(samples);
      } else {
        alert('no samples');
        console.error('no samples');
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log("Error!" + xhr.status);
      console.log(thrownError);
        alert('cannot get samples');
        halt();
    }
  })
}
