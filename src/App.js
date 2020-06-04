import './App.scss';
import './basic_css.css';
import Home from './components/home';
import survey from './survey_data_new.json';
import dataa from './TopoJsonData';
import React from 'react';
import states_names from './india.json';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {useLocalStorage} from 'react-use';

function App(props) {
  // console.log(props);
  const back=props.back;
  const datasource=props.datasource;
  const surveyFormat=props.surveyFormat;
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
    },
  ];
  
  const [darkMode] = useLocalStorage('darkMode',false);

  React.useEffect(() => {
    if (darkMode) {
      document.querySelector('body').classList.add('dark-mode');
    } else {
      document.querySelector('body').classList.remove('dark-mode');
    }
  }, [darkMode]);
  var countpermanentaddress={};
  countpermanentaddress["India"]=0;
  for(var i=0;i<survey.length;i++)
  {
    if(survey[i].collegeName!==props.datasource && props.datasource!=="All")
    continue;
   for(var j=0;j<survey[i].families.length;j++)
    {
            var st=survey[i].families[j].homeState;
            var dst=survey[i].families[j].nameOfDistrict;
            if(st!=="" || dst!=="")
            {
              countpermanentaddress["India"]++;
              if(!countpermanentaddress.hasOwnProperty(st))
              countpermanentaddress[st]=0;
              countpermanentaddress[st]++;
              if(!countpermanentaddress.hasOwnProperty(dst))
              countpermanentaddress[dst]=0;
              countpermanentaddress[dst]++;
            } 
        }
       
    }
    var state_matrix={};
  for(i=0;i<states_names.objects.india.geometries.length;i++)
  {
    state_matrix[states_names.objects.india.geometries[i].properties.st_nm]={};
    for(j=0;j<states_names.objects.india.geometries.length;j++)
    {
      state_matrix[states_names.objects.india.geometries[i].properties.st_nm][states_names.objects.india.geometries[j].properties.st_nm]=0;
    }
  }
  var count ={};
    var countorigin={};
    count["India"]=0;
    countorigin["India"]=0;
    const total_data=[];
    //counting destination trips
    var classifypoint = require("robust-point-in-polygon");
  for (var ii = 0; ii < survey.length; ii++) {
    // console.log({collegename});
    // console.log(survey[ii].collegeName);
    if(survey[ii].collegeName!==datasource && props.datasource!=="All")
    continue;
    total_data.push(survey[ii]);
      for (var jj = 0; jj < survey[ii].families.length; jj++) {
          for (var kk = 0; kk < survey[ii].families[jj].members.length; kk++) {
              for (var ll = 0; ll < survey[ii].families[jj].members[kk].trips.length; ll++) {
                  for (var mm = 0; mm < survey[ii].families[jj].members[kk].trips[ll].origin_destination.length; mm++) {
  
                      var lattdestination = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].destinationLat;
                      var longgdestination = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].destinationLng;
                      var lattorigin  = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].originLat;
                      var longgorigin = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].originLng;
                      var found1 = true;
                      var found2=true;
                      var origin_state="";
                      var destination_state="";
                      if ((lattorigin === null || longgorigin === null) && (lattdestination===null || longgdestination===null))
                          continue;
                          // var check=15;
                      for (var d =0; d < dataa.length && (found1 || found2) ; d++) {
                          var data = dataa[d];
                          // console.log({data});
                          var longorigin = (longgorigin - data.transform.translate[0]) / data.transform.scale[0];
                          var latorigin = (lattorigin - data.transform.translate[1]) / data.transform.scale[1];
                          var longdestination = (longgdestination - data.transform.translate[0]) / data.transform.scale[0];
                          var latdestination = (lattdestination - data.transform.translate[1]) / data.transform.scale[1];
                          var tarcs = [];
                          for ( i = 0; i < data.arcs.length ; i++) {
                              var temp = [];
                              if(data.arcs[i].length!==0)
                              {
                              var x = data.arcs[i][0][0];
                              var y = data.arcs[i][0][1];
  
                              temp.push([x, y]);
                              }
                              for ( j = 1; j < data.arcs[i].length; j++) {
                                  x += data.arcs[i][j][0];
                                  y += data.arcs[i][j][1];
                                  temp.push([x, y]);
                              }
                              tarcs.push(temp);
                          }
                          for ( i = 0; i < data.objects.geometries.length && (found1 || found2); i++) {
                              var tt = data.objects.geometries[i].arcs;
                              var polygon = [];
                              for ( j = 0; j < tt.length; j++) {
                                  for (var k = 0; k < tt[j].length; k++) {
                                      // console.log(tt[j][k]);
                                       x = tt[j][k];
                                  if(Array.isArray(x))
                                  {
                                      for(var r=0;r<x.length;r++)
                                      {
                                          var xx=x[r];
                                          if (xx >= 0) {
                                              for (var l = 0; l < tarcs[xx].length; l++) {
                                                  polygon.push(tarcs[xx][l]);
                                              }
                                          }
                                          else {
                                              xx= -xx;
                                              xx -= 1;
                                              // console.log({xx});
                                              // console.log(tarcs[xx]);
                                              for ( l = tarcs[xx].length - 1; l >= 0; l--)
                                                  polygon.push(tarcs[xx][l]);
                                          }     
                                      }
                                  }
                                  else
                                  {
  
                                  
                                      if (x >= 0) {
                                          for ( l = 0; l < tarcs[x].length; l++) {
                                              polygon.push(tarcs[x][l]);
                                          }
                                      }
                                      else {
                                          x = -x;
                                          x -= 1;
                                          // console.log({x});
                                          // console.log(tarcs[x]);
                                          for ( l = tarcs[x].length - 1; l >= 0; l--)
                                              polygon.push(tarcs[x][l]);
                                      }
                                  }
                                  }
                              }
                              if (classifypoint(polygon, [longorigin, latorigin]) !== 1) {
                                  found1 = false;
                                  if(data.objects.geometries[i].properties.district===data.objects.geometries[i].properties.st_nm)
                                  {
                                        countorigin["India"]++;
                                        if(!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.district)))
                                        countorigin[data.objects.geometries[i].properties.district]=0;
                                        countorigin[data.objects.geometries[i].properties.district]++;
                                  }
                                  else
                                  {if (!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.district)))
                                      countorigin[data.objects.geometries[i].properties.district] = 0;
                                  countorigin[data.objects.geometries[i].properties.district]++;
                                  if (!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.st_nm)))
                                      countorigin[data.objects.geometries[i].properties.st_nm] = 0;
                                  countorigin[data.objects.geometries[i].properties.st_nm]++;
                                  countorigin["India"]++;}
                                  origin_state=data.objects.geometries[i].properties.st_nm;
                              }
                              if (classifypoint(polygon, [longdestination, latdestination]) !== 1) {
                                found2 = false;
                                if(data.objects.geometries[i].properties.district===data.objects.geometries[i].properties.st_nm)
                                {
                                      count["India"]++;
                                      if(!(count.hasOwnProperty(data.objects.geometries[i].properties.district)))
                                      count[data.objects.geometries[i].properties.district]=0;
                                      count[data.objects.geometries[i].properties.district]++;
                                }
                                else
                                {if (!(count.hasOwnProperty(data.objects.geometries[i].properties.district)))
                                    count[data.objects.geometries[i].properties.district] = 0;
                                count[data.objects.geometries[i].properties.district]++;
                                if (!(count.hasOwnProperty(data.objects.geometries[i].properties.st_nm)))
                                    count[data.objects.geometries[i].properties.st_nm] = 0;
                                count[data.objects.geometries[i].properties.st_nm]++;
                                count["India"]++;}
                                destination_state=data.objects.geometries[i].properties.st_nm;
                            }
                          }
  
                      }
                      if(origin_state!=="" && destination_state!=="")
                      {
                        state_matrix[origin_state][destination_state]++;
                      }
                  }
              }
          }
      }
  
  }
  // console.log({state_matrix});
  var max_val = 0;
