import React from "react";
import {Row,Col,Form,Button,InputGroup} from "react-bootstrap";
import Physics from "../Physics";
import CellPresets from "../data/CellPresets";
import Ions from "../data/Ions";
import Chart from "../Chart";
import { StopFill, PlayFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import MathJax from "react-mathjax";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

const CUSTOM_INDEX = -1;
const HISTORY_INTERVAL = 200;
const HISTORY_LENGTH = 60;

class RestingMembranePotentialPage extends React.Component {
	constructor() {
		super();
		const cellDefault = CellPresets[0];
		this.state = {
			preset: 0,
			temperature: cellDefault.T,
			restingMembranePotential: -59.2,
			sodium: { ...cellDefault.sodium },
			potassium: { ...cellDefault.potassium },
			chloride: { ...cellDefault.chloride },
			history: [],
			startTime: new Date(),
			running:true
		}
		this.state.history = this.buildHistory(this.state);
	}

	componentDidMount = () => {
		this.startHistory();
	}

	startHistory = () => {
		this.updateHistoryInterval = setInterval(this.updateHistory, HISTORY_INTERVAL);
		if(!this.state.running) {
			this.setState({...this.state,running:true});
		}
	}

	stopHistory = () => {
		clearInterval(this.updateHistoryInterval);
		if(!!this.state.running) {
			this.setState({...this.state,running:false});
		}
	}

	buildHistory = (state) => {
		const output = [];
		for (let index = -HISTORY_LENGTH; index <= 0; index++) {
			output.push({x: index, y: state.restingMembranePotential})
		}
		return output;
	}

	resetHistory = () => {
		this.setState({...this.state, history: this.buildHistory(this.state)});
	}

	updateHistory = () => {
		const newHistory = [...this.state.history];
		const currentTime = newHistory[newHistory.length - 1].x + 1;
		newHistory.push({x: currentTime, y: this.state.restingMembranePotential});

		if(newHistory.length > HISTORY_LENGTH) {
			newHistory.shift();
		}

		this.update({history: newHistory});
	}

	update = (newState, updateRMP) => {
		const updatedState = {...this.state, ...newState};
		if(!!updateRMP) {
			updatedState.restingMembranePotential = Physics.calculateGoldman(updatedState)
		}
		this.setState(updatedState);
	}

	updatePreset = (event) => {
		const presetIndex = event.target.value;
		const preset = CellPresets[presetIndex];

		let newState = {
			preset: presetIndex
		}

		if(!!preset) {
			newState = {
				...newState,
				potassium: { ...preset.potassium },
				sodium: { ...preset.sodium },
				chloride: { ...preset.chloride },
				temperature: preset.T
			}
		}
		
		this.update(newState, true);
	}

	rangeInput = (props) => {
		const {
			propertyName,
			variableName,
			min,
			max,
			label,
			logSlider
		} = props;

		const value = !!propertyName ? this.state[propertyName][variableName] : this.state[variableName];

		const calculateValue = (v) => Math.max(Math.min(v, max), min);
		const calculateLogValue = (v) => Math.max(Math.min(Math.round(Math.pow(10,v)), max), min);
		const getSliderValue = (v) => logSlider ? Math.log10(v) : v;

		const onInputChange = (event) => {
			const newState = {preset: CUSTOM_INDEX};
			const newValue = calculateValue(event.target.valueAsNumber);
			if(!!propertyName) {
				newState[propertyName] = this.state[propertyName];
				newState[propertyName][variableName] = newValue
			}
			else
				newState[variableName] = newValue;
			this.update(newState, true);
		};

		const onSliderChange = (event) => {
			const newState = {preset: CUSTOM_INDEX};
			const newValue = (logSlider ? calculateLogValue : calculateValue)(event.target.valueAsNumber);
			if(!!propertyName) {
				newState[propertyName] = this.state[propertyName];
				newState[propertyName][variableName] = newValue
			}
			else
				newState[variableName] = newValue;
			this.update(newState, true);
		}

		const decrement = () => {
			const newState = {preset: CUSTOM_INDEX};
			const newValue = calculateValue(value-1);
			if(!!propertyName) {
				newState[propertyName] = this.state[propertyName];
				newState[propertyName][variableName] = newValue
			}
			else
				newState[variableName] = newValue;
			this.update(newState, true);
		}

		const increment = () => {
			const newState = {preset: CUSTOM_INDEX};
			const newValue = calculateValue(value+1);
			if(!!propertyName) {
				newState[propertyName] = this.state[propertyName];
				newState[propertyName][variableName] = newValue
			}
			else
				newState[variableName] = newValue;
			this.update(newState, true);
		}

		return (
			<Form.Group>
				<Row>
					<Col><strong><Form.Label dangerouslySetInnerHTML={{__html: label}} /></strong></Col>
				</Row>
				<Row>
					<Col xs={12} sm={12} md={4}>
						<InputGroup size="sm">
								<InputGroup.Prepend>
									<Button disabled={value == min} variant="dark" onClick={decrement}>-</Button>
								</InputGroup.Prepend>
								<Form.Control value={value} min={min} max={max} type="number" onChange={onInputChange} />
								<InputGroup.Append>
									<Button disabled={value == max} variant="dark" onClick={increment}>+</Button>
								</InputGroup.Append>
						</InputGroup>
					</Col>
					<Col xs={12} sm={12} md={8}>
						<RangeSlider variant="dark" value={getSliderValue(value)} min={getSliderValue(min)} max={getSliderValue(max)} step={logSlider ? 0.01 : 1} onChange={onSliderChange} tooltip="off" />
					</Col>
				</Row>
			</Form.Group>
		)
	}

	renderChart = () => {
		const {history} = this.state;
		const chartOptions = {
			axisX: {
				title: "time (ms)"
			},
			axisY: {
				title: "resting membrane potential (mV)",
				minimum: -120,
				maximum: 120,
				interval: 20
			}
		}

		return(<Chart chartTitle={"Resting Membrane Potential vs. Time"} data={history} options={chartOptions} />)
	}

	renderDescription = () => {
		const nernstLatex = "E_{m}=-\\frac{RT}{F}\\ln \\frac{P_{K^{+}}[K^{+}]_{i}+P_{Na^{+}}[Na^{+}]_{i}+P_{Cl^{-}}[Cl^{-}]_{o}}{P_{K^{+}}[K^{+}]_{o}+P_{Na^{+}}[Na^{+}]_{o}+P_{Cl^{-}}[Cl^{-}]_{i}}";
		return (<div>
			<h1>Resting Membrane Potential</h1>
			<p className="text-center"><MathJax.Provider><MathJax.Node inline formula={nernstLatex} /></MathJax.Provider></p>
			<dl>
				<dt>E<sub>m</sub></dt><dd>The resting membrane potential measured in millivolts (mV).</dd>
				<dt>R</dt><dd>The universal gas constant (8.31446 J K<sup>-1</sup> mol<sup>-1</sup>).</dd>
				<dt>T</dt><dd>The temperature of the system measured in Kelvins (K).</dd>
				<dt>P<sub>ion</sub></dt><dd>The permeability of the ion across the membrane in meters per second (m s<sup>-1</sup>)</dd>
				<dt>[ion]<sub>o</sub></dt><dd>The concentration of the ion outside of the plasma membrane measured in milliMolar (mM).</dd>
				<dt>[ion]<sub>i</sub></dt><dd>The concentration of the ion inside of the plasma membrane measured in milliMolar (mM).</dd>
			</dl>
			<p>
				The form and graph on this page can be used to visualize how resting membrane potential changes. Adjust the
				values for the Goldman equation variables and see how the resting membrane potential changes on the graph. Press stop to freeze the graph
				in place, press play to begin recording data, again, and press reset to clear out the old data.
			</p>
			<hr />
			<small>
				<ol style={{paddingLeft:"1em"}}>
					<li><a href="http://www.nernstgoldman.physiology.arizona.edu/" target="blank">The Nernst/Goldman Equation Simulator. (n.d.). Retrieved October 22, 2020, from http://www.nernstgoldman.physiology.arizona.edu/</a></li>
					<li>Widmaier, E. P., Vander, A. J., Raff, H., &amp; Strang, K. T. (2019). 6.6 The Resting Membrane Potential. In <em>Vander's human physiology: The mechanisms of body function</em> (p. 144-148). New York, NY: McGraw-Hill Education.</li>
					<li><a href="https://journals.physiology.org/doi/full/10.1152/advan.00029.2004" target="blank">Wright, S. H. (2004). Generation of resting membrane potential. <em>Advances in Physiology Education</em>, 28(4), 139-142. doi:10.1152/advan.00029.2004</a></li>
				</ol>
			</small>
		</div>)
	}

	renderForm = () => {
		const {
			restingMembranePotential,
			preset,
			ionIndex
		} = this.state;

		return (
			<Form>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label><strong>Presets</strong></Form.Label>
							<Form.Control as="select" custom value={preset} onChange={this.updatePreset}>
								{CellPresets.map((value,index) => (<option key={index} value={index}>{value.name}</option>))}
								<option value={CUSTOM_INDEX}>Custom</option>
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
				{Ions.map((ion,index) => {
					return (
						<div key={index}>
							{this.rangeInput({label: `[${ion.shortNameHtml}]<sub>o</sub>`, propertyName: ion.propertyName, variableName: "concentrationOut", min: ion.concentrationOut.min, max: ion.concentrationOut.max})}
							{this.rangeInput({label: `[${ion.shortNameHtml}]<sub>i</sub>`, propertyName: ion.propertyName, variableName: "concentrationIn", min: ion.concentrationIn.min, max: ion.concentrationIn.max})}
							{this.rangeInput({label: `P<sub>${ion.shortNameHtml}</sub>`, logSlider: true, propertyName: ion.propertyName, variableName: "permeability", min: ion.permeability.min, max: ion.permeability.max})}
						</div>
					)
				})}
						{this.rangeInput({label: "T (°C)", variableName: "temperature", min: 0, max: 100})}
				<Form.Group>
					<Form.Label dangerouslySetInnerHTML={{__html: `<strong>E<sub>m</sub></strong>`}}></Form.Label>
					<Form.Control value={restingMembranePotential.toFixed(1)} type="number" disabled />
				</Form.Group>
			</Form>
		)
	}

	render = () => {
		const {
			running
		} = this.state;
		return (
			<Row>
				<Col xs={12} sm={12} md={6}>{this.renderDescription()}</Col>
				<Col xs={12} sm={12} md={6}>
					<Row>
						<Col>{this.renderForm()}</Col>
					</Row>
					<Row>
						<Col>{this.renderChart()}</Col>
					</Row>
					<Row>
						<Col>
							{!!running && <Button variant="danger" onClick={this.stopHistory}><StopFill /> Stop</Button>}
							{!running && <Button variant="success" onClick={this.startHistory}><PlayFill /> Play</Button>}
							<Button variant="dark" onClick={this.resetHistory}><ArrowCounterclockwise /> Reset</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

export default RestingMembranePotentialPage;
