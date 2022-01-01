import React, { useState } from "react";

export default function SettingButton({setting, onChange}) {

  const [newFormValue, setNewFormValue] = useState(setting.value);

  const updateOnChange = (e) => {
    setNewFormValue(e.target.value);
  };

  const onReset = (e) => {
    alert('reset');
  };

  const onSubmit = (e) => {
    if (setting.name !== newFormValue) {
      const decision = window.confirm(
        `Please confirm setting ${setting.name} to ${newFormValue}`)
      // fixme - need nicer way to do this!
      if (decision) {
        // call the parent event handler
        onChange(setting.name, newFormValue)
      } else {
        setNewFormValue(setting.value);
      }
    }
  };

  return <div className="card mx-2 p-3 bg-info" >
    <div className='class-body'>
    <div className='class-header text-center'>{setting.name}</div>
      <form onReset={onReset} onSubmit={onSubmit} >
        <input id="value" name="val" value={newFormValue}
            onChange={updateOnChange}
            placeholder={setting.name} required
            className="form-control form-control-lg"
          ></input>
      </form >
    </div>
  </div>
}
