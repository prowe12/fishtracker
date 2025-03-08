import React, { useState} from 'react';
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

  return (
    <div className="app-container">
      <h1>Fish Tracker</h1>
      
      <div className="column-container"> 
        <LeafletMap compareValue={compareValue} animate={animate} />
        <div className = "column">
            <Legend compareValue={compareValue}/>
        </div>
      </div>
      
      <div className="column-container">
        <div className="column">
            <div className="container">
                <div className="radioGroup">
                    <div className="radioButton">
                      <h2>Choose groups to compare</h2>
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
                            Compare collected to at-large fish
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
                            Compare fish species
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div className="column">
            <h2>
                Animate
            </h2>
            <button onClick={() => setAnimate(true)}>
                Start
            </button>
            <button onClick={() => setAnimate(false)}>
                Stop
            </button>
            <button onClick={() => setClearAnimation(true)}>
                Clear
            </button>
        </div>

      </div>
    </div>
  );
}

export default App;
