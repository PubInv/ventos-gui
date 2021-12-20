import $ from 'jquery';
import {add_samples} from './PIRUtils';
import {plot} from './PlotlyPlotter';

var intervalId = 0
var DATA_RETRIEVAL_PERIOD = 500;
var MAX_SAMPLES_TO_STORE_S = 2000;
var settings = {}
var samples = []

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
      function() {getPIRDSData()},
      DATA_RETRIEVAL_PERIOD);
    console.log('starting server', intervalId)
    settings.live = true;
  },
  isLive: () => settings.live,
  settings: () => settings,
}

function getPIRDSData() {
  const DSERVER_URL = settings.dserverurl; //"https://ventos.dev/ventos";
  const url = DSERVER_URL + "/"+ MAX_SAMPLES_TO_STORE_S;
  $.ajax({
    url: url,
    success: function(new_samples){
      if (new_samples) {
        samples = add_samples(samples, new_samples, MAX_SAMPLES_TO_STORE_S);
        plot(samples);
      } else {
        alert('no samples');
        console.error('no samples');
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log("Error!" + xhr.status);
      console.log(thrownError);
            halt();
            $("#livetoggle").prop("checked",false);
    }
  });
}
