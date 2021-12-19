import "./App.css";
import ClinicalDisplay from "./components/ClinicalDisplay";
import ServerConfigForm from "./components/ServerConfigForm";
import { useReducer } from 'react';

const initialState = {
  dserverurl: '',
  traceid: '',
  display_mode: 'clinical',
};

function reducer(state, action) {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.value};
    default:
      throw new Error();
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <h1 className="display-4">VentOS Clinical GUI
    |{state.dserverurl} {state.traceid}|
    </h1>
      <ClinicalDisplay />
      <ServerConfigForm dispatch={dispatch}/>
        <p className="lead">This is a work in progress.</p>

    </div>
  );
}

export default App;
