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

const types=['flow', 'pressure']

function stroke(ctx, x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

const now = seconds(Date.now())

export default function Graph({data, params}) {

  const [size, setSize] = useState({height:100, width:100});
  const [cursor, setCursor] = useState();

  const milliseconds_per_step = 50 // fixme!! (should come from settings!)
  const lag_seconds = 10 // staying behind makes the display smoother!
  const fps = 2;
  const pixels_per_frame = 2

  useEffect(animate, []);

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
    var [second_now, slice_now] = [second_0, slice_0]
    const [x_pad, y_pad] = [10, 4]

    const seconds_to_show = Math.floor((width-x_pad) / (fps * pixels_per_frame))
    console.log('qqq seconds_to_show', seconds_to_show)

    setSize({width, height})
    ctx.fillStyle = "#dbbd7a";
    ctx.fill();
    ctx.lineWidth = "2";
    ctx.strokeStyle = 'blue';

    var animation_frame
    var time_out_id
    draw();

    function data_y(type, second, slice) {
      const s = data[type][second-lag_seconds] || []
      const y = (s[slice] || [0,0])[1]
      console.log('qq y', y)
      return height - y + 10
    }
    function pad(x, digits) {
      return ("                  "+x).slice(-digits)
    }

    function draw() {
      time_out_id = setTimeout(function() {
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
        const y_last = data_y('pressure', second_last, slice_last)
        const y_now = data_y('pressure', second_now, slice_now)
        ctx.strokeStyle = 'red';
        stroke(ctx, cursor_pos_px, y_last, cursor_pos_px+pixels_per_frame, y_now)
        ctx.strokeStyle = 'yellow';
        stroke(ctx, cursor_pos_px, height, cursor_pos_px+4, height-y_pad)
        // console.log('qq draw', cursor_pos_px, height, cursor_pos_px+4, height-y_pad)
        // test drawing code
        ctx.clearRect(cursor_pos_px+4, 0, cursor_pos_px+14, height);
        animation_frame = requestAnimationFrame(draw);
      }, 1000 / fps);
    }
    return () => {
      // cancelAnimationFrame(animation_frame)
      // alert('clean-up!')
      clearTimeout(time_out_id)
    }
  }


  return <div className="" >
    <pre>{cursor}</pre>
    <canvas
       id="canvas"
       width={size.width}
       height={size.height}
       style={{height:"250px", width:"100%", backgroundColor: 'black'}}>
    </canvas>
    <pre>
    {JSON.stringify(summarise_data(data), null, 2)}
    </pre>
    </div>
}
