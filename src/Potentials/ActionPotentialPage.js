import React from "react";
import {Row,Col,Form,Button,InputGroup} from "react-bootstrap";
import Physics from "../Physics";
import CellPresets from "../data/CellPresets";
import Chart from "../Chart";
import { StopFill, PlayFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import RangeInput from '../Shared/RangeInput';
import Ions from '../data/Ions';

const Constants = {
	HISTORY_INTERVAL: 200,
	HISTORY_LENGTH: 100
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
			output.push({x: index * LOOP_INTERVAL / 1000, y: state.restingMembranePotential})
		}
		return output;
	}

	componentDidMount = () => {
		this.lastLoopRun = new Date();
		this.totalTimeElapsed = 0;
		this.loopInterval = setInterval(this.updateLoop, LOOP_INTERVAL);
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
			newSodiumChannelRate = 3750
			newPotassiumChannelRate = 250;
			newGradedPotential = 0;
		}

		if(membranePotential >= 0 && goingUp) {
			newSodiumChannelRate = -1675;
		}

		if(membranePotential <= -30 && goingDown) {
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
		this.update({sodiumChannelRate: 100, firing: true}, () => setTimeout(() => this.update({firing: false}), 1000));
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

		return(<Chart chartTitle={"Membrane Potential vs. Time"} data={history} options={chartOptions} />)
	}

	renderDescription = () => {
		return (<div>
			<h1>Action Potential</h1>
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

	render = () => {
		const {
			running,
			firing
		} = this.state;
		return (
			<Row>
				<Col xs={12} sm={12} md={6}>{this.renderDescription()}</Col>
				<Col xs={12} sm={12} md={6}>
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
						{!!running && <Button variant="danger" onClick={this.stopHistory}><StopFill /> Stop</Button>}
						{!running && <Button variant="success" onClick={this.startHistory}><PlayFill /> Play</Button>}
						<Button variant="dark" onClick={this.resetHistory}><ArrowCounterclockwise /> Reset</Button>
					</Row>
				</Col>
			</Row>
		);
	}
}

export default ActionPotentialPage;