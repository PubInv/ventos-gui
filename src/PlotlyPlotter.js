import Plotly from 'plotly.js-dist';

const LARGE_HEIGHT = 800;
const CONVERT_PIRDS_TO_SLM = 1/1000;

const unpack = (rows, key) => rows.map((row) => row[key]);

// we have now changed this, there will be flow and
// pressure in the same samples, and we should filter.
function samplesToLine(samples) {
  var flows = samples.filter(s => s.event === 'M' && s.type === 'F');
  // These are slm/1000, or ml/minute...
  // so we multiply by 1000 to get liters per minute
  var flow_values = unpack(flows,"val").map(v => v * CONVERT_PIRDS_TO_SLM);
  var fmillis = unpack(flows, 'ms');
  // Convert to seconds...
  var fmin = Math.min(...fmillis);
  var fzeroed = fmillis.map(m =>(m-fmin)/1000.0);

  var pressures = samples.filter(s => s.event === 'M' && s.type === 'D' && (s.loc === 'A' || s.loc === 'I'));

  var pmillis = unpack(pressures, 'ms');
  var pmin = Math.min(...pmillis);
  var pzeroed = pmillis.map(m =>(m-pmin)/1000.0);
  // the PIRDS standard is integral mm H2O, so we divide by 10
  var delta_p = unpack(pressures, 'val').map(p => p / 10);
  var diff_p = {type: "scatter", mode: "lines",
    name: "pressure",
    x: pzeroed,
    y: delta_p,
    line: {color: "#00FF00"}
   };

  var flow = {type: "scatter", mode: "lines",
		name: "flow",
		x: fzeroed,
	      y: flow_values,
              xaxis: 'x2',
              yaxis: 'y2',
              fill: 'tozeroy',
		line: {color: '#FFFF00'}
             };

  var max_flow = flow_values.reduce(
    function(a, b) {
      return Math.max(Math.abs(a), Math.abs(b));
    }
    ,0);
  var scaled_flow = flow_values.map(f => 100.0 * (f / max_flow));
  var flow_hollow = {type: "scatter", mode: "lines",
		name: "flow ghost",
		     x: fzeroed,
                     // Convert to a percentage
	             y: scaled_flow,
                     xaxis: 'x3',
                     yaxis: 'y3',
		line: {color: '#8888FF'}
               };
  return [diff_p,flow,flow_hollow];
}

export function plot(samples) {
  var new_data = samplesToLine(samples);
  var millis = unpack(samples, 'ms');
  var min = Math.min(...millis);
  // var zeroed = millis.map(m =>(m-min)/1000.0);
  var max = Math.max(...millis);
  var total_seconds = (max-min)/1000.0;
  var double_plot = [new_data[0],new_data[1]];

  var maxseconds = Math.ceil(total_seconds);
  var layout = {
      height: LARGE_HEIGHT,
      // Here I attempt to match Paulino's style
      plot_bgcolor: "#000",
      paper_bgcolor : "#000",
      showlegend: false,

      xaxis: {domain: [0.0,1.0],
              range : [0,maxseconds],
              tickfont: {color: 'green'}},
      yaxis: {
        title: 'P(cm H2O)',
        titlefont: {color: 'green'},
        tickfont: {color: 'green'},
      },
      xaxis2: {domain: [0.0,1.0],
               range : [0,maxseconds],
               tickfont: {color: 'yellow'}},
      yaxis2: {
        title: 'l/min',
        titlefont: {color: 'yellow'},
        tickfont: {color: 'yellow'}
      },
      grid: {
        rows: 2,
        columns: 1,
        pattern: 'independent',
        roworder: 'top to bottom'}
    }
  Plotly.newPlot('PFGraph',
                 double_plot,
                 layout,
                 {displayModeBar: false,
                  displaylogo: false,
                  responsive: true});

}
