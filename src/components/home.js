
import MapExplorerOrigin from './mapOrigin';
import MapExplorerDestination from './mapdestination';
import MapExplorerPermanentAddress from './map_permanentaddress';
import DeepDive from './deepdive';
import {MenuItem,InputLabel,Select} from '@material-ui/core'
import {MAP_META} from '../constants';
import {useState} from 'react';
import React from 'react';
// import React from 'react';
// import classes from '../Buttons.css';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import age from './Charts/age_bracket';
import familyIncome from './Charts/income_bracket';
import monthlyIncome from './Charts/monthly_income_bracket'
import fare from './Charts/trip_fare_options';
import travelDistance from './Charts/trip_distance_options';
import travelTime from './Charts/trip_travel_time_options';
import  '../Buttons.css';
import {
  // aggregatorTemplates,
  // aggregators,
  // derivers,
  // locales,
  // naturalSort,
  // numberFormat,
  // getSort,
  sortAs,
  // PivotData,
} from 'react-pivottable/Utilities';
function Home(props) { 

  // console.log(props);
  const [chosen,setChosen]=useState(0);
  const [analyze,setAnalyze]=useState(0);
  const datasource=props.datasource;
  const surveyFormat=props.surveyFormat;
  const PlotlyRenderers = createPlotlyRenderers(Plot);
    // console.log("called");
 const [state,setState]=useState({sorters: {
  "age": sortAs(Object.keys(age)),
    "familyIncome": sortAs(Object.keys(familyIncome)),
    "monthlyIncome": sortAs(Object.keys(monthlyIncome)),
    "fare": sortAs(Object.keys(fare)),
    "travelDistance": sortAs(Object.keys(travelDistance)),
    "travelTime":sortAs(Object.keys(travelTime))  
  }});
  const buttonClasses = [ 
    'StartSurveyButton',
    'StartSurveyButtonBorder'
  ];  
  // setState({
  //   sorters:{
  //       "age": sortAs(["<4","4-18","18-25","25-40", "40-60",
  //               ">60"])
  //   }
  // });
//   countorigin["India"]=total;
    const count=props.count;
    const countorigin=props.countorigin;
    const countpermanentaddress=props.countpermanentaddress;
    const total_data=props.total_data;
  
  // const surveyFormat=props.surveyFormat;
  
  function download_data(){
    let filename = "data.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(total_data)))], { type: contentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(total_data));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  var jsontocsv_array=[];
  // jsontocsv_array.push({display:"Display Value",count:"Count Value"});
  // state_name_object={};
  // jsontocsv_array.push({state_name:"State Matrix",state_details:state_name_object});
  Object.keys(props.state_matrix).forEach((value) => {
      jsontocsv_array.push(
        {
          state_name:value,
          state_details: props.state_matrix[value]
        }
      );
  });

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    // console.log({array});
    var str = '';
    str='OD Matrix for States ,';
    Object.keys(props.state_matrix).forEach((value)=>{
      str+=value;
      str+=',';
    });
    str+='\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (var index in array[i]) {
            if (line !== '') line += ','
            if( typeof array[i][index]!=='object')
            line += array[i][index];
            else
            {
              // Object.keys(array[i][index]).forEach((value)=>{
                for(let ind=0;ind<Object.keys(array[i][index]).length;ind++){
                  let value=Object.keys(array[i][index])[ind];
                line+=array[i][index][value];
                if(line!=='')line+=',';}
              // });
            }
        }

        str += line + '\r\n';
    }

    return str;
    }
    function download_state_matrix(){
      var jsonObject = JSON.stringify(jsontocsv_array);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = 'state_OD_matrix.csv';

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
    function change_analyze(){
      var x=analyze;
      x+=1;
      x%=2;
      setAnalyze(x);
    }
  
    var data=[];
    var headers=[];
    // headers.push('collegeName');
    var fam=total_data[0]['families'][0];
    Object.keys(fam).forEach((key)=>{
      if(
        key!=='familyID' &&
      key!=='members' &&
      key!=='lat' && key!=='lng' && key!=='landmark')
      headers.push(key);
    });
    var mem=fam['members'][0];
    Object.keys(mem).forEach((key)=>{
      if(key!=='trips' && key!=='created_at' && key!=='memberID')
      headers.push(key);
    });
  var  trip_list = [ 'originPlace', 
              'destinationPlace',  'fare', 'travelDistance',
             'travelTime', 'mode1', 'mode2', 'mode3', 'mode4', 'mode5', 'mode6'];
             for(var i=0;i<trip_list.length;i++)
             headers.push(trip_list[i]);
             data.push(headers);
    var x=0;
             for(i=0;i<total_data.length;i++)
      {
          var array=[];
          // array.push(total_data[i]['collegeName']);
          // console.log({array});
          for(var j=0;j<total_data[i]['families'].length;j++)
          { 
            var array_f=[];
            for(x=0;x<array.length;x++)
            array_f.push(array[i]);
            // var array_f=array;
            // console.log({array_f});
             fam=total_data[i]['families'][j];
            //  console.log(fam);
            // Object.keys(fam).forEach((key)=>{
              for(let ind=0;ind<Object.keys(fam).length;ind++)
              {
                let key=Object.keys(fam)[ind];
              if(key!=='familyID' && key!=='members' && key!=='lat' && key!=='lng' && key!=='landmark')
              {
                array_f.push(fam[key]);
              }
              else if(key==='members')
              {
                if(fam[key].length===0)
                {
                  data.push(array_f);
                }
                else
                {
                  for(var k=0;k<fam[key].length;k++)
                  {
                     mem=fam[key][k];
                    var array_m=[];
                    for(x=0;x<array_f.length;x++)
                    array_m.push(array_f[x]);
                    // Object.keys(mem).forEach((mem_key)=>{
                      for(let ind=0;ind<Object.keys(mem).length;ind++)
                      {
                        let mem_key=Object.keys(mem)[ind];
                      if(mem_key!=='trips' && mem_key!=='created_at' && mem_key!=='memberID')
                      {
                        array_m.push(mem[mem_key]);
                      }
                      else if(mem_key==='trips')
                      {
                        if(mem[mem_key].length===0)
                        {
                          data.push(array_m);
                        }
                        else
                        {
                          for(var l=0;l<mem[mem_key].length;l++)
                          {
                            var trip=mem[mem_key][l];
                            var array_t=[];
                            for(x=0;x<array_m.length;x++)
                            array_t.push(array_m[x]);
                            // array_t.push(trip['tripID']);
                            if(trip['origin_destination'].length===0)
                            {
                              data.push(array_t);
                            }
                            else
                            {
                                var od_k=trip['origin_destination'][0];
                                // Object.key/s(od_k).forEach((od_k_keys)=>{
                                  for(let ind=0;ind<Object.keys(od_k).length;ind++)
                                  {
                                    let od_k_keys=Object.keys(od_k)[ind];
                                  if(od_k_keys!=='originDestinationID' && od_k_keys!=='originLandmark' && od_k_keys!=='originLat' && od_k_keys!=='originLng' && od_k_keys!=='destinationLandmark' && od_k_keys!=='destinationLat' && od_k_keys!=='destinationLng')
                                  array_t.push(od_k[od_k_keys]);
                                }
                                for(var m=0;m<trip['mode_types'].length;m++)
                                {
                                  array_t.push(trip['mode_types'][m]['modeName']);
                                }
                                data.push(array_t);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
      }
      // console.log({data});
  return (
    <React.Fragment>
      <div>
        <br/>
        <h1>Survey Format : {surveyFormat}  <br/>  Data Source : {datasource}
        <br></br>
        <div className='StartSurveyButtonContainer'>
          <button 
            className={buttonClasses.join(" ")}
            style={{
              fontWeight: "600",
              fontSize: "18px",
              textTransform: "none"
            }}
            onClick={download_data} 
            >
            
              Download the Whole Dataset (json format)
            
              </button>
          </div>

        {/* <br></br> */}
        
        <div className='StartSurveyButtonContainer'>
        { <button className={buttonClasses.join(" ")}
            style={{
              fontWeight: "600",
              fontSize: "18px",
              textTransform: "none"
            }} 
            onClick={change_analyze}>
            
              Create Own Tables/ Plots
          
              </button>}
      </div>
      { analyze===1 && <div className='back_button'>
        <PivotTableUI
                data={data}
                onChange={s => setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...state}
            />
        </div>}
          <br></br>
        {/* <label id="selectcatogery">Please Select a Category</label> */}
        <InputLabel id="selectcategory">Please select a Category for default Charts</InputLabel>
        <Select  onChange={(e,newIndex)=>{setChosen(newIndex.key-0)}}
        
        > 
          
           
          
              {/* <MenuItem   key='0' value={"Default"}>
                {"None"}
              </MenuItem> */}
              <MenuItem   key='1' value={"Family"}>
                {"Family"}
              </MenuItem>
              <MenuItem   key='2' value={"Member"}>
                {"Member"}
              </MenuItem>
              <MenuItem   key='3' value={"Trips"}>
                {"Trips"}
              </MenuItem>
            
          
            </Select>
      <br></br>
        <div className='StartSurveyButtonContainer'>
           {chosen===3 && <button 
            className={buttonClasses.join(" ")}
            style={{
              fontWeight: "600",
              fontSize: "18px",
              textTransform: "none"
            }} 
            onClick={download_state_matrix}
            >Download State wise OD Matrix</button>}
          </div>

        </h1>
        
      </div>
      <div >
        
        </div>
       <div className="Home">
         {
           chosen===1 && <MapExplorerPermanentAddress
           mapMeta={MAP_META.India}
                count={countpermanentaddress}
                isCountryLoaded={true}
                datasource={datasource}
                
              />}
         
       </div>
          
         
        <div className="Home">
              <div className="home-left">
           {chosen===3 && <MapExplorerOrigin
                mapMeta={MAP_META.India}
                count={countorigin}
                isCountryLoaded={true}
                datasource={datasource}
                
              />}
        </div>
            
            <div className="home-right">              
           { chosen===3 && <MapExplorerDestination
                mapMeta={MAP_META.India}
                count={count}
                isCountryLoaded={true}
                datasource={datasource}
                
              />}
            </div>

            {  
              <DeepDive datasource={datasource} chosen={chosen}/>
            }

      </div>
      <br></br>
      {/* <div className="App"> */}
          {/* <header className="App-header"> */}
      <div className='StartSurveyButtonContainer'>
          <button 
            className={buttonClasses.join(" ")}
            style={{
              fontWeight: "600",
              fontSize: "18px",
              textTransform: "none"
            }} 
            onClick={ props.back}
            >Back</button>
           
          </div>
            {/* <br></br> */}
          {/* </header> */}
          {/* </div> */}
      
    </React.Fragment>

  );
}

export default React.memo(Home);
