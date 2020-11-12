import React from "react";
import {Row,Col,Form,Button,InputGroup} from "react-bootstrap";
import Sarcomere from "../Shared/Sarcomere";

const ANIMATION_SPEED = 2000;
const ANIMATION_INTERVAL = 100;
const CONTRATION_RATE = 1 / (ANIMATION_SPEED / ANIMATION_INTERVAL);

class SarcomerePage extends React.Component {
	constructor() {
		super();
		this.state = {
			contractionLevel: 0, 
			resting: true,
			canRelease: false
		}
	}
	handleContract = () => {
		const {resting, canRelease} = this.state;

		if(resting && !canRelease) {
			this.setState({resting: false});
		}

		if(!resting && !canRelease) {
			this.setState({resting: false})
			this.contractAnimation = setInterval(() => {
				console.log(this.state);
				let { contractionLevel: newContractionLevel } = this.state;
				newContractionLevel += CONTRATION_RATE;
				if(newContractionLevel >= 1) {
					newContractionLevel = 1;
					clearInterval(this.contractAnimation)
					this.setState({canRelease: true})
				}
				this.setState({ contractionLevel: newContractionLevel })
			}, ANIMATION_INTERVAL)
		}

		if(canRelease) {
			this.setState({canRelease: false, resting: true})
			this.releaseAnimation = setInterval(() => {
				let { contractionLevel: newContractionLevel } = this.state;
				newContractionLevel -= CONTRATION_RATE;
				if(newContractionLevel <= 0) {
					newContractionLevel = 0;
					clearInterval(this.releaseAnimation)
				}
				this.setState({ contractionLevel: newContractionLevel })
			}, ANIMATION_INTERVAL)
		}
	}

	render() {
		const {resting, canRelease, contractionLevel} = this.state;
		return (
			<div>
				<h1>Sarcomere</h1>
				<Button variant="dark" onClick={this.handleContract}>{resting ? "Activate" : canRelease ? "Release" : "Contract"}</Button>
				<div style={{height: "300px", width: "400px"}}>
					<Sarcomere resting={resting} contractionLevel={contractionLevel} />
				</div>
			</div>);
	}
}

export default SarcomerePage;