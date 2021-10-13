import React from "react";
import VolumeGraph from "./VolumeGraph";
import PressureGraph from "./PressureGraph";

function ClinicalDisplay() {
  const greeting = "Hello Function Component!";

  return (
    <div className="flex flex-col bg-black text-green-600 w-screen ">
      <div className="flex justify-between">
        <div className="border-2 border-solid border-cyan-100-accent w-96 mt-4 ml-10">
          <div>
            <PressureGraph />
          </div>
          <div className="flex justify-between mx-2">
            <div className="flex flex-col w-1/2">
              <p>hello</p>
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
              <p>hello</p>
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
            <div className="flex border-2 border-b-0 border-solid border-cyan-100-accent h-36 w-40rem">
              <div>
                <p>Ppeak</p>
                <p>40</p>
              </div>
              <div>
                <p>CMI</p>
                <p>Pmaan</p>
                <p>PEEP</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex border-2 border-b-0 border-solid border-cyan-100-accent h-36">
              <div>
                <p>Ppeak</p>
                <p>40</p>
              </div>
              <div>
                <p>CMI</p>
                <p>Pmaan</p>
                <p>PEEP</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex border-2 border-b-0 border-solid border-cyan-100-accent h-36">
              <div>
                <p>Ppeak</p>
                <p>40</p>
              </div>
              <div>
                <p>CMI</p>
                <p>Pmaan</p>
                <p>PEEP</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex border-2 border-solid border-cyan-100-accent h-36">
              <div>
                <p>Ppeak</p>
                <p>40</p>
              </div>
              <div>
                <p>CMI</p>
                <p>Pmaan</p>
                <p>PEEP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-cyan-200-accent border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>TV</p>
          <p>500</p>
        </div>

        <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>RR</p>
          <p>10</p>
        </div>

        <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>IE</p>
          <p>1:2</p>
        </div>

        <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>Pimax</p>
          <p>40</p>
        </div>

        <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>PEEP</p>
          <p>OFF</p>
        </div>

        <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <p>MORE</p>
          <p>SETTINGS</p>
        </div>
      </div>
    </div>
  );
}

export default ClinicalDisplay;
