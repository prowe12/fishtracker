import React, { useState, useEffect} from 'react';
import LeafletMap from './components/LeafletMap';
import Legend from './components/Legend';
import './App.css';

function App() {
  const [compareValue, setCompareValue] = useState("option1");
  const [animate, setAnimate] = useState(false);
  const [clearAnimation, setClearAnimation] = useState(false);

  const handleRadioChange = (
      value
  ) => {
      setCompareValue(value);
  };

  const startAnimation = () => {
    // Whenever we start an animation, also set the clearAnimation variable to false so we can clear it later.
    setClearAnimation(false);
    setAnimate(true);
  };

  const stopAnimation = () => {
     // Whenever we stop an animation, also set the clearAnimation variable to false in case it is currently true.
    setClearAnimation(false);
    setAnimate(false);
  };

  const handleClearAnimation = () => {
    // When we click the clear button, also stop the animation.
    setClearAnimation(true);
    setAnimate(false);
  };


  return (
    <div className="app-container">
      <h1>Fish Tracker</h1>
      
      <div className="column-container"> 
        <LeafletMap compareValue={compareValue} animate={animate} clearAnimation={clearAnimation}/>
        <div className = "column">
            <Legend compareValue={compareValue}/>
        </div>
      </div>
      
      <div className="column-container">
        <div className="column">
            <div className="container">
                <div className="radioGroup">
                    <div className="radioButton">
                      <h2>Show groups</h2>
                        <input
                            type="radio"
                            id="option1"
                            value="option1"
                            checked={compareValue === "option1"}
                            onChange={() => handleRadioChange("option1")}
                        />
                        <label
                            htmlFor="option1"
                            className = "radioLabel">
                            Collected vs At Large
                        </label>
                    </div>
                    <div className="radioButton">
                        <input
                            type="radio"
                            id="option2"
                            value="option2"
                            checked={compareValue ==="option2"}
                            onChange={() =>
                                handleRadioChange("option2"
                            )}
                        />
                        <label
                            htmlFor="option2"
                            className = "radioLabel">
                            Fish by Species
                        </label>
                    </div>
                    <div className="radioButton">
                        <input
                            type="radio"
                            id="option2"
                            value="option2"
                            checked={compareValue ==="option3"}
                            onChange={() =>
                                handleRadioChange("option3"
                            )}
                        />
                        <label
                            htmlFor="option3"
                            className = "radioLabel">
                            None
                        </label>
                    </div>                </div>
            </div>
        </div>

        <div className="column">
            <h2>
                Animate
            </h2>
            <button onClick={startAnimation}>
                Start
            </button>
            <button onClick={() => {setAnimate(false)}}>
                Stop
            </button>
            <button onClick={handleClearAnimation}>
                Clear
            </button>
        </div>

      </div>
    </div>
  );
}

export default App;
