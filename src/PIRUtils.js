/**
 * Module to provide generic functions to support PIRCS and PIRDS data
 */
export function seconds(ms) {
  return Math.floor(ms / 1000)
}

export function slice(ms, milliseconds_per_step) {
  return Math.floor(ms % 1000 / milliseconds_per_step)
}

// WARNING: This is a hack...if the timestamp is negative,
// we treat it as a limited (beyond range of sensor) measurement.
// Our goal is to warn about this, but for now we will just
// ignore and correct.
function sanitize_samples(samples) {
  samples.forEach(s => {
    if (s.event === "M") {
      if ("string" === (typeof s.ms))
        s.ms = parseInt(s.ms);
      if ("string" === (typeof s.val))
        s.val = parseInt(s.val);
      if ("string" === (typeof s.num))
        s.num = parseInt(s.num);
      if (s.ms < 0) {
        s.ms = -s.ms; // fixme! what is going on here???
        console.error('negative timestamp!!')
      } else if (s.event === "E") {
        // fixme - is this needed??
      }
    }
  });
  return samples;
}

export function is_flow(PIRDS) {
  return PIRDS.event === 'M' && PIRDS.type === 'F'
}

export function is_pressure(PIRDS) {
  return PIRDS.event === 'M'
    && PIRDS.type === 'D'
    && (PIRDS.loc === 'A' || PIRDS.loc === 'I')
}

// check if two PIRDS items are duplicates
function PIRDSEquals(a, b) {
  return a.ms === b.ms
    && a.type === b.type
    && a.loc === b.loc
    && a.num === b.num
    && a.event === b.event
    && a.val === b.val
}

// mutate the series to add in new data and trim old data
// uses series as an object indexed by second
// each second stores the an array [min, max] for each slice
function concat_series(series, new_samples, type, settings) {
  var newest_second = 0
  // chose the appropriate filter function
  const filter = {flow: is_flow, pressure: is_pressure}[type]
  new_samples.filter(filter).forEach(PIRD => {
    const second = seconds(PIRD.ms)
    const s = slice(PIRD.ms, settings.milliseconds_per_step)
    const val = PIRD.val
    if (!series[second]) { // first data for this second
      series[second] = []
      if (newest_second < second) {
        newest_second = second
      }
    }
    if (!series[second][s]) { // first data for this slice
      series[second][s] = [val, val] // save value as min & max
    } else if (series[second][s][0] > val) { //new min value
      series[second][s][0] = val
    } else if (series[second][s][1] < val) { // new max value
      series[second][s][1] = val
    }
  })
  // remove old data from series
  Object.keys(series).forEach(second => {
    console.log('xx second, settings.seconds_to_keep, newest_second',
        second, settings.seconds_to_keep,  newest_second)
    if (parseInt(second) + settings.seconds_to_keep < newest_second) {
      delete series[second]
    }
  })
}

export function mergeNewData(data, new_data, settings) {
  ['pressure', 'flow'].forEach(type =>
    concat_series(data[type], new_data, type, settings))
}


// note: not guaranteeed to get samples in order
// This function mutates the series object
export function concatSamples(series, new_samples, MAX_SAMPLES_TO_STORE_S) {
  var samples = series.samples.concat(sanitize_samples(new_samples));
  samples.sort((a,b) => a.ms < b.ms);
  // de-dupe sorted list:
  samples = samples.filter((item, index, list) => !index || !PIRDSEquals(item, list[index-1]))
  const discard = Math.max(0, samples.length - MAX_SAMPLES_TO_STORE_S);
  series.samples = samples.slice(discard);
}

// https://github.com/PubInv/PIRCS-pubinv-respiration-control-standard/blob/master/PIRCS.md
export function pircsParameter(name) {
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
  const par =  name_to_PIRCS_map[name]
  if (!par) {
    throw new Error('Bad PIRCS parameter name')
  }
  return par
}

export function pircsValue(par, value) {
  if (par === 'I') { // I:E - handle a colon if we get one!
    const vs = value.split(":");
    if (vs.length === 1) {
      return 10 * parseInt(vs[0])
    } else if (vs.length === 2) {
      return 10 * parseInt(vs[1]) / parseInt(vs[0]);
    }
    else {
      throw new Error('Bad PIRCS IE')
    }
  } else if ('PBO'.includes(par)) { // pressure, RR, FiO2
    return 10 * parseInt(value)
  } else {
    return parseInt(value)
  }
}

// interpretations are: m: Minimum M: Maximum T: Target
export function pircsInterpretation(name) {
  if (name === 'Pmax') {
    return 'M'
  }
  else {
    return 'T'
  }
}

