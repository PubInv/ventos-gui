import React, { useState } from "react";
import axios from "axios";
import qs from "qs";

export default function SettingButton({setting, onChange}) {
  // modal
  const [editing, setEditing] = useState(false);
  const [newFormValue, setNewFormValue] = useState(setting.value);

  const updateOnChange = (e) => {
    setNewFormValue(e.target.value);
  };

  const onReset = (e) => {
    alert('reset');
  };

  const onSubmit = (e) => {
    const decision = window.confirm(
      `Please confirm setting ${setting.name} to ${newFormValue}`)
    // fixme - need nicer way to do this!
    if (decision) {
      onChange(setting.name, newFormValue)
    } else {
      setNewFormValue(setting.value);
    }
  };

  return <div
  className="flex justify-center h-100 bg-cyan-300 border-2 border-solid w-100% p-10 m-5 rounded-lg text-black"
      >
    <div>{setting.name}</div>
    <div>
    <form
        onReset={onReset}
        onSubmit={onSubmit}
    >
    <input id="value" name="val" value={newFormValue}
        onChange={updateOnChange}
        placeholder="New IE" required
        className=""
      ></input>
    </form >
    </div>
  </div>
}
