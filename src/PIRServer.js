/* Module to provide HTTP/AJAX comms with a VentOS server */
import $ from 'jquery';
import {concatSamples, pircsParameter, pircsValue, pircsInterpretation,
  seconds, concat_series,
} from './PIRUtils';
import {plot} from './PlotlyPlotter';
import axios from "axios";
import qs from "qs";

var intervalId = 0
const DATA_RETRIEVAL_PERIOD = 5000;
const MAX_SAMPLES_TO_STORE_S = 2000;
const settings = { }

const data = {
  // second indexed arrays, with each array element being span of data:
  pressure: {},
  flow: {},
  // list of PIRDS sorted by time stamp:
  samples: [],
}

const sendPIRCS = (name, value) => {
  // translate name and value setting to PIRCs equivalant
  const par = pircsParameter(name)
  const val = pircsValue(par, value)
  const int = pircsInterpretation(name)
  const DSERVER_URL = settings.dserverurl; //"https://ventos.dev/ventos";
  var url = DSERVER_URL + "/control/";
  var PIRCS = {com: "C", par, int, mod: 0, val};
  const options = {
    url: url,
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify(PIRCS),
  };
  // fixme needs an error handler
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
    time_zero: seconds(Date.now()) - 10,
    milliseconds_per_step: 50,
    dserverurl: 'https://ventos.dev/ventos',
    seconds_to_store: 60,
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
    console.log('xxx settings', settings)
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
      if (new_samples) {
        data.settings = settings
        concatSamples(data, new_samples, MAX_SAMPLES_TO_STORE_S);
        ['pressure', 'flow'].forEach(
          type => concat_series(data[type], new_samples,
            type, settings.milliseconds_per_step))
        console.log('got data', data)
        settings.callback(data)
        plot(data.samples);
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
