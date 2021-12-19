
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
                        s.ms = -s.ms;
                      } else if (s.event === "E") {
                      }
                    }

                  });
  return samples;
}

export function add_samples(samples, cur_sam, MAX_SAMPLES_TO_STORE_S) {
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

  // I think this is de-dupeing code...
  samples = samples.filter((s, index, self) =>
    self.findIndex(t => t.ms === s.ms
                   && t.type === s.type
                   && t.loc === s.loc
                   && t.num === s.num
                   && t.event === s.event
                   && t.val === s.val) === index);
  return samples
}
