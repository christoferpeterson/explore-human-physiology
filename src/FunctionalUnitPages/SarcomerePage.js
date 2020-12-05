import React from "react";
import {Row,Col,Button} from "react-bootstrap";
import Sarcomere from "../Shared/Sarcomere";
import LabelledSarcomere from "../Shared/LabelledSarcomere";

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
					binds to troponin, a conformation change occurs in troponin and tropomyosin, exposing the myosin-actin binding site.
					Adenosine triphosphate (ATP) bound to myosin heads undergoes phosphorylation which changes the conformation of the myosin 
					putting it into a high-energy state. The high-energy myosin heads spontaneously bind to the exposed binding site. The myosin 
					head releases Adenosine diphosphate (ADP) and the phosphoric acid (P<sub>i</sub>) causing a conformation back to its low energy 
					state. Because the myosin is bound to actin, the myosin head pulls the thin filament toward the M-line, also known as the power
					stroke. ATP binds to myosin again, releasing the actin-myosin bond. The natural elasticity of the sarcomere proteins as well
					as action of antagonist muscles return the sarcomere to its original state.
				</p>
				<h2>The Bigger Picture</h2>
				<p>
					The sarcomere is the functional unit of all muscle cells in the body. While skeletal muscles are the most common type 
					of muscle, sarcomeres are also present in smooth and cardiac muscle tissue. Sarcomere arrangement, in relation to each other,
					allows smooth muscle fibers to constrict tubes. Waves of contraction in the smooth muscle surrounding a tube is how the body
					moves substances through the tubes -- a phenomena known as peristalsis. The coordinated contraction of muscles cells in the heart
					create a synchronized squeeze that circulates blood throughout the body.
				</p>
				<h2>Post Mortem</h2>
				<p>When a muscle cell dies it no longer produces the necessary ATP required to detach the myosin from the action. In conjunction with
					the release of calcium from the dead or dying sarcoplasmic retriculum, the sarocmere will spontaneously contract. Eventually, the
					amount of ATP within the cell will be used up and the contracting sarcomere cannot relax. When a muscle cell is contracted but does
					not have ATP to detach the myosin, it is in a state of rigor mortis. A person suffering from rigor mortis will have stiff joints
					and they will not be able to control the muscle contraction. When a person dies, their entire body gets put into a state of rigor mortis.
					This usually lasts one to four days, until the sarcomere's filaments begin to breakdown or cumulative number of myosin heads that
					spontaneously release is enough to loosen the muscles.
				</p>
				<h2>Take it Further</h2>
				<ul>
					<li>Try to think of how a smooth muscle's sarcomeres may be arranged so they can pinch off tubes on demand.</li>
					<li>Attempt to arrange sarcomeres in ways where their coordinated contraction may perform different mechanical functions.</li>
					<li>Why do skeletal muscles need antagonists? For example, why do we have biceps on the anterior side of the arm and triceps on the posterior?</li>
					<li>You are tasked with making a muscle relaxant drug. What physiological components of the sarcomere can you target to prevent a muscle from contracting?</li>
				</ul>
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
						<Row>
							<Col>
								<div style={{ width: "100%" }}>
									<p>
										Below is a labelled sarcomere. Note the I-band extends to the adjacent sarcomere.
									</p>
									<LabelledSarcomere />
								</div>							
							</Col>
						</Row>
						<Row>
							<Col>
								<p>
									Use the animation below to visualize how a sarcomere contracts. Pressing activate will phosphorylze the ATP bound to the
									myosin to put it in its active state and "bind" it to the actin. Contract will trigger the power stroke. Release
									will bind new ATP to the myosin releasing it from actin, allowing the natural elasticity and the unshown antagonist
									muscle to pull the sarcomere back to its original state.
								</p>
							</Col>
						</Row>
						<Row style={{ marginBottom:"1em" }}>
							<Col>
								<div style={{ width: "100%" }}>
									<Sarcomere resting={resting} contractionLevel={contractionLevel} />
								</div>
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button variant="dark" onClick={this.handleContract}>{resting ? "Activate" : canRelease ? "Release" : "Contract"}</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}

export default SarcomerePage;