import React, { useState } from 'react';
import Dropdowns from './dropdowns';
import './basic_css.css';
import './App.scss';
import {InputLabel} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import list from './registeredPersons';
import firebase from 'firebase';
import  './Buttons.css';

const firebaseConfig = {    
      apiKey: process.env.REACT_APP_PLACES_apiKey,
    authDomain: process.env.REACT_APP_PLACES_authDomain,
    databaseURL: process.env.REACT_APP_PLACES_databaseURL,
    projectId: process.env.REACT_APP_PLACES_projectId,
    storageBucket: process.env.REACT_APP_PLACES_storageBucket,
    messagingSenderId: process.env.REACT_APP_PLACES_messagingSenderId,
    appId: process.env.REACT_APP_PLACES_appId,
    measurementId: process.env.REACT_APP_PLACES_measurementId
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 

function Auth(){

    const [ok,setOk]= useState(false);
    var [number,setNumber]=useState('');
    var [prefix,setPrefix]=useState('+91');
    var [user,setUser]=useState('');
 
    const buttonClasses = [
      'StartSurveyButton',
      'StartSurveyButtonBorder'
    ];  
    // console.log(buttonClasses);
    function login(){
      
      number=prefix+number;
      if(!(list.hasOwnProperty(number)))
      {
        alert('Mobile number not registered. Please contact the Admin at amitfce@iitr.ac.in.');
        window.location.reload(false);
      }
      // console.log(list);
    
      // user=;
      // console.log({user});
        let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha');

        firebase.auth().signInWithPhoneNumber(number,recaptcha).then(function(e){
            let code=prompt('Please enter the OTP','');
            // if(code== null)
            // return;
            e.confirm(code).then(function(result){ 
                // console.log(result.user,'user');
                alert('OTP Validation Successful. Click OK to go to Dashboard.')
                setOk(true);
              setUser(list[number].name);
                // ok=true;
            }).catch((error)=>{
                console.log(error);
                alert('OTP Validation Failed.');
                window.location.reload(false);
            })
        }).catch(function(error){
            console.log(error);
            alert('SMS failed. Please try again later.');
            window.location.reload(false);
        });
    }
    return (
        <div>
            {ok && <Dropdowns user={user}/>}
            

{ !ok  && <div className="App">
          
      <header className="App-header">
        <h1>Authentication Required</h1>
        <form>
         {/* <label htmlFor="mobile_number">Enter Mobile Number   </label> */}
         <InputLabel id="mobile_number">Enter Mobile Number</InputLabel>
         {/* <input
        //  defaultValue="+91"
           type="string"
           name="prefix"
           value={prefix}
           maxLength="3" //TODO this might not be valid for many ISD codes. Amit May'20
           size="1"
           onChange={(e)=>{setPrefix(e.target.value)}}
         /> */}
            <TextField
            
              id="outlined-required"
              label="Country code"
              margin="normal"
              variant="outlined"
              style = {{width: 120}}
              value={prefix}
              onChange={(e)=>{setPrefix(e.target.value)}}
            />
          {"  "}
         {/* <input
           type="string"
           name="Number"
           value={number}
           maxLength="10" // TODO this might not be valid for mobile number in many other countries. Amit May'20
           size="10"
           onChange={(e)=>{setNumber(e.target.value)}}
         /> */}
         <TextField
              required
              id="outlined-required"
              label="10 digit Mobile Number"
              margin="normal"
              variant="outlined"
              value={number}
              onChange={(e)=>{setNumber(e.target.value)}}
            />
       </form>
      
       {/* <Button 
      style={{
        fontSize: "16px",
        padding: "3px",
        borderRadius: "0px",
        backgroundColor: "#449DD1",
      }}
      color="primary"
      variant="contained"
      component="span"
       onClick={login}>
        {"Get OTP"}
      </Button> */}
      <div className='StartSurveyButtonContainer'>
              <button
                className={buttonClasses.join(" ")}
                style={{
                  fontWeight: "600",
                  fontSize: "18px",
                  textTransform: "none"
                }}
                onClick={login}
              >
                Get OTP
              </button>
            </div>
            <br></br>
            
            <div id="recaptcha"></div>
            
            
      </header>

      
    </div>}

        </div>
    );
}  

export default Auth;