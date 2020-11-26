import React from "react";
import {Row,Col,Button} from "react-bootstrap";
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

	renderDescription = () => {
		return(
			<div>
				<h1>Sarcomere</h1>
				<p>The functional unit of the muscular system is the sarcomere. A sarcomere is a highly organized arrangement of
					proteins which can shorten during muscle contraction. The collective effort of a sarcomere within a muscle fiber
					causes the overall contraction.
				</p>
				<h2>Anatomy</h2>
				<p>
					Z-disks, relatively thick bundles of proteins, flank the sarcomere and provider anchorage to the rest of the structure.
					The outer border is composed of a series of thin filaments. A thin filament is composed of a chain of
					actin proteins wrapped in tropomyosin. It also contains the regulatory protein troponin which is used
					to coordinate and control muscle contraction. Surrounded by the thin filaments is a thick filament. The thick filament
					is a bundle of myosin proteins. Myosin is a long protein with a bulbous head. The thick filament is anchored to the
					z-disk by titin, a springy protein which contributes to muscle elasticity.
				</p>
				<p>
					There are several zones in the sarcomere that make it easier to explain how sarcomere contraction occurs. The Z-disk
					is the anchor point on either side. The M-line is the center of the sarcomere. The H-zone is the area in the center of the
					sarcoemre between two adjacent thin filaments. The I-band is the space between the Z-disk and the thick filament. Finally,
					the A-band is the area containing the thick filament.
				</p>
				<h2>Contraction</h2>
				<p>
					Calcium released by the myofibril sarcoplasmic reticulum increases the concentration of calcium in the cytosol. As the 
					concentration increases, the likelihood of calcium binding to troponin, the regulatory protein, increases. Once calcium
					binds to troponin, a conformation change occurs in tropomyosin, exposing the myosin-actin binding site.
				</p>
			</div>
		);
	}

	render() {
		const {resting, canRelease, contractionLevel} = this.state;
		return (
			<div>
				<Row>
					<Col xs={12} sm={12} md={6}>{this.renderDescription()}</Col>
					<Col xs={12} sm={12} md={6}>
						<Button variant="dark" onClick={this.handleContract}>{resting ? "Activate" : canRelease ? "Release" : "Contract"}</Button>
						<div style={{height: "300px", width: "400px"}}>
							<Sarcomere resting={resting} contractionLevel={contractionLevel} />
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default SarcomerePage;