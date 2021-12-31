/**
 * Module to provide generic functions to support PIRCS and PIRDS data
 */
export function blankData() {
  return {
    // second indexed arrays, with each array element being span of data:
    pressure: {},
    flow: {},
    // latest breaths:
    breaths: [], // start, end, VTe, VTi, Ppeak, PEEP
    // list of PIRDS sorted by time stamp:
    samples: [], // deprecated (for removal??)
  }
}

const DATA_MIN = 0
const DATA_MAX = 1
const CURSOR_SECONDS = 0
const CURSOR_SLICE = 1
const CURSOR_STEPS = 2


// use the average flow (crude but will work for now)
function is_inspiring(data, cursor) {
  if (cursor) {
    const f = data.flow[cursor[CURSOR_SECONDS]][cursor[CURSOR_SLICE]]
    return f && f[DATA_MIN]+f[DATA_MAX] > 0
  }
}

// use the average flow (crude but will work for now)
function is_expiring(data, cursor) {
  if (cursor) {
    const f = data.flow[cursor[CURSOR_SECONDS]][cursor[CURSOR_SLICE]]
    return f && f[DATA_MIN]+f[DATA_MAX] < 0
  }
}

// return the cursor pointing to the next item where test is true
// returns false if none found
function next(data, cursor_in, last_second, test=false, steps=1) {
  //  console.log('data', data)
  //  console.log('cursor_in', cursor_in)
  //  console.log('last_second', last_second)
  var second = cursor_in[CURSOR_SECONDS]
  var slice = cursor_in[CURSOR_SLICE] + 1
  if (slice >= data.settings.slice_per_second) {
    slice = 0
    second +=1
  }
  if (second === last_second && slice >= data.flow[second].length) {
    return false // we're done
  } else if (second > last_second) { // not sure this test is needed
    return false // we're done
  }
  if (steps > 100) {
    alert('this is not ok')
    console.error('this is not ok')
  }
  const cursor = [second, slice, steps]
  return (!test || test(data, cursor))
    ? cursor
    : next(data, cursor, last_second, test, steps+1)
}

function seconds_between(cursor_1, cursor_2, settings) {
  const sps = settings.slice_per_second
  return (cursor_2[CURSOR_SECONDS] + cursor_2[CURSOR_SLICE] / sps) -
  (cursor_1[CURSOR_SECONDS] + cursor_1[CURSOR_SLICE] / sps)
}

// simple arithmetic mean
function mean(arr, field) {
  console.log('xxx getting mean ', field)
  if (arr.length) {
    const mean = arr.reduce((acc, obj) => acc + obj[field], 0) / arr.length
    if (!mean) {
      console.log('arr', arr)
      alert(`no mean ${field}`)
      // throw new Error(`no mean ${field}`)
    }
    return mean
  }
}

// last element in array
function last(arr) {
  return arr[arr.length-1]
}

// crude but adequate for now
export function summariseBreaths(data) {
  const breaths = data.breaths
  const start = breaths[0].start
  const end = last(breaths).end
  const epoch_length = seconds_between(start, end, data.settings)
  console.log('xxx breaths', breaths)
  const RR = breaths.length * (60 / epoch_length)
  const VTi = mean(breaths, 'VTi')
  const VTe = mean(breaths, 'VTe')
  const summary = {
    start, end,
    RR, VTi, VTe,
    Ppeak: mean(breaths, 'Ppeak'),
    PEEP: mean(breaths, 'PEEP'),
    MVi: VTi * RR, MVe: VTe * RR,
    epoch_length, n_breaths: breaths.length, // for debugging only
  }
  console.log('xxx summary', summary)
  return summary
}

// takes a datastream
// returns collection of breaths
export function breathScan(data) {
  function mean(data, cursor, series) {
    const d = data[series][cursor[CURSOR_SECONDS]][cursor[CURSOR_SLICE]]
    return d ? (d[DATA_MIN]+d[DATA_MAX])/2 : NaN
  }
  const breaths = data.breaths

  var cursor // array: [second, slice]
  const sps = data.settings.slice_per_second
  const epoch_s = 1 / sps
  // list of seconds in order
  const seconds = Object.keys(data.flow).map(x => parseInt(x)).sort()
  const last_second = last(seconds)
  if (!seconds.length) return // we have no data
  if (breaths.length === 0) { // find start of first breath
    const first_second = seconds[0]
    // find first not empty slice in first second
    cursor = [first_second, 0]
    // scan series for some expiration
    cursor = next(data, cursor, last_second, is_expiring)
    if (!cursor) return
    // find begining of inspiration:
    cursor = next(data, cursor, last_second, is_inspiring)
    if (!cursor) return // no inspirations!
  } else { // get end of last breath
    cursor = last(breaths).end
  }
  do {
    console.log('qqq breaths.length', breaths.length)
    console.log('qqq cursor', cursor)
    // scan inspiration (using flow)
    const breath = {
      start: cursor, Ppeak: 0, PEEP: 100, VTe: 0, VTi: 0}
    do {
      const flow = mean(data, cursor, 'flow')
      const pressure = mean(data, cursor, 'pressure')
      breath.VTi += flow * epoch_s * cursor[CURSOR_STEPS]
      console.log('qq-flow *', flow)
      console.log('qq-epoch_s', epoch_s)
      console.log('qq-cursor[CURSOR_STEPS]', cursor[CURSOR_STEPS])
      console.log('qq-breath.VTi', breath.VTi)
      if (breath.Ppeak < pressure) {
        breath.Ppeak = pressure
      }
      cursor = next(data, cursor, last_second)
    } while (is_inspiring(data, cursor))
    // scan expiration
    if (cursor) { // skip expiration because we didn't find the end of inspiration
      do {
        const flow = mean(data, cursor, 'flow')
        const pressure = mean(data, cursor, 'pressure')
        breath.VTe += flow * epoch_s * cursor[CURSOR_STEPS]
        if (breath.PEEP > pressure) {
          breath.PEEP = pressure
        }
        cursor = next(data, cursor, last_second)
      } while (is_expiring(data, cursor))
    }
    if (cursor) { // add new breath if it is complete
      breath.end = cursor
      breaths.push(breath)
    }
  } while (cursor)
  return breaths
}


export function seconds(ms) {
  return Math.floor(ms / 1000)
}
export function slice(ms, milliseconds_per_step) {
  return Math.floor(ms % 1000 / milliseconds_per_step)
}

// fixme: This is a hack...if the timestamp is negative,
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
  const scale = {flow: 1, pressure: 0.1}[type]
  new_samples.filter(filter).forEach(PIRD => {
    const second = seconds(PIRD.ms)
    const s = slice(PIRD.ms, settings.milliseconds_per_step)
    const val = PIRD.val * scale
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

