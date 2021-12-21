/**
 * Module to provide generic functions to support PIRCS and PIRDS data
 */

// WARNING: This is a hack...if the timestamp is negative,
// we treat it as a limited (beyond range of sensor) measurement.
// Our goal is to warn about this, but for now we will just
// ignore and correct.
function sanitize_samples(samples) {
  samples.forEach(s =>
                  {
                    if (s.event === "M") {
                      if ("string" === (typeof s.ms))
                        s.ms = parseInt(s.ms);
                      if ("string" === (typeof s.val))
                        s.val = parseInt(s.val);
                      if ("string" === (typeof s.num))
                        s.num = parseInt(s.num);
                      if (s.ms < 0) {
                        s.ms = -s.ms; // fixme! what is going on here???
                      } else if (s.event === "E") {
                      }
                    }

                  });
  return samples;
}

// note: not guaranteeed to get samples in order
export function concatSamples(samples, new_samples, MAX_SAMPLES_TO_STORE_S) {
  new_samples = sanitize_samples(new_samples);
  var discard = Math.max(0,
    samples.length + new_samples.length - MAX_SAMPLES_TO_STORE_S);
  samples = samples.slice(discard); // fixme this should happen after the merge
  samples = samples.concat(new_samples);
  // fixme should be sorting new samples not old samples
  samples.sort((a,b) => a.ms < b.ms);
  // de-dupe - fixme de-duping should scan lists based on timestamps
  samples = samples.filter((s, index, self) =>
    self.findIndex(t => t.ms === s.ms
      && t.type === s.type
      && t.loc === s.loc
      && t.num === s.num
      && t.event === s.event
      && t.val === s.val) === index);
  return samples
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

