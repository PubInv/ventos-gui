import React, { useState } from "react";
import SettingButton from "./settings/SettingButton";

const settings = [
  {name: 'Mode', value: "PCV", units: ""},
  {name: 'Pmax', value: "20", units: "cmH2O"},
  {name: 'PEEP', value: "5", units: "cmH2O"},
  {name: 'RR', value: "11", units: "/min"},
]

const observations = [
  {name: 'Ppeak', value: "23", units: "cmH2O"},
  {name: 'PEEP', value: "5", units: "cmH2O"},
  {name: 'TV', value: "412", units: "ml"},
  {name: 'ml', value: "4.8", units: "L"},
  {name: 'RR', value: "11", units: "/min"},
]


function ClinicalDisplay() {
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  function newSetting(field, value) {
    alert(field, value)
  }

  return (
    <div className="flex flex-col w-screen text-green-600 bg-black ">
      <div className="flex justify-between">
        {showLeftPanel ? (
          <div className="mt-4 border-2 border-solid border-cyan-100-accent w-96">
              <button type="button" className="float-right m-3"
                onClick={() => setShowLeftPanel(false)} >
                X
              </button>
            <div className="flex justify-between m-2">
              stuff goes here
            </div>
        </div>
      ) : (
        <div className="m-4">
          <button type="button" onClick={() => setShowLeftPanel(true)} >
            Show
          </button>
        </div>
      )}

      <div id="PFGraph"></div>

      <div className="flex flex-col mt-4 w-48">
        {observations.map((o) => <div key={o.name}>
          <div className="flex h-36 w-40rem">
            <div>
              <p className="float-left">{o.name}</p>
              <span className='display-2 text-right'>{o.value}</span>
              <span className='float-right text-right'>{o.units}</span>
            </div>
          </div>
        </div>)}
      </div>
    </div>

    <div className="flex justify-center">
      {settings.map((s) => <SettingButton key={s.name}
        setting={s} onChange={newSetting} />)}
    </div>
  </div>
  );
}

export default ClinicalDisplay;
