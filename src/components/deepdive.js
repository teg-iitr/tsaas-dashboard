import AgeChart from './Charts/agechart';
import GenderChart from './Charts/genderchart';
import TravelMode from './Charts/travelmodechart';
import survey_data from '../survey_data_new.json';
import React from 'react';
import TripDestination from './Charts/tripdestination';
import TripFare from './Charts/trip_fare_chart';
import TripTravelTime from './Charts/trip_travel_time_chart';
import TripDistance from './Charts/trip_distance_chart';
import IncomeChart from './Charts/family_incomechart';
import FamilyChart from './Charts/familychart';
import MontlhlyMemberIncome from './Charts/monthly_member_income_chart';
import Cars from './Charts/Cars';
import Cycles from './Charts/Cycles';
import TwoWheelers from './Charts/Twowheelers';
import EduQual from './Charts/edu_qual_chart';
import DatawhileDriving from './Charts/datawhiledrivingchart';
import MotorcycleChart from './Charts/motorcyclelicensechart';
import CarChart from './Charts/carlicensechart';
function DeepDive(props) {
  // console.log(props);
  //props.datasource
  const chosen=props.chosen;
  return (
    <div className="cards-container">
      <section className="cards">          
        { chosen===3 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TravelMode title="Travel Mode" data={survey_data}  datasource={props.datasource}/>
        </div>}

        {chosen===3 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TripDestination
            title="Trip Destination"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===3 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TripFare
            title="Trip Fare"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===3 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TripDistance
            title="Trip Distance"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===3 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TripTravelTime
            title="Trip Travel Time"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===1 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <FamilyChart title="Family Size" data={survey_data} datasource={props.datasource}/>
        </div>}

        {chosen===1 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <IncomeChart
            title="Monthly Family Income"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <MontlhlyMemberIncome
            title="Monthly Individual Income"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <EduQual
            title="Educational Qualification"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <DatawhileDriving
            title="Use data while Driving"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <MotorcycleChart
            title="Two Wheeler License"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <CarChart
            title="Four Wheeler License"
            data={survey_data}
            datasource={props.datasource}
          />
        </div>}

        {chosen===2 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GenderChart title="Gender Ratio" data= {survey_data} datasource={props.datasource}/>
        </div>}

       {chosen===2 &&  <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AgeChart title="Age Distribution" data={survey_data} datasource={props.datasource}/>
        </div>}

       {chosen===1 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <Cars title="Number of Cars" data={survey_data} datasource={props.datasource}/>
        </div>}

        {chosen===1 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <Cycles title="Number of Cycles" data={survey_data} datasource={props.datasource}/>
        </div>}

        {chosen===1 && <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TwoWheelers title="Number of Two Wheelers" data={survey_data} datasource={props.datasource}/>
        </div>}

      </section>
    </div>
  );
}

export default DeepDive;
