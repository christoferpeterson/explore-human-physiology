import React from "react";
import {Row,Col,Form,Button,InputGroup} from "react-bootstrap";
import Physics from "../Physics";
import CellPresets from "../CellPresets";
import Ions from "../Ions";
import Chart from "../Chart";
import { StopFill, PlayFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import MathJax from "react-mathjax";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

const CUSTOM_INDEX = -1;
const HISTORY_INTERVAL = 200;
const HISTORY_LENGTH = 60;

class EquilibriumPotentialPage extends React.Component {
	constructor() {
		super();
		this.state = {
			preset: 0,
			ionConcentrationOutside: 10,
			ionConcentrationInside: 100,
			temperature: 37,
			equilibriumPotential: -61.5,
			history: [],
			startTime: new Date(),
			running:true,
			ion: Ions[0],
			ionIndex: 0
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
			output.push({x: index, y: state.equilibriumPotential})
		}
		return output;
	}

	resetHistory = () => {
		this.setState({...this.state, history: this.buildHistory(this.state)});
	}

	updateHistory = () => {
		const newHistory = [...this.state.history];
		const currentTime = newHistory[newHistory.length - 1].x + 1;
		newHistory.push({x: currentTime, y: this.state.equilibriumPotential});

		if(newHistory.length > HISTORY_LENGTH) {
			newHistory.shift();
		}

		this.update({history: newHistory});
	}

	update = (newState, updateEquilibriumPotential) => {
		const updatedState = {...this.state, ...newState};
		if(!!updateEquilibriumPotential) {
			updatedState.equilibriumPotential = Physics.calculateNernst(updatedState)
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
				ionConcentrationOutside: preset.KConcentrationOut,
				ionConcentrationInside: preset.KConcentrationIn,
				temperature: preset.T
			}
		}
		
		this.update(newState, true);
	}

	updateIon = (event) => {
		const newState = {ionIndex: event.target.value};
		newState.ion = Ions[newState.ionIndex];
		newState.z = newState.ion.z;
		this.update({...this.state, ...newState}, true);
	}

	rangeInput = (props) => {
		const {
			variableName,
			min,
			max,
			label,
			logSlider
		} = props;

		const value = this.state[variableName];

		const calculateValue = (v) => Math.max(Math.min(v, max), min);
		const calculateLogValue = (v) => Math.max(Math.min(Math.round(Math.pow(10,v)), max), min);
		const getSliderValue = (v) => logSlider ? Math.log10(v) : v;

		const onInputChange = (event) => {
			const newState = {preset: CUSTOM_INDEX};
			newState[variableName] = calculateValue(event.target.valueAsNumber);
			this.update(newState, true);
		};

		const onSliderChange = (event) => {
			const newState = {preset: CUSTOM_INDEX};
			newState[variableName] = (logSlider ? calculateLogValue : calculateValue)(event.target.valueAsNumber);
			this.update(newState, true);
		}

		const decrement = () => {
			const newState = {preset: CUSTOM_INDEX};
			newState[variableName] = calculateValue(value-1);
			this.update(newState, true);
		}

		const increment = () => {
			const newState = {preset: CUSTOM_INDEX};
			newState[variableName] = calculateValue(value+1);
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
				title: "equilibrium potential (mV)",
				minimum: -120,
				maximum: 120,
				interval: 20
			}
		}

		return(<Chart chartTitle={"Equilibrium Potential vs. Time"} data={history} options={chartOptions} />)
	}

	renderDescription = () => {
		const nernstLatex = "E_{0}=\\cfrac{-RT}{zF}\\ln \\cfrac{[ion]_{i}}{[ion]_{o}}";
		return (<div>
			<h1>Equilibrium Potential</h1>
			<p>
				Diffusion is the natural tendency for particles in a solution to evenly distribute among the solvent. The particles, through
				their intrinsic movement, will flow from areas of high concentration to areas of low concentration following the third law
				of thermodynamics. The entropy of the system will increase as the particles spread out. This causes a net flux of particles down
				the solute concentration gradient.
			</p>
			<p>
				In vivo, the solutes are a combination of many ions and solutions are be separated by plasma membrane. Each ion will attempt to 
				spread out according to their particular concentration gradients. Ions are charged and like charges repel eachother. An additional 
				electrostatic force limits the net flux of ions. The direction of the electrical force, when considering a single ion, can support 
				or oppose diffusion. When the flux due to the electrical repulsion is equal and opposite to flux due to diffusion, the net flux of 
				ions will be zero. This equilibrium point can be measured as the electric potential. When the potential is measured on either side
				of a plasma membrane, it is called the equilibrium potential. It is measured in millivolts.
			</p>
			<p>
				Walther Nernst, a German physical chemist, described equilibrium potential as the mathematical relationship between the charges of
				the ions, and the ratio of concentrations on either side of a membrane. The equation can be written as:
			</p>
			<p className="text-center"><MathJax.Provider><MathJax.Node inline formula={nernstLatex} /></MathJax.Provider></p>
			<dl>
				<dt>E<sub>0</sub></dt><dd>The equilibrium potential across a plasma membrane measured in millivolts (mV).</dd>
				<dt>R</dt><dd>The universal gas constant (8.31446 J K<sup>-1</sup> mol<sup>-1</sup>).</dd>
				<dt>T</dt><dd>The temperature of the system measured in Kelvins (K).</dd>
				<dt>z</dt><dd>The charge of the ion (typically 1 or -1 for biological systems).</dd>
				<dt>[ion]<sub>o</sub></dt><dd>The concentration of the ion outside of the plasma membrane measured in milliMolar (mM).</dd>
				<dt>[ion]<sub>i</sub></dt><dd>The concentration of the ion inside of the plasma membrane measured in milliMolar (mM).</dd>
			</dl>
			<p>
				The form and graph on this page can be used to visualize how equilibrium potential changes in a dynamic system. Adjust the
				values for the Nernst equation variables and see how the equilibrium potential changes on the graph. Press stop to freeze the graph
				in place, press play to begin recording data, again, and press reset to clear out the old data.
			</p>
		</div>)
	}

	renderForm = () => {
		const {
			equilibriumPotential,
			preset,
			ion,
			ionIndex
		} = this.state;

		return (
			<Form>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label>Presets</Form.Label>
							<Form.Control as="select" custom value={preset} onChange={this.updatePreset}>
								{CellPresets.map((value,index) => (<option key={index} value={index}>{value.name}</option>))}
								<option value={CUSTOM_INDEX}>Custom</option>
							</Form.Control>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group>
							<Form.Label>Ion</Form.Label>
							<Form.Control as="select" custom value={ionIndex} onChange={this.updateIon}>
								{Ions.map((value,index) => (<option key={index} value={index}>{Ions[index].displayName}</option>))}
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
				{this.rangeInput({label: `[${ion.shortNameHtml}]<sub>o<sub>`, variableName: "ionConcentrationOutside", min: 1, max: 600})}
				{this.rangeInput({label: `[${ion.shortNameHtml}]<sub>i<sub>`, variableName: "ionConcentrationInside", min: 1, max: 200})}
				{this.rangeInput({label: "T (°C)", variableName: "temperature", min: 0, max: 100})}
				<Form.Group>
					<Form.Label dangerouslySetInnerHTML={{__html: `E<sub>0</sub> of ${ion.shortNameHtml}`}}></Form.Label>
					<Form.Control value={equilibriumPotential.toFixed(1)} type="number" disabled />
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

export default EquilibriumPotentialPage;
