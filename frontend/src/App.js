import React, { useState} from 'react';
import LeafletMap from './components/LeafletMap';
import './App.css';
// import Legend from './components/Legend';

function App() {
  const [compareValue, setCompareValue] = useState("option1");
  const [animate, setAnimate] = useState(false);
  const [clearAnimation, setClearAnimation] = useState(false);
  const [showPoints, setShowPoints] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  
  const handleRadioChange = (value) => {setCompareValue(value);};

  const startAnimation = () => {
    // Whenever we start an animation, also set the clearAnimation variable to false so we can clear it later.
    setClearAnimation(false);
    setAnimate(true);
  };

  const handleClearAnimation = () => {
    // When we click the clear button, also stop the animation.
    setClearAnimation(true);
    setAnimate(false);
  };

  const handleShowPoints = () => {setShowPoints(!showPoints);};

  const handleSelectSpecies = (event) => {
    const options = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedSpecies(options);
  };

  const handleSelectGroups = (event) => {
    const options = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedGroups(options);
  };

  return (
    <div className="app-container">
      <h1>Fish Tracker</h1>
      
      <div className="column-container"> 
        <LeafletMap compareValue={compareValue} showPoints={showPoints} animate={animate} clearAnimation={clearAnimation} groups={selectedGroups} species={selectedSpecies}/>

        <div className = "column">
            {/* <div className = "card auto-height"> <Legend compareValue={compareValue} groups={selectedGroups} species={selectedSpecies}/></div> */}

            <div className="card auto-height">
                <h2>Select Species</h2>
                <select multiple={true} value={selectedSpecies} onChange={handleSelectSpecies}>
                    <option value="Coho">Coho</option>
                    <option value="Chinook">Chinook</option>
                    <option value="Steelhead">Steelhead</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>

            <div className="card">
                <h2>Select Groups</h2>
                <select multiple={true} value={selectedGroups} onChange={handleSelectGroups}>
                    <option value="collected">Collected</option>
                    <option value="atlarge">At large</option>
                </select>
            </div>
            
        </div>
      </div>
      
      <div className="column-container">
        <div className="card">
            <div className="container">
                <div className="radioGroup">
                    <div className="radioButton">
                      <h2>Contrast</h2>
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
                            id="option3"
                            value="option3"
                            checked={compareValue ==="option3"}
                            onChange={() =>
                                handleRadioChange("option3"
                            )}
                        />
                        <label
                            htmlFor="option3"
                            className = "radioLabel">
                            Species and Group
                        </label>
                    </div>                     
                     <div className="radioButton">
                        <input
                            type="radio"
                            id="option4"
                            value="option4"
                            checked={compareValue ==="option4"}
                            onChange={() =>
                                handleRadioChange("option4"
                            )}
                        />
                        <label
                            htmlFor="option4"
                            className = "radioLabel">
                            None
                        </label>
                    </div>                
                </div>
            </div>
        </div>

        <div className="card">
            <div className="container">
                <h2>Show Positions</h2>
                <div className="center">
                    <input 
                        onClick={handleShowPoints} type="checkbox" 
                        id="switch" 
                        checked={showPoints}
                        onChange={handleShowPoints}
                    />
                    <label className="toggle-label" htmlFor="switch">Toggle</label>
                </div>
            </div>
        </div>

        <div className="card">
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
