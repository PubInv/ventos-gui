import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const ran = () => {
  return ((Math.random() * 20) / Math.random()) * 2;
};

const data = () => {
  return [ran(), 10, 10, ran(), 12, 16];
};

function VolumeGraph() {
  const [posts, setPosts] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [postsx, setPostsx] = useState(data);
  return (
    <div>
      <Plot
        className="flex"
        data={[
          {
            x: posts,

            y: postsx,

            type: "line",

            mode: "lines+markers",

            marker: { color: "green" },

            setInterval: 200,
          },
        ]}
        layout={{
          autosize: false,
          width: 920,
          height: 640,
          title: "Volume",
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

export default VolumeGraph;
