import legend from './legend';
import {MAP_TYPES} from '../constants';
import {formatNumber} from '../utils/commonfunctions';
//  import count from '../state_district_count';
import * as d3 from 'd3';
import React, {useCallback, useEffect, useRef, useState} from 'react';
// import survey from '../survey_data_new.json';
import * as topojson from 'topojson';
// import dataa from '../data';


const propertyFieldMap = {
  country: 'st_nm',
  state: 'district',
};

function ChoroplethMapOrigin({
  setHoveredRegion,

  count,
  mapMeta,
  changeMap,
  selectedRegion,
  setSelectedRegion,
  isCountryLoaded,
  
}) {
  // console.log("in choropleth origin");

  const choroplethMapOrigin = useRef(null);
  const choroplethLegendOrigin = useRef(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);

  const ready = useCallback(
    (geoData) => {
      d3.selectAll('svg#chart1 > *').remove();

      const propertyField = propertyFieldMap[mapMeta.mapType];
      const svg = d3.select(choroplethMapOrigin.current);

      const topology = topojson.feature(
        geoData,
        geoData.objects[mapMeta.graphObjectName]
      );

      const projection = d3.geoMercator();

      // Set size of the map
      let path;
      let width;
      let height;
      if (!svg.attr('viewBox')) {
        const widthStyle = parseInt(svg.style('width'));
        if (isCountryLoaded) projection.fitWidth(widthStyle, topology);
        else {
          const heightStyle = parseInt(svg.style('height'));
          projection.fitSize([widthStyle, heightStyle], topology);
        }
        path = d3.geoPath(projection);
        const bBox = path.bounds(topology);
        width = +bBox[1][0];
        height = +bBox[1][1];
        svg.attr('viewBox', `0 0 ${width} ${height}`);
      }
      const bBox = svg
      .attr('viewBox').split(' ');
      width = +bBox[2];
      height = +bBox[3];
      projection.fitSize([width, height], topology);
      path = d3.geoPath(projection);

      /* Legend */
      const svgLegend = d3.select(choroplethLegendOrigin.current);
      svgLegend.selectAll('*').remove();
      const colorInterpolator = (t) => {
        
            return d3.interpolateBlues(t * 0.85);
         
      };
      var x;
      if (mapMeta.mapType === MAP_TYPES.COUNTRY)
      x=count["value"];
      else
      x=count[mapMeta.name];
      const colorScale = d3.scaleSequential(
        [0, Math.max(1,x)],
        colorInterpolator
      );
      // Colorbar
      const widthLegend = parseInt(svgLegend.style('width'));
      const margin = {left: 0.02 * widthLegend, right: 0.02 * widthLegend};
      const barWidth = widthLegend - margin.left - margin.right;
      const heightLegend = +svgLegend.attr('height');
      svgLegend
        .append('g')
        .style('transform', `translateX(${margin.left}px)`)
        .append(() =>
          legend({
            color: colorScale,
            title:
            'Total Trips',
          
            width: barWidth,
            height: 0.8 * heightLegend,
            ticks: 6,
            tickFormat: function (d, i, n) {
              if (!Number.isInteger(d)) return;
              if (i === n.length - 1) return formatNumber(d) + '+';
              return formatNumber(d);
            },
          })
        );
      svgLegend.attr('viewBox', `0 0 ${widthLegend} ${heightLegend}`);

      /* Draw map */
      let onceTouchedRegion = null;
      const g = svg.append('g').attr('class', mapMeta.graphObjectName);
      g.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topology.features)
        .join('path')
        .attr('class', `path-region active`)
        .attr('fill', function (d) {
          
          const region1
           = d.properties[propertyField];
          
          
    
        const n=count.hasOwnProperty(region1)?count[region1]:0;
          
          const color = n === 0 ? '#ffffff' : colorScale(n);
          return color;
        })
        .attr('d', path)
        .attr('pointer-events', 'all')
        .on('mouseenter', (d) => {
          handleMouseEnter(d.properties[propertyField]);
        })
        .on('mouseleave', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
        })
        .on('touchstart', (d) => {
          if (onceTouchedRegion === d) onceTouchedRegion = null;
          else onceTouchedRegion = d;
        })
        .on('click', handleClick)
        .style('cursor', 'pointer')
        .append('title')
        .text(function (d) {
          const region = d.properties[propertyField];
          
          const value= count.hasOwnProperty(region)?count[region]:0;
          return(value);
          
        });

      g.append('path')
        .attr('class', 'borders')
        .attr(
          'stroke',
          `${
            
               '#007bff20'
            
          }`
        )
        .attr('fill', 'none')
        .attr('stroke-width', width / 250)
        .attr(
          'd',
          path(topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectName]))
        );

      const handleMouseEnter = (name) => {
        // console.log({name});
        try {
          setSelectedRegion(name);
          setHoveredRegion(name, mapMeta);
        } catch (err) {
          console.log('err', err);
        }
      };

      function handleClick(d) {
        d3.event.stopPropagation();
        if (onceTouchedRegion || mapMeta.mapType === MAP_TYPES.STATE) return;
        // Disable pointer events till the new map is rendered
        svg.attr('pointer-events', 'none');
        g.selectAll('.path-region').attr('pointer-events', 'none');
        // Switch map
        changeMap(d.properties[propertyField]);
      }

      // Reset on tapping outside map
      svg.attr('pointer-events', 'auto').on('click', () => {
        if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
          setSelectedRegion(null);
          setHoveredRegion('India', mapMeta);
        }
      });
    },
    [
      mapMeta,
      count,

      isCountryLoaded,
    
      setSelectedRegion,
      setHoveredRegion,
      changeMap,
    ]
  );

  useEffect(() => {
    (async () => {
      const data = await d3.json(mapMeta.geoDataFile);
      if ( choroplethMapOrigin.current) {
        ready(data);
        setSvgRenderCount((prevCount) => prevCount + 1);
      }
    })();
  }, [mapMeta.geoDataFile,  ready]);

  useEffect(() => {
    const highlightRegionInMap = (name) => {
      const paths = d3.select('svg#chart1 > *').selectAll('.path-region');
      paths.classed('map-hover', (d, i, nodes) => {
        const propertyField =
          'district' in d.properties
            ? propertyFieldMap['state']
            : propertyFieldMap['country'];
        if (name === d.properties[propertyField]) {
          nodes[i].parentNode.appendChild(nodes[i]);
          return true;
        }
        return false;
      });
    };
    highlightRegionInMap(selectedRegion);
  }, [svgRenderCount, selectedRegion]);

  return (
    <div>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg
          id="chart1"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethMapOrigin}
        ></svg>
        
      </div>
      <div
        className="svg-parent legend fadeInUp"
        style={{animationDelay: '2.5s'}}
      >
        <svg
          id="legend"
          height="65"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethLegendOrigin}
        ></svg>
      </div>
    </div>
  );
}

export default React.memo(ChoroplethMapOrigin);
