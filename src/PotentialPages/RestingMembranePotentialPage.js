import React from "react";
import {Row,Col,Form,Button} from "react-bootstrap";
import Physics from "../Physics";
import CellPresets from "../data/CellPresets";
import Ions from "../data/Ions";
import Chart from "../Chart";
import { StopFill, PlayFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import MathJax from "react-mathjax";
import RangeInput from '../Shared/RangeInput';
import { Link } from "react-router-dom";

const Constants = {CUSTOM_INDEX:-1, HISTORY_INTERVAL:200, HISTORY_LENGTH:60};

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
		this.updateHistoryInterval = setInterval(this.updateHistory, Constants.HISTORY_INTERVAL);
		if(!this.state.running) {
			this.update({running:true});
		}
	}

	stopHistory = () => {
		clearInterval(this.updateHistoryInterval);
		if(!!this.state.running) {
			this.update({running:false});
		}
	}

	buildHistory = (state) => {
		const output = [];
		for (let index = -Constants.HISTORY_LENGTH; index <= 0; index++) {
			output.push({x: index, y: state.restingMembranePotential})
		}
		return output;
	}

	resetHistory = () => {
		this.update({history: this.buildHistory(this.state)});
	}

	updateHistory = () => {
		const newHistory = [...this.state.history];
		const currentTime = newHistory[newHistory.length - 1].x + 1;
		newHistory.push({x: currentTime, y: this.state.restingMembranePotential});

		if(newHistory.length > Constants.HISTORY_LENGTH) {
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

		const data = [
			{
				type: "line",
				xValueFormatString: "##.0 ms",
				yValueFormatString: "##.0 mV",
				markerSize: 0,
				dataPoints: history
			}
		];

		return(<Chart chartTitle={"Resting Membrane Potential vs. Time"} data={data} options={chartOptions} />)
	}

	renderDescription = () => {
		const nernstLatex = "E_{m}=-\\frac{RT}{F}\\ln \\frac{P_{K^{+}}[K^{+}]_{i}+P_{Na^{+}}[Na^{+}]_{i}+P_{Cl^{-}}[Cl^{-}]_{o}}{P_{K^{+}}[K^{+}]_{o}+P_{Na^{+}}[Na^{+}]_{o}+P_{Cl^{-}}[Cl^{-}]_{i}}";
		return (<div>
			<h1>Resting Membrane Potential</h1>
			<p>
				The semi-permeability of a cell membrane allows for the division of fluid and solutes between two distinct 
				compartments. An electrochemical dynamic equilibrium exists between the cytosol (cell interior) and the 
				extracellular fluid. The dynamic equilibrium, quantified by solute concentration and electric charge differences 
				across the cell membrane, causes the driving force of diffusion. The force drives particles from areas of high 
				concentration to low concentration. The separation of charged particles creates an electric potential, measured 
				in millivolts (mV), which applies a force to bring the charge to zero. The electric force achieves an equilibrium 
				potential, measured in mV when its force is equal and opposite to the force created by the chemical gradient.
			</p>
			<p>
				Resting membrane potential is a measure of the cell's electric potential at rest (no applied stimulus). Most cells, particularly neurons, 
				have a resting membrane potential of -70 mV in the human body. Relative and selective permeability of the major in vivo ions, sodium 
				(Na<sup>+</sup>) and potassium (K<sup>+</sup>), establishes the resting membrane potential. At rest, there are more Na<sup>+</sup> 
				ions outside of the cell than inside. There are more K<sup>+</sup> ions inside the cell than outside. Primary active transport,
				using adenosine triphosphate (ATP) as a source of power, managed by the Na<sup>+</sup>/K<sup>+</sup> ATPase embedded in the membrane,
				helps maintain this concentration gradient by moving K+ into the cell and Na+ out of the cell. Selective passive transport channels in 
				the membrane allow Na<sup>+</sup> and K<sup>+</sup>'s free flow, known as leak channels. Cells have a much higher number of K<sup>+</sup> 
				leak channels than Na<sup>+</sup>. A negative charge inside the cell is achieved by the high net flux of positive ions out of the cell. 
				The measure of that charge is the resting membrane potential, and for most cells, it is -70 mV.
			</p>
			<h2>Goldman Equation</h2>
			<p>The Goldman equation calculates the resting membrane potential of a cell. There are several necessary aspects of the 
				equation. First, concentrations of vital ions Na<sup>+</sup>, K<sup>+</sup>, and chlorine (Cl<sup>-</sup>) both inside and outside of the cell establishes 
				the concentration gradient. The membrane permeability of the ions establishes each net flux. Finally, a constant, dependent 
				on body temperature, normalizes the value in the human body.</p>
			<p className="text-center"><MathJax.Provider><MathJax.Node inline formula={nernstLatex} /></MathJax.Provider></p>
			<dl>
				<dt>E<sub>m</sub></dt><dd>The resting membrane potential measured in millivolts (mV).</dd>
				<dt>R</dt><dd>The universal gas constant (8.31446 J K<sup>-1</sup> mol<sup>-1</sup>).</dd>
				<dt>T</dt><dd>The temperature of the system measured in Kelvins (K).</dd>
				<dt>F</dt><dd>Faraday's constant is the total electric charge carried by one mole of electrons. (96,485.3365 C mol<sup>-1</sup>)</dd>
				<dt>P<sub>ion</sub></dt><dd>The permeability of the ion across the membrane in meters per second (m s<sup>-1</sup>)</dd>
				<dt>[ion]<sub>o</sub></dt><dd>The concentration of the ion outside of the plasma membrane measured in milliMolar (mM).</dd>
				<dt>[ion]<sub>i</sub></dt><dd>The concentration of the ion inside of the plasma membrane measured in milliMolar (mM).</dd>
			</dl>
			<h2>The Bigger Picture</h2>
			<p>
				Excitable cells in the body stay at a resting membrane potential as a way to store potential energy and prepare to do work. A neuron, 
				which has	a resting membrane potential of approximately -70 mV, can use that voltage to perform work. The work performed by a neuron is the 
				transmission of a signal down its axon. Resting membrane potential is how the nervous system prepares for the transfer of signals
				across the entire body. <Link to="action-potential">Learn how the nervous system transfers the signals by learning about action potentials.</Link>
			</p>
			<h2>Pharmacology</h2>
			<p>
				Physicians prescribe digitalis to patients suffering from congestive heart failure or heart arrhythmias (abnormal heartbeat). It 
				acts by inhibiting the sodium/potassium antiporter in excitable cells. Inhibition of the cell's primary mode of maintaining 
				sodium and potassium concentration gradients leads to membrane depolarization. Try setting the sodium and potassium concentrations 
				equal to each other. Notice the resting membrane potential depolarizes to a resting membrane potential closer to zero. Lowering the 
				resting membrane potential makes it easier for excitable cells to reach threshold potential and cause an action potential in small 
				doses.
			</p>
			<h3>Take it Further</h3>
			<ul>
				<li>What would happen if the dose of digitalis is too high?</li>
				<li>Imagine a drug that blocks potassium leak channels. What would that do to the resting membrane potential?</li>
				<li>How about a drug that blocks sodium leak channels?</li>
			</ul>
		</div>)
	}

	renderReferences = () => {
		return (
			<div>
				<hr />
				<small>
					<ol style={{paddingLeft:"1em", maxWidth:"60em"}}>
						<li><a href="https://www.cvpharmacology.com/cardiostimulatory/digitalis" target="_blank"  rel="noreferrer">Klabunde, R. E. (2015, March 09). Cardiac Glycosides (Digitalis Compounds). Retrieved November 25, 2020, from https://www.cvpharmacology.com/cardiostimulatory/digitalis</a></li>
						<li>Greene, M. (2020). <i>Lectures 5 &amp; 6 Resting Membrane Potential</i>, lecture notes, BIOL3225 Human Physiology BIOL3225, University of Colorado Denver, delivered 31 Aug 2020 &amp; 02 Sep 2020</li>
						<li><a href="http://www.nernstgoldman.physiology.arizona.edu/" target="blank">The Nernst/Goldman Equation Simulator. (n.d.). Retrieved October 22, 2020, from http://www.nernstgoldman.physiology.arizona.edu/</a></li>
						<li>Widmaier, E. P., Vander, A. J., Raff, H., &amp; Strang, K. T. (2019). 6.6 The Resting Membrane Potential. In <em>Vander's human physiology: The mechanisms of body function</em> (p. 144-148). New York, NY: McGraw-Hill Education.</li>
						<li><a href="https://journals.physiology.org/doi/full/10.1152/advan.00029.2004" target="blank">Wright, S. H. (2004). Generation of resting membrane potential. <em>Advances in Physiology Education</em>, 28(4), 139-142. doi:10.1152/advan.00029.2004</a></li>
					</ol>
				</small>
			</div>
		)
	}

	renderForm = () => {
		const {
			restingMembranePotential,
			preset
		} = this.state;

		const sharedRangeInputProps = {state: this.state, update: this.update}

		return (
			<Form>
				<Row>
					<Col>
						<Form.Group>
							<Form.Label><strong>Presets</strong></Form.Label>
							<Form.Control as="select" custom value={preset} onChange={this.updatePreset}>
								{CellPresets.map((value,index) => (<option key={index} value={index}>{value.name}</option>))}
								<option value={Constants.CUSTOM_INDEX}>Custom</option>
							</Form.Control>
						</Form.Group>
					</Col>
				</Row>
				{Ions.map((ion,index) => {
					const props = {propertyName: ion.propertyName, style: ion.style, ...sharedRangeInputProps}
					return (
						<div key={index}>
							<RangeInput {...props} variableName="concentrationOut" min={ion.concentrationOut.min} max={ion.concentrationOut.max} label={`[${ion.shortNameHtml}]<sub>o</sub>`} />
							<RangeInput {...props} variableName="concentrationIn" min={ion.concentrationIn.min} max={ion.concentrationIn.max} label={`[${ion.shortNameHtml}]<sub>i</sub>`} />
							<RangeInput {...props} logSlider={true} variableName="permeability" min={ion.permeability.min} max={ion.permeability.max} label={`P<sub>${ion.shortNameHtml}</sub>`} />
						</div>
					)
				})}
				<RangeInput {...sharedRangeInputProps} label="T (°C)" variableName="temperature" min={0} max={100} />
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
			<div>
				<Row>
					<Col xs={12} sm={12} md={6}>{this.renderDescription()}</Col>
					<Col xs={12} sm={12} md={6}>
						<Row>
							<Col>
								<p>
									The form and graph on this page can be used to visualize how resting membrane potential changes. Adjust the
									values for the Goldman equation variables and see how the resting membrane potential changes on the graph. Press stop to freeze the graph
									in place, press play to begin recording data, again, and press reset to clear out the old data.
								</p>
							</Col>
						</Row>
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
				<Row>
					<Col>{this.renderReferences()}</Col>
				</Row>
			</div>
		);
	}
}

export default RestingMembranePotentialPage;
