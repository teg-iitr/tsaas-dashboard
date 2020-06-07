import React, { useState, useCallback } from 'react';
import './basic_css.css';
import './App.scss';
import axios from 'axios';
import App from './App';
import {useLocalStorage} from 'react-use';
import {useEffectOnce} from 'react-use';
import {Select, MenuItem, InputLabel,} from "@material-ui/core";
import survey_data from './survey_data_new.json';
import  './Buttons.css';
// import Loading from './loading';
function Dropdowns(props) {

    // require('dotenv').config({path: path.resolve('../.env')});
  
    // console.log(process.env);
    
  const [data1,setData1]=useState([]);
  const [data2,setData2]=useState([]);
  const [isok,setOk]=useState(false);
  const [surveyId,setSurveyId]=useState(-1);
  const [datasource,setDatasource]=useState('');
  const [surveyFormat,setSurveyFormat]=useState('');
  var user=props.user;
  const buttonClasses = [ 
    'StartSurveyButton',
    'StartSurveyButtonBorder'
  ];  
  // console.log(process.env);
  useEffectOnce(()=>{
    axios.get(process.env.REACT_APP_PLACES_Survey_Format).then((response)=>{
    setData1(response.data);
  }).catch((err)=>{
    console.log(err); 
  });
  axios.get(process.env.REACT_APP_PLACES_Data_Source).then((response)=>{
    setData2(response.data);
  }).catch((err)=>{
    console.log(err);
  });
  });

  const [darkMode,setDarkMode] = useLocalStorage('darkMode',false);

    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }

    
 var label1=[];
//  label1.push({surveyFormat:"Please select a survey format", surveyTypeID:0})
 for(var i=0;i<data1.length;i++)
 {
   
   label1.push(data1[i]);
 }
  var label2=[];
  // label2.push({collegeName:"Please select college",collegeID:0});
  // for( i=0;i<data2.length;i++)
  // {
  //   if(surveyId===data2[i].surveyTypeID)
  //   label2.push(data2[i]);
  // }
    for(i=0;i<survey_data.length;i++)
    {
      label2.push({dataSource:survey_data[i].collegeName, datasourceID:(i+1)})
    }
    label2.push({dataSource:"All", datasourceID:(i+1)});
  const back = useCallback(
      ()=>{
        setOk(false);
        setSurveyId(-1);
        setDatasource('');
        setSurveyFormat('');
        setDarkMode(false);
        // console.log("called");
      },
      [setDarkMode]
  );
     
  function signout(){
    window.location.reload(false);
  }
  function getData() { 
    if(datasource==='' || datasource==='Please select database' || surveyId===-1)
    alert('Please select all fields');
    else
    setOk(true);
  }

  return (
  
      <div>
          {isok && <App
          datasource={datasource}
          back={back}
          surveyFormat={surveyFormat}
          
          />}
      
        { !isok  && <div className="App">
      
      <header className="App-header">
      <h1>Hi!  {user}</h1>
        <div className='Pois'>
        <InputLabel id="selectSurveyFormat">Please select a Survey Format</InputLabel>
        <Select  onChange={(e,newIndex)=>{setSurveyId(label1[newIndex.key-1].surveyTypeID || '');
        setSurveyFormat(label1[newIndex.key-1].surveyFormat || '');}}
        value={surveyFormat || ''}
        >
          {
           
            label1.map(val=>(
              <MenuItem   key={val.surveyTypeID || ''} value={val.surveyFormat || ''}>
                {val.surveyFormat || ''}
              </MenuItem>
            ))
            
          }
            </Select>
            </div>
        {/* <  div/> */}
          <br/>
          <div className='Pois'>
          <InputLabel id="selectdb">Please select a Database</InputLabel>
        <Select  onChange={(e)=>{setDatasource(e.target.value)}} value={datasource || ''}>
          {
            label2.map(val=>(
              <MenuItem  key={val.datasourceID} value={val.dataSource}>
                {val.dataSource}
              </MenuItem>
              
            ))
            
          }
        </Select>
        </div>
      <br/>
      {/* <Button 
      style={{
        fontSize: "12px",
        padding: "3px",
        borderRadius: "0px",
        backgroundColor: "#449DD1",
      }}
      color="primary"
      variant="contained"
      component="span"
       onClick={getData}>
        {"Fetch and Go to Dashboard!"}
      </Button> */}
      <div className='StartSurveyButtonContainer'>
              <button
                className={buttonClasses.join(" ")}
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  textTransform: "none"
                }}
                onClick={getData}
              >
                Fetch and Go to Dashboard!
              </button>
            </div>
      
      {/* <Button 
      style={{
        fontSize: "12px",
        padding: "3px",
        borderRadius: "0px",
        backgroundColor: "#449DD1",
      }}
      color="primary"
      variant="contained"
      component="span"
       onClick={signout}>
        {"Sign Out"}
      </Button> */}
      <div className='StartSurveyButtonContainer'>
              <button
                className={buttonClasses.join(" ")}
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  textTransform: "none"
                }}
                onClick={signout}
              >
                Sign Out
              </button>
            </div>
      </header>

      
    </div>}
    </div>
  );
}

export default Dropdowns;
