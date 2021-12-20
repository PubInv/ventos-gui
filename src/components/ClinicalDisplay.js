import React, { useState } from "react";
//import Modal from "react-modal";
// import VolumeGraph from "./VolumeGraph";
// import PressureGraph from "./PressureGraph";
import PIMAX from "./settings/PIMAX";
import TV from "./settings/TV";
import RR from "./settings/RR";
import IE from "./settings/IE";

function ClinicalDisplay() {
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  return (
    <div className="flex flex-col w-screen text-green-600 bg-black ">
      <div className="flex justify-between">
        {showLeftPanel ? (
          <div className="mt-4 ml-10 border-2 border-solid border-cyan-100-accent w-96">
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3 mt-2">
              <button
                type="button"
                className="w-8 h-8 -mr-1 flex items-center justify-center p-2 rounded-md hover:bg-white-300 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                onClick={() => setShowLeftPanel(false)}
              >
                X
              </button>
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
        ) : (
          <div className="m-4">
            <button
              type="button"
              className="w-8 h-8 -mr-1 flex items-center justify-center p-2 rounded-md hover:bg-white-300 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={() => setShowLeftPanel(true)}
            >
              Show
            </button>
          </div>
        )}

        <div id="PFGraph"></div>

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
      <div className="flex justify-center">
        <PIMAX />
        <TV />
        <RR />
        <IE />
      </div>
    </div>
  );
}

export default ClinicalDisplay;
