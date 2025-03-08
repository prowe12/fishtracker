import React, { useState} from 'react';
import LeafletMap from './components/LeafletMap';
import Legend from './components/Legend';
import './App.css';

function App() {
  const [
      compareValue,
      setCompareValue,
  ] = useState("option1");

  const handleRadioChange = (
      value
  ) => {
      setCompareValue(value);
  };

  return (
    <div className="app-container">
      <h1>Fish Tracker</h1>
      
      <div className="map-container"> 
        <LeafletMap compareValue={compareValue}/>
      </div>
      

      <div className="grid-container">
        <div className="center">
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

        <Legend compareValue={compareValue}/>

      </div>
    </div>
  );
}

export default App;
