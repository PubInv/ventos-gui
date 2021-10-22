import React from "react";
import VolumeGraph from "./VolumeGraph";
import PressureGraph from "./PressureGraph";
import VentInput from "./VentInput";
import { react } from "plotly.js";

function ClinicalDisplay() {
  const greeting = "Hello Function Component!";
  const data = [{"id":"Pinsp", "name": "cmH2O", "value": "25" }, {"id":"2", "name": "RR", "value": "10" }, { "id":"3","name": "IE", "value": "1:2" },{ "id":"4","name": "Pimax", "value": "40" },{"id":"5", "name": "Peep", "value": "off" }]
  
  
  return (
    <React.Fragment>
    <div className="flex flex-col bg-black text-green-600 w-screen ">
      <div className="flex justify-between">
        <div className="border-2 border-solid border-cyan-100-accent w-96 mt-4 ml-10">
          <div>
            <PressureGraph />
          </div>
          <div className="flex justify-between mx-2">
            <div className="flex flex-col w-1/2">
          
              <div className="flex justify-between">
                <div>ppeak</div>
                <div>50</div>
              </div>
              <div className="flex justify-between">
                <div>pplot</div>
                <div>50</div>
              </div>
              <div className="flex justify-between">
                <div>pmean</div>
                <div>50</div>
              </div>
              <div className="flex justify-between">
                <div>peep</div>
                <div>50</div>
              </div>
            </div>

            <div className="flex flex-col w-1/2 mx-2">
            
              <div className="flex justify-between">
                <div>tvimp</div>
                <div>80</div>
              </div>
              <div className="flex justify-between">
                <div>tvemp</div>
                <div>80</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mx-2">
            <div className="flex flex-col w-1/2">
              <p>MI</p>
              <div className="flex justify-between">
                <div>ppeak</div>
                <div>50</div>
              </div>
            </div>

            <div className="flex flex-col w-1/2 mx-2">
              <p>I/min</p>
              <div className="flex justify-between">
                <div>tvimp</div>
                <div>80</div>
                
              </div>
              <div className="flex justify-between">
                <div>tvemp</div>
                <div>80</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <VolumeGraph />
        </div>

        <div className="flex flex-col w-96 mr-10 mt-4">
          <div>
             
          <div>
            
                {data.map((d, i) => {
                  return (<VentInput data={d} />)
              })} 
            </div>
          </div>
        </div>
      </div>
        {/*------------this should be a single component---------------*/}
        <div className="flex justify-center">
      {data.map((d, i) => { 
        return (<VentInput data={ d}/>)
        
      })}
     </div>
        

      </div>  
      
    
      </React.Fragment>
  );
}

export default ClinicalDisplay;
