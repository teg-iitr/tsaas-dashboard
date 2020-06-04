import ChoroplethMap from './choroplethdestination';
// import count from '../state_district_count';
import {MAP_TYPES ,MAP_META} from '../constants';

import React, {useState ,useCallback} from 'react';
// import { useEffectOnce } from 'react-use';

function MapExplorer({
  mapMeta,
  count,
  isCountryLoaded,
}) {
 
  var jsontocsv_array=[];
  jsontocsv_array.push({display:"State or District",count:"Count of Trips Destination"});
  
  Object.keys(count).forEach((value) => {
    if(value!=='value')
      {jsontocsv_array.push(
        {
            display:value,
            count:count[value]
        }
      );}
  });

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
    }
    function download_data(){
      var jsonObject = JSON.stringify(jsontocsv_array);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = 'chart_data.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    }
  const [selectedRegion, setSelectedRegion] = useState({});
 
 
  const [currentHoveredRegion, setCurrentHoveredRegion] = useState({name : "India"} );

  const [currentMap, setCurrentMap] = useState(mapMeta);


  const setHoveredRegion = useCallback(
    (name, currentMap) => {
     
        var x={};
        x.name=name;
        setCurrentHoveredRegion(x);
              
    },
    []
  );



  const switchMapToState = useCallback(
    (name) => {
      const newMap = MAP_META[name];
      if (!newMap) {
        return;
      }
      setCurrentMap(newMap);
      setSelectedRegion(null);

    },
    []
  );

  return (
    <div
      className={`MapExplorer fadeInUp ${
         'stickied'
      }`}
      style={{
        animationDelay: '1.5s',
        display:  '',
      }}
    >

      <div className="header">
      {/* <h1>Trip Details</h1> */}
        <h2>{currentMap.name} Map (Trip destination)
        <button className="button back-button" onClick={download_data}>data</button></h2>
        <h6>
          {window.innerWidth <= 769 ? 'Tap' : 'Hover'} over {' '}
           for details of number of Trips.
        </h6>
      </div>


      <div className="meta fadeInUp" style={{animationDelay: '2.4s'}}>
        <h2 className={`${ 'active'}`}>
          {currentHoveredRegion.name}
        </h2>


        {/* {currentMap.mapType === MAP_TYPES.STATE && */}
        {/* currentHoveredRegion.name !== currentMap.name ? ( */}
          <h1
            className={`district ${ 'active'}`}
          >

            {count.hasOwnProperty(currentHoveredRegion.name)?count[currentHoveredRegion.name]:'0'}

            <br />
            <span style={{fontSize: '0.75rem', fontWeight: 600}}>
              Trips
            </span>
          </h1>
        {/* ) : null} */}


        {currentMap.mapType === MAP_TYPES.STATE ? (
          <div
            className="button back-button"
            onClick={() => switchMapToState('India')}
          >
            Back
          </div>
        ) : null}


      </div>
        
      {
        <ChoroplethMap
        
          mapMeta={currentMap}
          
          setHoveredRegion={setHoveredRegion}
          changeMap={switchMapToState}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isCountryLoaded={isCountryLoaded}
          count={count}
        />
      }
    </div>
  );
}

export default React.memo(MapExplorer);
