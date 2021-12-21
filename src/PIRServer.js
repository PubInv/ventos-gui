import $ from 'jquery';
import {add_samples} from './PIRUtils';
import {plot} from './PlotlyPlotter';
import axios from "axios";
import qs from "qs";

var intervalId = 0
var DATA_RETRIEVAL_PERIOD = 500;
var MAX_SAMPLES_TO_STORE_S = 2000;
var settings = {}
var samples = []

// https://github.com/PubInv/PIRCS-pubinv-respiration-control-standard/blob/master/PIRCS.md
const name_to_PIRCS_map = {
  Mode: 'M',
  Pmax: 'P',
  Pi: 'P',
  PEEP: 'E',
  TV: 'V',
  Flow: 'F',
  RR: 'B',
  IE: 'I',
  FiO2: 'O',
}

const pircsValue = (par, value) => {
  if (par === 'I') { // I:E - handle a colon if we get one!
    const vs = value.split(":");
    if (vs.length === 1) {
      return 10 * parseInt(vs[0])
    } else if (vs.length === 2) {
      return 10 * parseInt(vs[1]) / parseInt(vs[0]);
    }
    else {
      alert("INTERNAL GUI ERROR: I:E value just have colon");
      throw new Error('Bad PIRCS IE')
    }
  } else if ('PBO'.includes(par)) { // pressure, RR, FiO2
    return 10 * parseInt(value)
  } else {
    return parseInt(value)
  }
}

// interpretations are: m: Minimum M: Maximum T: Target
const pircsInterpretations = (name) => {
  if (name === 'Pmax') {
    return 'M'
  }
  else {
    return 'T'
  }

}

const PIRCS = (name, value) => {

  const par = name_to_PIRCS_map[name]
  if (!par) {
    throw new Error('Bad PIRCS parameter name')
  }
  const val = pircsValue(par, value)
  const int = pircsInterpretations(name)
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
    alert('A communication error has occurred')
    console.log(response);
    console.log(newFormValues);
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
  // fixme change to axios
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
        alert('cannot get samples');
        halt();
    }
  })
}