//   var total=0;
  Object.keys(count).forEach((value) => {
      if (value) {
          if (count[value] > max_val && value!=="India")
              max_val = count[value];
            //   total+=count[value];
      }
  });
  count["value"] = max_val;
   max_val = 0;
//   var total=0;
  Object.keys(countpermanentaddress).forEach((value) => {
      if (value) {
          if (countpermanentaddress[value] > max_val && value!=="India")
              max_val = countpermanentaddress[value];
            //   total+=count[value];
      }
  });
  countpermanentaddress["value"] = max_val;


  
  // console.log({state_matrix});









//   count["India"]=total;
  
  // counting origin trips
  // var classifypoint = require("robust-point-in-polygon");
//   for ( ii = 0; ii < survey.length; ii++) {
//     // console.log({collegename});
//     // console.log(survey[ii].collegeName);
//     if(survey[ii].collegeName!==collegename)
//     continue;
//       for ( jj = 0; jj < survey[ii].families.length; jj++) {
//           for ( kk = 0; kk < survey[ii].families[jj].members.length; kk++) {
//               for ( ll = 0; ll < survey[ii].families[jj].members[kk].trips.length; ll++) {
//                   for ( mm = 0; mm < survey[ii].families[jj].members[kk].trips[ll].origin_destination.length; mm++) {
  
