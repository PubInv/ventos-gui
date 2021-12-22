import "./App.css";
import { useReducer,
  useEffect,
  useState
  } from 'react';
import {server} from './PIRServer'
import ServerConfigForm from "./components/ServerConfigForm";
import SettingButton from "./components/settings/SettingButton";

const initialState = {
  display_mode: 'clinical',
  live: true,
  ventilator_session: {}
};

// dummy data
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
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  function newSetting(field, value) {
    alert(field, value)
  }

  console.log('restarting app: state', JSON.stringify(state, null, 2))

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
    <div className="flex flex-col w-screen text-green-600 bg-black ">
      <div className="flex justify-between">
        {showLeftPanel ? (
          <div className="mt-4 border-2 border-solid border-cyan-100-accent w-96">
              <button type="button" className="float-right m-3"
                onClick={() => setShowLeftPanel(false)} >
                X
              </button>
            <div className="flex justify-between m-2">
              <ServerConfigForm
                 ventilator_session={state.ventilator_session}
                 dispatch={dispatch}/>
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
    <p className="lead">This is a work in progress.</p>
      <button onClick={() => setServer(!state.live)} >
        {state.live ? 'stop' : 'start'} data fetch
      </button>
    </div>
  );
}

export default App;
