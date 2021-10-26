import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import values from "postcss-modules-values";
import qs from 'qs';

// TODO: Move this to a configuration file so it is in one place!
const DSERVER_URL = "https://ventos.dev/ventos";
// const DSERVER_URL = "http://127.0.0.1:8000";

export default function IE() {
  // modal
  const [modalOpen, setModalOpen] = useState(false);

  // Pimax
  const initialFormState = {
    val: "1:2",
  };

  const [newFormValues, setNewFormValues] = useState(initialFormState);

  const updateOnChange = (e) => {
    setNewFormValues({
      ...newFormValues,
      [e.target.name]: e.target.value,
    });
  };

  const UpdateOnSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    var url = DSERVER_URL + "/control/";

    // Note: PIRCS uses E:I ratio times 10, NOT I:E ratio.
    // This GUI element should probably really have to states.
    // I will for the time being, however, assume it is in the
    // form I:E. If there is no colon in the string, we have to punt.
    var vs = newFormValues.val.split(':');
    if (vs.length != 2) {
      console.log("INTERNAL GUI ERROR: I:E value just have colon");
    }
    var internal = parseInt(vs[0]);
    var external = parseInt(vs[1]);
    var EtoI = 10 * external / internal;

    var data = {
        com: "C",
        par: "I",
        int: "T",
        mod: 0,
        val: EtoI // PIRDS uses mm H2O
    };
    const options = {
      url: url,
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
    };

    axios(options).then(function (response) {
        console.log(response);
        console.log(newFormValues);
    });
  };

  return (
    <div className="flex justify-center">
      <button
        className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        IE<br></br>
        {newFormValues.val}
      </button>
      <Modal isOpen={modalOpen}>
        <div className="flex justify-center h-full p-40 bg-blue-100">
          <span className="flex-grow">
            <form id="IEform" onSubmit={UpdateOnSubmit}>
              <input
                className="mr-20 w-50 border-1"
                name="val"
                value={newFormValues.val}
                onChange={updateOnChange}
                placeholder="New Pimax"
              />
            </form>
          </span>
          <span className="flex-shrink-0 ml-4">
            <button
              type="submit"
              form="IEform"
              className="ml-12 font-medium text-purple-600 bg-white rounded-md hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </span>
        </div>

        <button
          onClick={(e) => {
            setModalOpen(false);
          }}
        >
          Close modal
        </button>
      </Modal>
    </div>
  );
}
