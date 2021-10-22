import React from "react";


class VentInput extends React.Component {
  constructor(props){
  super(props)
  }
  data = this.props.data
  
  render(){
    return (<React.Fragment>
      
      <div className="bg-cyan-300 border-2 border-solid border-red-300-contrast w-100% p-10 m-5 rounded-lg text-black">
          <div class="vent-input">
           
      <button ventinput>
            <div className="v">{this.props.data.value}</div>
              <div className="l">{this.props.data.name }</div>
        <div className="u">unit</div>
            </button>
          </div>
        
    </div>
    </React.Fragment>)
  }

}




export default VentInput;