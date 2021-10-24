import React, { useState } from "react";
import Modal from "react-modal";
import VolumeGraph from "./VolumeGraph";
import PressureGraph from "./PressureGraph";
import PPEAK from "./PPEAK";

function ClinicalDisplay() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <div className="flex flex-col w-screen text-green-600 bg-black ">
      <div className="flex justify-between">
        <div className="mt-4 ml-10 border-2 border-solid border-cyan-100-accent w-96">
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

        <div className="flex flex-col mt-4 mr-10 w-96">
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
      <PPEAK />
    </div>
  );
}

export default ClinicalDisplay;
