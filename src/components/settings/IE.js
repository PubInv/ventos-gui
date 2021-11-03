import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import values from "postcss-modules-values";
import qs from "qs";

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
    var url = process.env.REACT_APP_DSERVER_URL + "/control/";

    // Note: PIRCS uses E:I ratio times 10, NOT I:E ratio.
    // This GUI element should probably really have to states.
    // I will for the time being, however, assume it is in the
    // form I:E. If there is no colon in the string, we have to punt.
    var vs = newFormValues.val.split(":");
    if (vs.length != 2) {
      console.log("INTERNAL GUI ERROR: I:E value just have colon");
    }
    var internal = parseInt(vs[0]);
    var external = parseInt(vs[1]);
    var EtoI = (10 * external) / internal;

    var data = {
      com: "C",
      par: "I",
      int: "T",
      mod: 0,
      val: EtoI, // PIRDS uses mm H2O
    };
    const options = {
      url: url,
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
    };

    axios(options).then(function (response) {
      console.log(response);
      console.log(newFormValues);
    });
  };

  return (
    <div className="flex justify-center h-100">
      <button
        className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        IE<br></br>
        {newFormValues.val}
      </button>
      {/* start of modal  */}
      {/* if modalOpen is true, show modal, if false, render an empty fragment  */}
      {modalOpen ? (
        <div
          class="fixed z-10 inset-0 h-full overflow-y-auto -mt-64"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-end justify-center h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity "
              aria-hidden="true"
            ></div>
            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div class="h-auto inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all  sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="flex flex-col items-start justify-center h-auto mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-3/4">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      IE
                    </h3>
                    <div class="mt-4 w-full flex row items-center justify-center">
                      <div class="mt-2 w-1/2">
                        <input
                          id="value"
                          name="val"
                          value={newFormValues.val}
                          onChange={updateOnChange}
                          placeholder="New Pimax"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        ></input>
                      </div>
                      <button
                        onClick={UpdateOnSubmit}
                        type="button"
                        class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={(e) => {
                    setModalOpen(false);
                  }}
                  type="button"
                  class="mt-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
