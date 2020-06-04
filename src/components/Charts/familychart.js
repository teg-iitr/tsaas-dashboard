import {defaultOptions,xAxisDefaults, formatNumber} from './chart-defaults';
import deepmerge from 'deepmerge';
import React from 'react';
import {Doughnut,Bar} from 'react-chartjs-2';
import {useState} from 'react';
// import html2canvas from "html2canvas";
const pdfConverter = require("jspdf");
function FamilyChart(props) {
  const[chart_type,setChart_type]=useState(0);
  if (!props.data || props.data.length === 0) {
    return <div></div>;
  }

  
  const options = {};
 
  function change_chart(){
    var x=chart_type;
    x+=1;
    x%=2;
    setChart_type(x);
  }
  var survey = props.data;
  for(var i=0;i<survey.length;i++)
  {
    if(survey[i].collegeName!==props.datasource && props.datasource!=="All")
    continue;
   for(var j=0;j<survey[i].families.length;j++)
    {
            var x=survey[i].families[j].members.length;
            x=x+'';
            //   if(x!=='0')
            // { 
              if(!options.hasOwnProperty(x))
            options[x]=0;
            options[x]++;
            // }
           
        }
       
    }
      
    



  const data = [];
  const labels = [];

  Object.keys(options).forEach((value) => {
    if (value) {
      labels.push(value+' Member Family');
      data.push(options[value]);
    }
  });

  const chartData = {
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#ff8a66',
          '#718af0',
          '#7dd6fa',
          '#59b3aa',
          '#9bc26b',
          '#e5d22f',
          '#ffb041',
          '#db6b8f',
          '#bd66cc',
          '#8e8e8e',
        ],
      },
    ],
    labels: labels,
  };
  const chartOptions = deepmerge(defaultOptions, {
    tooltips: {
      mode: 'point',
      position: 'nearest',
      callbacks: {
        label: function (tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return formatNumber(currentValue) + ' (' + percentage + '%)';
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  });
  const chartData1 = {
    labels: labels,
    datasets: [
      {
        data: data,
        label: 'Mode',
        backgroundColor: '#7CC781'
      },
      
    ],
  };

  const chartOptions1 = deepmerge(defaultOptions, {
    legend: {
      display: true,
    },
    scales: {
      xAxes: [
        deepmerge(xAxisDefaults, {
          stacked: true,
        }),
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
    },
  });

  const sampleSize = data.reduce((a, b) => a + b, 0);
  var jsontocsv_array=[];
  jsontocsv_array.push({display:"Number of members in families",count:"Families Count"});
  
  Object.keys(options).forEach((value) => {
      jsontocsv_array.push(
        {
            display:value,
            count:options[value]
        }
      );
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
    var chartref={};
    function donwload_pdf() {     
  var base64=chartref.chartInstance.toBase64Image();
  const imgData = base64;
const pdf = new pdfConverter("l", "pt");
pdf.addImage(imgData, "PNG",100, 80,543,380 );
pdf.save("chart_image.pdf");  
    }
function download_png() {
  var base64=chartref.chartInstance.toBase64Image(); 
  var a = document.createElement("a"); //Create <a>
    a.href = base64; //Image Base64 Goes here
    a.download = "chart.png"; //File name Here
    a.click(); //Downloaded file
}
     
  return (
  
        <div id='family_size' className="charts-header">
          { chart_type===0  &&
          <div className="chart-buttons">
          <button className="button back-button" onClick={download_data}>Csv data</button>
          <button className="button back-button" onClick={change_chart}>Bar chart</button>
          <button className="button back-button" onClick={donwload_pdf}>PDF</button>
          <button className="button back-button" onClick={download_png}>PNG</button>
          </div>}

       {chart_type===1 &&
       <div className="chart-buttons">
        <button className="button back-button" onClick={download_data}>Csv data</button>
        <button className="button back-button" onClick={change_chart}>Pie chart</button>
        <button className="button back-button" onClick={donwload_pdf}>PDF</button>
        <button className="button back-button" onClick={download_png}>PNG</button>
        
          </div>}
{ chart_type===0 && <div className="chart-title">{props.title} 
     
      </div>}
          
      { chart_type===0 && <div className="chart-content doughnut">
        <Doughnut ref={(reference)=> chartref=reference} data={chartData} options={chartOptions} />
        
      </div>}
     { chart_type===0 &&<div className="chart-note"> 
        Sample Size: {formatNumber(sampleSize)} 
      </div>}


       
      {chart_type===1 &&<div className="chart-title">{props.title}  
       
          </div>}
       { chart_type===1 &&<div className="chart-content doughnut">
          <Bar ref={(reference)=> chartref=reference} data={chartData1} options={chartOptions1} />
        </div>}
        {chart_type===1 &&<div className="chart-note">
          Sample Size: {formatNumber(sampleSize)} 
        </div>}
    </div>
  );
}

export default FamilyChart;
