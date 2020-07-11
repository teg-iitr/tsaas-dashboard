
export var mainMode = (mode_types_subArray) =>{
   
    var modes={};
      for(let i=0;i<mode_types_subArray.length;i++)
      {
        if(!modes.hasOwnProperty(mode_types_subArray[i]))
        modes[mode_types_subArray[i]]=0;
        modes[mode_types_subArray[i]]++;
      }
    
      var main_mode="";
      if(modes.hasOwnProperty('Train') || modes.hasOwnProperty('Metro') || modes.hasOwnProperty('Bus'))
      main_mode="Public Transport";
      else 
      {
       
        Object.keys(modes).forEach((value) => {
            // console.log(value);
            if(main_mode==="")
            main_mode=value;
            else if(value!=="")
            main_mode=main_mode+'_'+value;
        }); 
      }

  return main_mode;
};


