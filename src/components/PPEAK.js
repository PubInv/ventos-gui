import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import values from "postcss-modules-values";

export default function PPEAK() {
  // modal
  const [modalOpen, setModalOpen] = useState(false);

  const onOpenModal = () => {
    setModalOpen(true);
  };
  const onCloseModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  // Pimax
  const [updatingPimax, setUpdatingPimax] = useState(false);
  const [newPimaxFormValues, setNewPimaxFormValues] = useState(0);

  const UpdatePimaxOnChange = (e) => {
    setNewPimaxFormValues({
      ...newPimaxFormValues,
      [e.target.name]: e.target.value,
    });
  };

  const UpdatePimaxOnSubmit = async function () {
    console.log("hello4");

    await axios.get("https://ventos.dev/ventos/300").then((response) => {
      console.log(response.data);
      console.log("hello5");
    });
    return false;
  };

  const updatingModal = (updatingPpeak) => {
    if (updatingPpeak === false) {
      return (
        <button
          className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black"
          type="button"
        >
          <p>Pimax</p>
          <p>40</p>
        </button>
      );
    } else {
      <div>hello</div>;
    }
  };

  return (
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

      <button
        className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black"
        onClick={onOpenModal}
      >
        {" "}
        Pimax<br></br>40
      </button>
      <Modal isOpen={modalOpen}>
        <span className="flex-grow">
          <form id="pimaxForm" onSubmit={UpdatePimaxOnSubmit(updatingPimax)}>
            <input
              className="mr-20 w-50 border-1"
              name="Pimax"
              value={newPimaxFormValues.Pimax}
              onChange={UpdatePimaxOnChange}
              placeholder="New Pimax Value"
            />
          </form>
        </span>
        <span className="flex-shrink-0 ml-4">
          <button
            type="submit"
            form="pimaxForm"
            className="ml-12 font-medium text-purple-600 bg-white rounded-md hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Submit
          </button>
        </span>

        <button onClick={onCloseModal}> Close modal</button>
      </Modal>

      <button
        className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black"
        type="button"
        onClick={() => {
          console.log("hello");
          axios.get("https://ventos.dev/ventos/300").then((response) => {
            console.log(response.data);
          });
        }}
      >
        <p>PEEP</p>
        <p>OFF</p>
      </button>

      <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
        <p>MORE</p>
        <p>SETTINGS</p>
      </div>
    </div>
  );
}
