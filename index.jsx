
import React, {useRef} from 'react';
import ReactDOM from "react-dom";
import { BANK_ONE, BANK_TWO } from './banks';

const ONE = 'ONE';
const TWO = 'TWO';

////////////////////////////////--------------------////////////////////////////////
function App() {
  
  const [onOff, setOnOff] = React.useState(true);
  const [displayText, setDisplayText] = React.useState("");
  const [bank, setBank] = React.useState(ONE);
  const audioRefsBank1 = BANK_ONE.map(() => useRef()); // Heater Kit 
  const audioRefsBank2 = BANK_TWO.map(() => useRef());// Piano Kit

  const handlePower = (event) => {
    if(onOff){
      setDisplayText('');
      setOnOff(false);
    }else{
      setDisplayText('WELCOME');
      setOnOff(true);
    }
  };
  
  const handleBank = (event) => {
    if(onOff){
      if(bank === ONE) {
        setBank(TWO);
        setDisplayText('Piano Kit');
      }else{
        setBank(ONE);
        setDisplayText('Heater Kit');
      }
    }
  }
  
  const playAudio = (index) => {
    if(onOff){
      let audioElement;
      let btn;
      if(bank === ONE){ 
        btn = document.getElementById(BANK_ONE[index].id)
        audioElement = audioRefsBank1[index].current;
        audioElement.currentTime = 0; // restart
        audioElement.play();
        setDisplayText(BANK_ONE[index].id);
      }else{
        btn = document.getElementById(BANK_TWO[index].id)
        audioElement = audioRefsBank2[index].current;
        audioElement.currentTime = 0; // restart
        audioElement.play();
        setDisplayText(BANK_TWO[index].id);
      }
      btn.classList.add('active-btn');
      setTimeout(() => {
        btn.classList.remove('active-btn');
        btn.blur();
      },100)
    }
  };
  
  const onVolumeChanger = (event) =>{
    if(onOff){
      const newVolume = parseFloat(event.target.value);
      if(bank === ONE) {
        for( let i = 0; i< BANK_ONE.length ; i++){
          audioRefsBank1[i].current.volume = newVolume;
        }
      }else{
        for( let i = 0; i< BANK_TWO.length ; i++){
          audioRefsBank2[i].current.volume = newVolume;
        }
      }
      setDisplayText('Volume: ' + Math.floor(newVolume * 10));
    }
  };
  
  React.useEffect(() => {

    const handleKeyPress = (event) => {
      if(onOff){
        const key = event.key.toUpperCase();
        const index = onKeyDown(key);
        if (index != false || index === 0) {
          playAudio(index);
        }
      }
    };
    
    const onKeyDown = (key) => {
      if(bank === ONE){
        for( let i=0; i<BANK_ONE.length; i++){
          if(BANK_ONE[i].keyTrigger == key){
            return i;   
          }
        }
      }else{
        for( let i=0; i<BANK_TWO.length; i++){
          if(BANK_TWO[i].keyTrigger == key){
            return i;   
          }
        }
      }
      return false;
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onOff, bank]);

  return (
      <div id="drum-wrapper">
        <div id="drum-left">
          <ButtonRender 
            playAudio={playAudio} 
            audioRefs={bank === ONE ? audioRefsBank1 : audioRefsBank2} 
            bank={bank === ONE ? BANK_ONE : BANK_TWO}
          />          
        </div>
        <div id="drum-rigth">
          <div ><Display displayText={displayText}/></div>
          <div ><Toggle handlePower={handlePower}/></div>
          <div ><Bank handleBank={handleBank}/></div>
          <div ><Slider onVolumeChanger={onVolumeChanger}/> </div>       
        </div>
      </div>
  );
}
////////////////////////////////--------------------////////////////////////////////
class Display extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div id="display">
        <span>{this.props.displayText}</span>
      </div>
    );
  }
}
////////////////////////////////--------------------////////////////////////////////
class Slider extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <div className="slidecontainer">
            <label>
              <input type="range" min="0" max="1"  className="sliderVolume" id="myRange" step="0.01" onChange={this.props.onVolumeChanger}/>
          </label>
            <span><i className="fa fa-volume-up icon-size" aria-hidden="true"></i></span>
        </div>
      </div>   
    );
  }
}
////////////////////////////////--------------------////////////////////////////////
class Toggle extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div id="power">
        <p>Power</p>
        <label className="switchPower">
          <input type="checkbox" onClick={this.props.handlePower}/>
          <span className="sliderPower"></span>
        </label>        
      </div>
    );
  }
}
////////////////////////////////--------------------////////////////////////////////
class Bank extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div id="power">
        <p>Bank</p>
        <label className="switchPower">
          <input type="checkbox" onClick={this.props.handleBank} />
          <span className="sliderPower"></span>
        </label>        
      </div>
    );
  }
}
////////////////////////////////--------------------////////////////////////////////
class ButtonRender extends React.Component {
  constructor(props) {
    super(props); 
  }
  render() {
    const pad = this.props.bank.map((item, index) => {  return (
      <button key={item.keyTrigger} onClick={() => this.props.playAudio(index, item.id)} accessKey={item.keyTrigger} className="drum-pad btn" id={item.id} >
        {item.keyTrigger}
        <audio ref={this.props.audioRefs[index]} src={item.url} className="clip" id={item.keyTrigger}>
          <source src={item.url} type="audio/mpeg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      </button>
    )})
    return pad;
  }
}; 
////////////////////////////////--------------------////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  const MyApp = <App />;    
  ReactDOM.render(MyApp, document.getElementById('wrapper'));
});
