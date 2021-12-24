import "./App.css";
import { useReducer,
  useEffect,
  useState
  } from 'react';
import {server} from './PIRServer'
import ServerConfigForm from "./components/ServerConfigForm";
import SettingButton from "./components/SettingButton";
import { ArrowRight, Gear } from 'react-bootstrap-icons';

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
  {name: 'MV', value: "4.8", units: "L"},
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
  const [uiMode, setUIMode] = useState('server_config');

  // fixme needs to capture some kind of promise
  function newSetting(field, value) {
    server.sendPIRCS(field, value)
    alert(field, value)
  }

  console.log('restarting app: state', JSON.stringify(state, null, 2))

  useEffect(() => {
    // start server
    const settings = server.default_ventilator_session
    console.log('settings', settings)
    server.start(settings)
    // return function to shut down the server for clean exit
    return () => server.halt();
  }, []);

  const setServer = (live) => {
    live ? server.start() : server.halt()
    dispatch({type: 'patch', value: {live}})
  }

  return (<div>
  <div className='container-fluid'>
    <div className='row bg-dark text-info'>
      <h1 className=''>VentOS Clinical GUI
      |{state.ventilator_session.dserverurl} {state.ventilator_session.traceid}|
      </h1>
    </div>
    <div className='row'>
        {uiMode === 'server_config' ? (
          <div className='col-2 bg-dark text-info'>
              <button type="button"
                className='float-end btn btn-dark'
                onClick={() => setUIMode(false)} >X</button>
            <div className=''>
              <ServerConfigForm
                 ventilator_session={state.ventilator_session}
                 dispatch={dispatch}/>
            </div>
        </div>
      ) : (<></>)}
      <div className='col'>
        <div id="PFGraph"></div>
      </div>
        <div className='col-2 bg-dark text-success'>
          {observations.map((o) => <div key={o.name}>
            <div className=''>
              <div>
                <div className='mt-3'>{o.name}</div>
                <div>
                  <span className='display-1'>{o.value}</span>
                  <span className=''>{o.units}</span>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>
    <div className='row bg-dark py-2'>
      {settings.map((s) =>
        <div className='col'>
          <SettingButton key={s.name}
          setting={s} onChange={newSetting} />
      </div>)}
        <div className='col'>
          <div className='card card m-1 p-3 text-white bg-dark'>
          <button type="button"
             className='btn-info'
             onClick={() => setUIMode('server_config')} >
              <Gear />
          </button>
        </div>
        </div>
    </div>
  </div>
  <p className=''>This is a work in progress.</p>
    <button onClick={() => setServer(!state.live)}
    className={state.live ? 'btn-danger' : 'btn-success'}
  >
      {state.live ? 'stop' : 'start'} data fetch
    </button>
  </div>);
}

export default App;
