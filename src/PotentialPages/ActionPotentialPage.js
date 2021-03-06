import React from "react";
import {Row,Col,Form,Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import Physics from "../Physics";
import CellPresets from "../data/CellPresets";
import Chart from "../Chart";
import { StopFill, PlayFill, ArrowCounterclockwise } from "react-bootstrap-icons";
import Helpers from "../Shared/Helpers";

const Constants = {
	HISTORY_INTERVAL: 100,
	HISTORY_LENGTH: 200
};

const LOOP_INTERVAL = 50;
const TIME_MULTIPLIER = 0.001;

class ActionPotentialPage extends React.Component {
	constructor() {
		super();
		const cellDefault = CellPresets[3];
		this.state = {
			preset: 0,
			temperature: cellDefault.T,
			membranePotential: -70,
			previousMembranePotential: -70,
			sodium: { ...cellDefault.sodium },
			potassium: { ...cellDefault.potassium, concentrationOut: 10, concentrationIn: 198 },
			chloride: { ...cellDefault.chloride },
			sodiumChannelRate: 0,
			potassiumChannelRate: 0,
			sodiumPermeabiltyRate: 0,
			potassiumPermeabilityRate: 0,
			history: [],
			running:true,
			firing: false
		}
		this.state.history = this.buildHistory(this.state);
	}

	buildHistory = (state) => {
		const output = [];
		for (let index = -Constants.HISTORY_LENGTH; index <= 0; index++) {
			output.push({x: index * LOOP_INTERVAL / 1000, y: state.membranePotential})
		}
		return output;
	}

	componentDidMount = () => {
		this.lastLoopRun = new Date();
		this.totalTimeElapsed = 0;
		this.loopInterval = setInterval(this.updateLoop, LOOP_INTERVAL);
	}

	stopLoop = () => {
		clearInterval(this.loopInterval);
		if(!!this.state.running) {
			this.update({running:false});
		}
	}

	startLoop = () => {
		this.lastLoopRun = new Date();
		this.loopInterval = setInterval(this.updateLoop, LOOP_INTERVAL);
		if(!this.state.running) {
			this.update({running:true});
		}
	}

	resetLoop = () => {
		this.lastLoopRun = new Date();
		this.update({history: this.buildHistory(this.state)});
	}

	updateLoop = () => {
		const {
			sodium: {
				permeability: naPermeability
			},
			potassium: {
				permeability: kPermeability
			},
			sodiumPermeabiltyRate,
			potassiumPermeabilityRate,
			membranePotential
		} = this.state;

		const currentTime = new Date();
		const elapsedTime = (currentTime - this.lastLoopRun) * TIME_MULTIPLIER;
		this.totalTimeElapsed += elapsedTime;
		this.lastLoopRun = currentTime;

		let { 
			sodiumChannelRate: newSodiumChannelRate, 
			potassiumChannelRate: newPotassiumChannelRate,
			gradedPotential: newGradedPotential
		} = this.updateChannels();

		let newNaPermeabilityRate = sodiumPermeabiltyRate + (newSodiumChannelRate * elapsedTime);
		let newKPermeabilityRate = potassiumPermeabilityRate + (newPotassiumChannelRate * elapsedTime);
		const newNaPermeability = Math.max(
			1, 
			Math.min(100000, 
				naPermeability + (newNaPermeabilityRate * elapsedTime)
		));
		const newKPermeability = Math.max(
			100, 
			Math.min(100000, 
				kPermeability + (newKPermeabilityRate * elapsedTime)
			));

		if(newKPermeability === 100) {
			newKPermeabilityRate = 0;
			newPotassiumChannelRate = 0;
		}

		if(newNaPermeability === 1) {
			newNaPermeabilityRate = 0;
			newSodiumChannelRate = 0;
		}

		const previousMembranePotential = membranePotential
		const newMembranePotential = 
			Physics.calculateGoldman(
				{ ...this.state, 
					potassium: { ...this.state.potassium, permeability: newKPermeability },
					sodium: { ...this.state.sodium, permeability: newNaPermeability }
				}
			);

		const newHistory = [...this.state.history];
		newHistory.push({x: this.totalTimeElapsed, y: newMembranePotential});

		if(newHistory.length > Constants.HISTORY_LENGTH) {
			newHistory.shift();
		}

		this.update({			
			sodium: { ...this.state.sodium, permeability: newNaPermeability },
			potassium: { ...this.state.potassium, permeability: newKPermeability },
			sodiumPermeabiltyRate: newNaPermeabilityRate,
			potassiumPermeabilityRate: newKPermeabilityRate,
			sodiumChannelRate: newSodiumChannelRate,
			potassiumChannelRate: newPotassiumChannelRate,
			membranePotential: newMembranePotential,
			gradedPotential: newGradedPotential,
			previousMembranePotential,
			history: newHistory
		});
	}

	updateChannels = () => {
		const {
			membranePotential,
			previousMembranePotential,
			potassiumChannelRate,
			sodiumChannelRate,
			gradedPotential
		} = this.state;

		let newSodiumChannelRate = sodiumChannelRate;
		let newPotassiumChannelRate = potassiumChannelRate;
		let newGradedPotential = gradedPotential;
		let stopFiring = false;

		const goingUp = previousMembranePotential < membranePotential;
		const goingDown = previousMembranePotential > membranePotential

		if(membranePotential >= -55 && goingUp) {
			newSodiumChannelRate = 5000
			newPotassiumChannelRate = 0;
			newGradedPotential = 0;
		}

		if(membranePotential >= 20 && goingUp) {
			newSodiumChannelRate = -4000;
		}

		if(membranePotential >= 0 && goingUp) {
			newPotassiumChannelRate = 750;
		}

		if(membranePotential <= -70 && goingDown) {
			newPotassiumChannelRate = -500
			stopFiring = false;
		}
		
		return {
			sodiumChannelRate: newSodiumChannelRate,
			potassiumChannelRate: newPotassiumChannelRate,
			gradedPotential: newGradedPotential,
			stopFiring
		};
	}

	handleFireActionPotential = () => {
		this.update({sodiumChannelRate: 10, firing: true}, () => setTimeout(() => this.update({firing: false}), 1000));
	}

	update = (newState, cb) => {
		const updatedState = {...this.state, ...newState};
		this.setState(updatedState, cb);
	}
	
	renderChart = () => {
		const {history} = this.state;
		const chartOptions = {
			axisX: {
				title: "time (ms)",
				interval: 1
			},
			axisY: {
				title: "membrane potential (mV)",
				minimum: -90,
				maximum: 40,
				interval: 20
			}
		}

		const data = [
			{
				name: "membrane potential",
				type: "line",
				xValueFormatString: "##.0 ms",
				yValueFormatString: "##.0 mV",
				markerSize: 0,
				dataPoints: history
			},
			{
				name: "threshold potential",
				type: "line",
				lineColor: "#DD0000",
				lineDashType: "shortDash",
				xValueFormatString: "threshold potential",
				yValueFormatString: "##.0 mV",
				lineThickness: 1,
				dataPoints: history.map(dp => ({x:dp.x,y:-55}))
			},
			{
				name: "resting membrane potential",
				type: "line",
				lineColor: "#00AA00",
				lineDashType: "shortDash",
				xValueFormatString: "resting membrane potential",
				yValueFormatString: "##.0 mV",
				lineThickness: 1,
				dataPoints: history.map(dp => ({x:dp.x,y:-70}))
			}
		];

		return(<Chart chartTitle={"Membrane Potential vs. Time"} data={data} options={chartOptions} />)
	}

	renderDescription = () => {
		return (<div>
			<h1>Action Potential</h1>
			<p>
				An action potential is a temporary, propagating change in an excitatory cell's membrane potential from a 
				resting membrane potential. In the human body, neurons and muscle cells can generate action potentials.
			</p>
			<h2>Neurons</h2>
			<h3>Resting Membrane Potential</h3>
			<p>
				The axon of a typical human neuron has a <Link to="resting-membrane-potential">resting membrane potential</Link> 
				(RMP) of about -70 mV. Sodium (Na<sup>+</sup>) and potassium (K<sup>+</sup>) ion concentration gradients (signified by square brackets: 
				[ion]) exist between the cytosol and the extracellular fluid (ECF). Continuously open, ion-specific leak channels 
				and sodium Na<sup>+</sup>/K<sup>+</sup>-ATPase antiporter's function maintain the imbalance. An abundance of K<sup>+</sup> leak channels keeps the 
				permeability of K<sup>+</sup> relatively high to Na<sup>+</sup>. The antiporter uses adenosine triphosphate (ATP) to move Na<sup>+</sup>out of the 
				cell and potassium in keeping ECF [Na<sup>+</sup>] high and [K<sup>+</sup>] low relative to the cytosol.
			</p>
			<h3>Depolarization</h3>
			<p>
				A change in membrane potential due to an incoming action potential wave or a graded potential in the initial segment 
				(axon hillock) generated by a stimulus may bring the axon's membrane potential to a treshold. In axons, the threshold 
				is around +15 mV from RMP. Voltage-gated (VG) Na<sup>+</sup> after reaching the threshold. VG K<sup>+</sup> channels 
				also begin opening but are much slower. The number of VG Na<sup>+</sup> channels opening increases the relative 
				permeability of Na<sup>+</sup> to be hundreds of times higher than K<sup>+</sup>, causing depolarization. 
			</p>
			<h3>Overshoot</h3>
			<p>
				As the membrane potential rises, it overshoots its depolarized state (0 mV). The positive voltage renders VG Na<sup>+</sup> 
				channels inert and triggers the VG K<sup>+</sup> channels to begin closing. A shift in relative permeability occurs because
				Na<sup>+</sup> permeability dramatically decreased, and K<sup>+</sup> permeability is still high. With relatively high 
				K<sup>+</sup> permeability, the membrane begins to repolarize.
			</p>
			<h3>Repolarization</h3>
			<p>
				The membrane potential plummets due to the high relative permeability of K<sup>+</sup>. Because the VG Na<sup>+</sup> 
				channels are inert and the K<sup>+</sup> channels are slowly closing, there is no possibility for another fire action 
				potential. An absolute refractory period occurs when action potentials cannot propagate through an excitatory cell segment 
				due to electrochemical conditions created by the previous action potential. Until the cell repolarizes, another action 
				potential cannot fire. The absolute refractory period begins after reaching the threshold and occurs until the cell 
				repolarizes. Once the membrane potential goes negative again, the VG Na<sup>+</sup> channels become active but are closed. 
				The inactivation of the channels allows another action potential to propagate because the VG Na<sup>+</sup> can be opened 
				to increase Na<sup>+</sup> permeability once more.
			</p>
			<h3>Hyperpolarization</h3>
			<p>
				VG K<sup>+</sup> channels are slow to close, causing a period where the relative permeability of K<sup>+</sup> is higher 
				than at rest. The action potential wave will see a hyperpolarization. The membrane potential will go beyond the -70 RMP 
				and approach the <Link to="equilibrium-potential">equilibrium potential</Link> of K<sup>+</sup> (approximately -90 mv). 
				The VG K<sup>+</sup> will eventually close, allowing RMP restoration.
			</p>
			<h2>The Bigger Picture</h2>
			<p>
				Action potentials are how excitable cells propagate signals to neighboring cells. While frequently modeled by the neuron,
				action potentials occur in any excitable cell. The heart, for example, propagates action potentials across cardiac muscles
				to coordinate a heartbeat. 
			</p>
			<h2>Toxicology</h2>
			<p>
				Tetrodotoxin is a potent neurotoxin produced by animals such as rough-skinned newts, pufferfish, and blue-ringed octopuses.
				It acts by blocking voltage-gated sodium channels. Without the ability for the membrane permeability of axons' sodium to 
				increase upon reaching a threshold, an action potential can never fire, preventing the propagation of signals along axons. 
				In small doses on non-vital neurons, a tingling sensation and loss of motor control occur. In large doses or when applied 
				to vital neurons such as those in the autonomic nervous system, the toxin can disrupt vital physiological processes leading 
				to death. No amount of graded potentials will cause action potentials if depolarization by voltage-gated sodium channels 
				cannot occur.
			</p>
			<h3>Take it Further</h3>
			<ul>
				<li>A collection of peptide toxins produced by cnidarians block the voltage-gated potassium channel. What effect would these have on an action potential?</li>
				<li>A fictional toxin causes the voltage-gated potassium channels to open and close just as fast as the sodium channels. What would happen?</li>
				<li>A drug inhibits the sodium-potassium pump. How does that affect an action potential? (hint: look at the pharmacology section of the resting membrane potential page)</li>
			</ul>
		</div>)
	}

	renderForm = () => {
		const {
			membranePotential
		} = this.state;

		return (
			<Form>
				<Form.Group>
					<Form.Label dangerouslySetInnerHTML={{__html: `<strong>E<sub>m</sub></strong>`}}></Form.Label>
					<Form.Control value={membranePotential.toFixed(1)} type="number" disabled />
				</Form.Group>
			</Form>
		)
	}

	renderReferences = () => {
		return (
			<div>
				<hr />
				<small>
					<ol style={{paddingLeft:"1em", maxWidth:"60em"}}>
						<li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3663409/" target="_blank"  rel="noreferrer">Geffeney, S. L., Ruben, P. C. (2006). The Structural Basis and Functional Consequences of Interactions Between Tetrodotoxin and Voltage-Gated Sodium Channels. <em>Mar Drugs</em> 2006 Apr; 4(3): 143–156. Published online 2006 Apr 6. Retrieved November 25, 2020 from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3663409/</a></li>
						<li>Greene, M. (2020). <i>Lectures 8 &amp; 9 Graded and Action Potentials</i>, lecture notes, BIOL3225 Human Physiology BIOL3225, University of Colorado Denver, delivered 09 Sep 2020 &amp; 16 Sep 2020</li>
						<li><a href="http://www.nernstgoldman.physiology.arizona.edu/" target="blank">The Nernst/Goldman Equation Simulator. (n.d.). Retrieved October 22, 2020, from http://www.nernstgoldman.physiology.arizona.edu/</a></li>
						<li>Widmaier, E. P., Vander, A. J., Raff, H., &amp; Strang, K. T. (2019). 6.7 Graded and Action Potentials. In <em>Vander's human physiology: The mechanisms of body function</em> (p. 149-158). New York, NY: McGraw-Hill Education.</li>
						<li><a href="https://journals.physiology.org/doi/full/10.1152/advan.00029.2004" target="blank">Wright, S. H. (2004). Generation of resting membrane potential. <em>Advances in Physiology Education</em>, 28(4), 139-142. doi:10.1152/advan.00029.2004</a></li>
						<li><a href="https://www.ncbi.nlm.nih.gov/books/NBK538143/" target="blank">Grider, M. (2020, September 10). Physiology, Action Potential. Retrieved November 03, 2020, from https://www.ncbi.nlm.nih.gov/books/NBK538143/</a></li>
					</ol>
				</small>
			</div>
		)
	}

	render = () => {
		const {
			running,
			firing
		} = this.state;
		return (
			<div>
				<Row>
					<Col xs={12} sm={12} md={6}>{this.renderDescription()}</Col>
					<Col xs={12} sm={12} md={6}>
						<Row>
							<Col>
								<img alt="Graph of action potential with meaningful events labeled" src={Helpers.buildPublicUrl("actionpotential.svg")}></img>
							</Col>
						</Row>
						<Row>
							<Col>					
								<p>
									The form and graph on this page can be used to visualize how an action potential changes the membrane potential of a cell. Click
									"Fire an action potential!" to propagate an action potential through an infinitesimally small section of a standard human neuron.
								</p>
							</Col>
						</Row>
						<Row>
							<Col>{this.renderForm()}</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button disabled={firing} variant="danger" onClick={this.handleFireActionPotential}>Fire an action potential!</Button>
							</Col>
						</Row>
						<Row>
							<Col>{this.renderChart()}</Col>
						</Row>
						<Row>
							{!!running && <Button variant="danger" onClick={this.stopLoop}><StopFill /> Stop</Button>}
							{!running && <Button variant="success" onClick={this.startLoop}><PlayFill /> Play</Button>}
							<Button variant="dark" disabled onClick={this.resetLoop}><ArrowCounterclockwise /> Reset</Button>
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

export default ActionPotentialPage;