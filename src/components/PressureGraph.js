import React from "react";
import Plot from "react-plotly.js";

const ran = () => {
  return Math.random();
};

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

export default PressureGraph;
