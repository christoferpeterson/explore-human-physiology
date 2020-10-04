import React from "react";
import CanvasJSReact from './externals/canvasjs/canvasjs.react';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends React.Component {
  constructor() {
    super()
  }

  render = () => {
    const { chartTitle, data } = this.props;

    const options = {
      title:{
        text: chartTitle
      },
      data: [
      {
        type: "line",
        dataPoints: data
      }]
    };
		
   return (
      <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
      </div>
    );
  }
}

export default Chart;