import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import VentInput from "./VentControl";
import values from "postcss-modules-values";

export default function PPEAK() {
  const data = [
    { id: "1", name: "TV", value: "25" },
    { id: "2", name: "RR", value: "10" },
    { id: "3", name: "IE", value: "1:2" },
    { id: "4", name: "Pimax", value: "40" },
    { id: "5", name: "Peep", value: "off" },
  ];

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
    });
    return false;
  };

  return (
    <React.Fragment>
      <div className="flex justify-center">
        {data.map((d, i) => {
          return <VentInput data={d} />;
        })}
      </div>
    </React.Fragment>
  );
}
