/**
 * todo:
 * - fetch data into a buffer
 * determine canvas width
 * determine canvas height
 * pixels per second (pps)
 * x0_timestamp // window buffer x=0 at t=t
 *
 *
 * Each pixels per second equal frames per second.
 */
import React
  , { useState, useEffect }
  from "react";
import {seconds, slice} from '../PIRUtils';

const meta = {
  flow: {scale: 5, offset: 0.5, color: 'yellow'},
  pressure: {scale: 1, offset: 0, color: 'pink'}
}
const types= Object.keys(meta)

function stroke(ctx, x0, y0, x1, y1) {
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

const now = seconds(Date.now())

export default function Graph({getData, params}) {

  const [data, setData] = useState({pressure: {}, flow: {}});

  const [size, setSize] = useState({height:100, width:100});
  const [cursor, setCursor] = useState();

  const milliseconds_per_step = 50 // fixme!! (should come from settings!)
  const lag_seconds = 10 // staying behind makes the display smoother!
  const fps = 40;
  const pixels_per_frame = 2
  const clear_width_s = 1 // second

  useEffect(animate, [getData]);

  function summarise_data(data) {
    const summary = {}
    types.forEach(type => {
      const keys = Object.keys(data[type])
      const relative = keys.map(i => i-now)
      summary[type] = `${type} (${keys.length}) - ${Math.min(...relative)} ${Math.max(...relative)}`
    })
    return summary
  }

  function animate() {
    const t_zero = Date.now()
    const second_0 = seconds(t_zero)
    const slice_0 = slice(t_zero, milliseconds_per_step)
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const {width, height} = canvas.getBoundingClientRect();
    const plot_height = height / types.length // how high for each plot
    var [second_now, slice_now] = [second_0, slice_0]
    const [x_pad, y_pad] = [10, 4]
    const clear_width_px = clear_width_s * fps * pixels_per_frame

    const seconds_to_show = Math.floor((width-x_pad) / (fps * pixels_per_frame))

    setSize({width, height})
    ctx.fillStyle = "#dbbd7a";
    ctx.fill();
    ctx.strokeStyle = 'blue';

    var time_out_id
    draw();

    // each data point is a pair of numbers representing the range
    const [min, max] = [0,1]
    function data_y(data, type, index, second, slice, bound) {
      const s = data[type][second-lag_seconds] || []
      const y = (s[slice] || [0,0])[bound]
      return height - ((meta[type].scale * y)  + y_pad + (index + meta[type].offset) * plot_height)
    }
    function pad(x, digits) {
      return ("                  "+x).slice(-digits)
    }

    function draw() {
      time_out_id = setTimeout(function() {
        const data = getData() // get the latest copy!
        setData(data)
        var [second_last, slice_last] = [second_now, slice_now]
        const t_now = Date.now()
        second_now = seconds(t_now)
        slice_now = slice(t_now, milliseconds_per_step)
        const cursor_pos_seconds = ((t_now - t_zero) / 1000) % seconds_to_show
        const cursor_pos_px = Math.floor(cursor_pos_seconds * fps * pixels_per_frame)
        setCursor(`${second_now-second_0}-${pad(slice_now, 2)}
          (${lag_seconds}s behind) (W,H: ${width}, ${height})
          (cursor: ${cursor_pos_seconds.toFixed(2)}s  ${pad(cursor_pos_px, 5)}px)
          `)
        types.forEach((type, i) => {
          [min, max].forEach(bound => {
            const y_last = data_y(data, type, i, second_last, slice_last, bound)
            const y_now = data_y(data, type, i, second_now, slice_now, bound)
            ctx.strokeStyle = meta[type].color
            stroke(ctx, cursor_pos_px, y_last, cursor_pos_px+pixels_per_frame, y_now+2)
          })
        })
        ctx.strokeStyle = 'yellow';
        stroke(ctx, cursor_pos_px, height, cursor_pos_px+4, height-y_pad)
        // test drawing code
        ctx.clearRect(cursor_pos_px+4, 0, clear_width_px, height);
        requestAnimationFrame(draw);
      }, 1000 / fps);
    }
    return () => {
      clearTimeout(time_out_id)
    }
  }


  return <div className="" >
    <pre>{cursor}</pre>
    <canvas
       id="canvas"
       width={size.width}
       height={size.height}
       style={{height:"500px", width:"100%", backgroundColor: 'black'}}>
    </canvas>
    <pre>
    {JSON.stringify(summarise_data(data), null, 2)}
    </pre>
    </div>
}
