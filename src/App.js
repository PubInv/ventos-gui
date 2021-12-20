import "./App.css";
import ClinicalDisplay from "./components/ClinicalDisplay";
import ServerConfigForm from "./components/ServerConfigForm";
import { useReducer,
  useEffect,
  //useState
  } from 'react';
import {server} from './PIRServer'

const initialState = {
  display_mode: 'clinical',
  live: true,
  ventilator_session: {}
};


/**
 * Standard state modify function to generate a new object based an event.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'patch':
      const newstate = { ...state, ...action.value}
      console.log('newstate', JSON.stringify(newstate, null, 2))
      return newstate;
    default:
      throw new Error();
  }
}

// core react component
function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log('state', JSON.stringify(state, null, 2))

  useEffect(() => {
    const settings = server.default_ventilator_session
    console.log('settings', settings)
    server.start(settings)
    return () => server.halt();
  }, []);

  const setServer = (live) => {
    live ? server.start() : server.halt()
    dispatch({type: 'patch', value: {live}})
  }

  return (
    <div className="App">
      <h1 className="display-4">VentOS Clinical GUI
    |{state.ventilator_session.dserverurl} {state.ventilator_session.traceid}|
    </h1>
      <ClinicalDisplay />
      <ServerConfigForm
         ventilator_session={state.ventilator_session}
         dispatch={dispatch}/>
    <p className="lead">This is a work in progress.</p>
      <button onClick={() => setServer(!state.live)} >
        {state.live ? 'stop' : 'pause'}
      </button>
    </div>
  );
}

export default App;
