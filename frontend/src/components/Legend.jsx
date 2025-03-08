import '../App.css';

function Legend({ compareValue }) {

    return ( 
        
        <div className='center'>
            {compareValue === 'option1' && (
                <div>
                    <h2>Legend</h2>
                    <ul className = 'no-indent'>
                        <li><span className='blue dot'></span>Collected Fish</li>
                        <li><span className='orange dot'></span>At-large Fish</li>
                    </ul>
                </div>
            )}
            {compareValue === 'option2' && (
                <div>
                    <h2>Legend</h2>
                    <ul>
                        <li><span className='blue dot'></span>Coho</li>
                        <li><span className='orange dot'></span>Chinook</li>
                        <li><span className='green dot'></span>Steelhead</li>
                        <li><span className='gray dot'></span>Unknown</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Legend;