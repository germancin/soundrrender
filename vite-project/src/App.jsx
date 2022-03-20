import { useState } from 'react'
import logo from './logo.svg'
import { updateVolumeThreshold,updateTolerance } from './actions';
import './App.css'
const myStorage = window.localStorage;

function App() {
  const [ count,setCount ] = useState( 0 );
  const [ volume,setVolume ] = useState( 1 )
  const [ volumeThresholdValue,setVolumeThresholdValue ] = useState( 0 )
  const [ tolerance,setTolerance ] = useState( 0 )

  if ( myStorage.getItem( 'volumeThreshold' ) ) {
    const val = myStorage.getItem( 'volumeThreshold' );
    myStorage.setItem( 'volumeThreshold',val );
    volumeThresholdValue === 0 && setVolumeThresholdValue( val );
  }

  if ( myStorage.getItem( 'tolerance' ) ) {
    const val = myStorage.getItem( 'tolerance' );
    myStorage.setItem( 'tolerance',val );
    tolerance === 0 && setTolerance( val );
  }

  const handleThreshold = ( e,action = null ) => {
    let total = 0;
    if ( action === 'add' ) total = parseInt( e.target.value ) + 1;
    if ( action === 'subs' ) total = parseInt( e.target.value ) - 1;

    setVolumeThresholdValue( total );
    updateVolumeThreshold( total );

    const valTot = myStorage.getItem( 'tolerance' ) || 20;
    valTot && setTolerance( valTot );
    valTot && updateTolerance( valTot );
  }

  const handleTolerance = ( e,action = null ) => {
    let total = 0;
    if ( action === 'add' ) total = parseInt( e.target.value ) + 1;
    if ( action === 'subs' ) total = parseInt( e.target.value ) - 1;

    setTolerance( total );
    updateTolerance( total );

    const valTotal = myStorage.getItem( 'volumeThreshold' ) || 2000;
    valTotal && setVolumeThresholdValue( valTotal );
    valTotal && updateVolumeThreshold( valTotal );
  }

  return (
    <div className="App">
      <div className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>
        </p>
        <div>

          <div>
            VOLUME THRESHOLD: { volumeThresholdValue }
          </div>

          <div container direction={ 'row' } justifyContent={ 'center' } className={ 'btn-container' }>

            <input
              type="range"
              min={ 0 }
              max={ 1 }
              step={ 0.02 }
              value={ volume }
              onChange={ event => {
                setVolume( event.target.valueAsNumber )
              } }
            />

            <button variant="text" value={ volumeThresholdValue } onClick={ ( event ) => handleThreshold( event,'subs' ) }>
              -
            </button>
            <button variant="text" value={ volumeThresholdValue } onClick={ ( event ) => handleThreshold( event,'add' ) }>
              +
            </button>
          </div>




          <div className='section'>
            TOLERANCE:   { tolerance }
          </div>

          <div container direction={ 'row' } justifyContent={ 'center' } className={ 'btn-container' }>

            <button variant="text" value={ tolerance } onClick={ ( event ) => handleTolerance( event,'subs' ) }>
              -
            </button>
            <button variant="text" value={ tolerance } onClick={ ( event ) => handleTolerance( event,'add' ) }>
              +
            </button>
          </div>



        </div>
      </div>
    </div>
  )
}

export default App
