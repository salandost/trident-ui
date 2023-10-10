import React, { useState, useCallback } from 'react';
import './App.css';
import { HsvaColor, hexToHsva, hsvaToRgba} from '@uiw/color-convert';
import Colorful from '@uiw/react-color-colorful';
import { Mode, defaulyIP } from './constants';

const { S_LED, M_LED, L_LED } = Mode;
const mode: Set<Mode> = new Set();

function App() {
  const [colorS, setColorS] = useState<HsvaColor>(hexToHsva("#fff"));
  const [colorM, setColorM] = useState<HsvaColor>(hexToHsva("#fff"));
  const [colorL, setColorL] = useState<HsvaColor>(hexToHsva("#fff"));
  const modeToState = {
    [S_LED]: setColorS,
    [M_LED]: setColorM,
    [L_LED]: setColorL,
  };
  const modeToColor = {
    [S_LED]: colorS,
    [M_LED]: colorM,
    [L_LED]: colorL,
  };
  const [ip, setIp] = useState<string>(defaulyIP);
  const submit = useCallback(() => {
    const rgbS = hsvaToRgba(colorS);
    const rgbM = hsvaToRgba(colorM);
    const rgbL = hsvaToRgba(colorL);
    const url = (`http://${ip}/color?` +
    (mode.has(S_LED) ?`sr=${rgbS.r}&sg=${rgbS.g}&sb=${rgbS.b}&`:'') +
    (mode.has(M_LED)?`mr=${rgbM.r}&mg=${rgbM.g}&mb=${rgbM.b}&`:'')+
    (mode.has(L_LED)?`lr=${rgbL.r}&lg=${rgbL.g}&lb=${rgbL.b}`:''));
    try {
      fetch(url, {mode: "no-cors"});
    } catch (err) {
      console.log(err);
    }
    
  }, [colorL, colorM, colorS, ip]);
  console.log(mode);
  return (
    <div className="App">
      <div>
        <input type='text' placeholder='IP' value={ip} onChange={(val) => setIp(val.target.value)}/>
      </div>
      <div className='checkbox-container'>
        <input type='checkbox' onChange={({target}) => target.checked ? mode.add(S_LED) : mode.delete(S_LED)} /> <label>Small square color</label><br/>
        <input type='checkbox' onChange={({target}) => target.checked ? mode.add(M_LED) : mode.delete(M_LED)}/> <label>Medium square color</label><br/>
        <input type='checkbox' onChange={({target}) => target.checked ? mode.add(L_LED) : mode.delete(L_LED)}/> <label>Large square color</label>
      </div>
      <div className='sync-container'>
        <Colorful
          className='sync-slider'
          color={modeToColor[mode.values().next().value as Mode] || colorS}
          onChange={({hsva}) => {mode.forEach(m => modeToState[m](hsva))}}
          disableAlpha
        />
        </div>
      <button className='button-19 submit-button' onClick={submit}>Submit</button>
    </div>
  );
}

export default App;
