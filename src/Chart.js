import React from "react";
import CanvasJSReact from './externals/canvasjs/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends React.Component {
	render = () => {
		const { chartTitle, data, options } = this.props;

		const chartOptions = {
			...options,
			title:{
				text: chartTitle
			},
			data
		};
		
	return (
			<div>
				<CanvasJSChart options={chartOptions}
						/* onRef = {ref => this.chart = ref} */
				/>
			</div>
		);
	}
}

export default Chart;