//                        latt = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].originLat;
//                        longg = survey[ii].families[jj].members[kk].trips[ll].origin_destination[mm].originLng;
//                        found = true;
//                       if (latt === null || longg === null)
//                           continue;
//                           // var check=15;
//                       for ( d =0; d < dataa.length && found ; d++) {
//                           data = dataa[d];
//                           // console.log({data});
//                            long = (longg - data.transform.translate[0]) / data.transform.scale[0];
//                            lat = (latt - data.transform.translate[1]) / data.transform.scale[1];
//                            tarcs = [];
//                           for ( i = 0; i < data.arcs.length ; i++) {
//                                temp = [];
//                               if(data.arcs[i].length!==0)
//                               {
//                                x = data.arcs[i][0][0];
//                                y = data.arcs[i][0][1];
  
//                               temp.push([x, y]);
//                               }
//                               for ( j = 1; j < data.arcs[i].length; j++) {
//                                   x += data.arcs[i][j][0];
//                                   y += data.arcs[i][j][1];
//                                   temp.push([x, y]);
//                               }
//                               tarcs.push(temp);
//                           }
//                           for ( i = 0; i < data.objects.geometries.length && found; i++) {
//                                tt = data.objects.geometries[i].arcs;
//                                polygon = [];
//                               for ( j = 0; j < tt.length; j++) {
//                                   for ( k = 0; k < tt[j].length; k++) {
//                                       // console.log(tt[j][k]);
//                                        x = tt[j][k];
//                                   if(Array.isArray(x))
//                                   {
//                                       for( r=0;r<x.length;r++)
//                                       {
//                                            xx=x[r];
//                                           if (xx >= 0) {
//                                               for ( l = 0; l < tarcs[xx].length; l++) {
//                                                   polygon.push(tarcs[xx][l]);
//                                               }
//                                           }
//                                           else {
//                                               xx= -xx;
//                                               xx -= 1;
//                                               // console.log({xx});
//                                               // console.log(tarcs[xx]);
//                                               for ( l = tarcs[xx].length - 1; l >= 0; l--)
//                                                   polygon.push(tarcs[xx][l]);
//                                           }     
//                                       }
//                                   }
//                                   else
//                                   {
  
                                  
//                                       if (x >= 0) {
//                                           for ( l = 0; l < tarcs[x].length; l++) {
//                                               polygon.push(tarcs[x][l]);
//                                           }
//                                       }
//                                       else {
//                                           x = -x;
//                                           x -= 1;
//                                           // console.log({x});
//                                           // console.log(tarcs[x]);
//                                           for ( l = tarcs[x].length - 1; l >= 0; l--)
//                                               polygon.push(tarcs[x][l]);
//                                       }
//                                   }
//                                   }
//                               }
//                               if (classifypoint(polygon, [long, lat]) !== 1) {
//                                   found = false;
//                                   if(data.objects.geometries[i].properties.district===data.objects.geometries[i].properties.st_nm)
//                                   {
//                                         countorigin["India"]++;
//                                         if(!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.district)))
//                                         countorigin[data.objects.geometries[i].properties.district]=0;
//                                         countorigin[data.objects.geometries[i].properties.district]++;
//                                   }
//                                   else
//                                   {if (!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.district)))
//                                       countorigin[data.objects.geometries[i].properties.district] = 0;
//                                   countorigin[data.objects.geometries[i].properties.district]++;
//                                   if (!(countorigin.hasOwnProperty(data.objects.geometries[i].properties.st_nm)))
//                                       countorigin[data.objects.geometries[i].properties.st_nm] = 0;
//                                   countorigin[data.objects.geometries[i].properties.st_nm]++;
//                                   countorigin["India"]++;}
//                               }
//                           }
  
//                       }
  
//                   }
//               }
//           }
//       }
  
//   }
  
   max_val = 0;
//    total=0;
  Object.keys(countorigin).forEach((value) => {
      if (value) {
          if (countorigin[value] > max_val && value!=="India")
              max_val = countorigin[value];
            //   total+=countorigin[value];
      }
  });
  countorigin["value"] = max_val;

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Router>
        
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              
              <Switch location={location} >
                {pages.map((page, index) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      render={(props) => <page.view datasource={datasource} 
                      surveyFormat={surveyFormat} 
                       back={back} 
                       count={count} 
                       countorigin={countorigin} 
                       total_data={total_data}
                       countpermanentaddress={countpermanentaddress}
                       state_matrix={state_matrix}
                       />}
                      // component={page.view}
                       key={index}
                    />
                  );
                })}
                <Redirect to="/" />
              </Switch>
            </div>
          )}
        />
      </Router> 
    
    </div>
  );
}

export default App;
