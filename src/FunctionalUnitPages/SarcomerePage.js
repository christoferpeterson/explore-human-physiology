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
					Z-disks, relatively thick bundles of proteins, flank the sarcomere and provider anchorage to the rest of the 
					structure. The outer border is composed of a series of thin filaments. A thin filament is composed of a chain 
					of actin proteins wrapped in tropomyosin. It also contains the regulatory protein troponin, which coordinates 
					and controls muscle contraction. The thin filaments surround a thick filament, a bundle of myosin proteins. 
					Myosin is a long protein with a bulbous head. The thick filament is anchored to the z-disk by titin, a springy 
					protein contributing to muscle's elasticity.
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
					Adenosine triphosphate (ATP) bound to myosin heads undergoes phosphorylation, which changes the myosin's conformation 
					into a high-energy state. The high-energy myosin heads spontaneously bind to the exposed binding site. The myosin head 
					releases Adenosine diphosphate (ADP) and the phosphoric acid (P<sub>i</sub>), causing a conformation back to its low 
					energy state. Because the myosin is bound to actin, the myosin head pulls the thin filament toward the M-line, also 
					known as the power stroke. ATP binds to myosin again, releasing the actin-myosin bond. The natural elasticity of the 
					sarcomere proteins and antagonist muscles' action return the sarcomere to its original state.
				</p>
				<h2>The Bigger Picture</h2>
				<p>
					The sarcomere is the functional unit of all muscle cells in the body. While skeletal muscles are the most common muscle 
					type, sarcomeres are also present in smooth and cardiac muscle tissue. Sarcomere arrangement, relative to each other, 
					allows smooth muscle fibers to constrict tubes. Waves of contraction in the smooth muscle surrounding a hollow organ are 
					how the body moves substances through the organ, a phenomenon known as peristalsis. The coordinated contraction of muscle 
					cells in the heart creates a synchronized squeeze that circulates blood throughout the body.
				</p>
				<h2>Post Mortem</h2>
				<p>
					When a muscle cell dies, it no longer produces the necessary ATP required to detach the myosin from the action. In 
					conjunction with the release of calcium from the dead or dying sarcoplasmic reticulum, the sarcomere will spontaneously 
					contract. Eventually, the cell will use up its available ATP, and the contracting sarcomere will lose its ability to 
					relax. When a muscle cell is contracted but does not have ATP to detach the myosin, it is in a state of rigor mortis. 
					A person suffering from rigor mortis will have stiff joints and will not control the muscle contraction. When a person 
					dies, their entire body gets put into a state of rigor mortis. Rigor mortis in the deceased usually lasts one to four
					days when the sarcomere's filaments begin to breakdown, or the cumulative number of myosin heads that spontaneously 
					release is enough to loosen the muscles.
				</p>
				<h2>Take it Further</h2>
				<ul>
					<li>Try to think of ways to arrange smooth muscle's sarcomeres so they can pinch off tubes on demand.</li>
					<li>Attempt to arrange sarcomeres in ways where their coordinated contraction may perform different mechanical functions.</li>
					<li>Why do skeletal muscles need antagonists? For example, why do we have biceps on the anterior side of the arm and triceps on the posterior?</li>
					<li>Consider a muscle-relaxing drug. What physiological components of the sarcomere could it target to prevent a muscle from contracting?</li>
				</ul>
			</div>
		);
	}

	renderReferences = () => {
		return (
			<div>
				<hr />
				<small>
					<ol style={{paddingLeft:"1em", maxWidth:"60em"}}>
						<li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1393748/pdf/jphysiol01486-0070.pdf" target="_blank"  rel="noreferrer">Bate-Smith, E. C., &amp; Bendall, J. R. (1947). Rigor mortis and adenosine-triphosphate. <em>The Journal of Physiology</em>, 106(2), 177-185. doi:10.1113/jphysiol.1947.sp004202</a></li>
						<li>Greene, M., Bertolatus, D. (2020). <i>Lectures 11, 12 &amp; 13 Skeletal Muscle</i>, lecture notes, BIOL3225 Human Physiology BIOL3225, University of Colorado Denver, delivered 28 Sep 2020, 30 Sep 2020, &amp; 05 Aug 2020</li>
						<li><a href="https://jcs.biologists.org/content/118/11/2381.long" target="_blank"  rel="noreferrer">Herrera, A. M. (2005). `Sarcomeres' of smooth muscle: Functional characteristics and ultrastructural evidence. <em>Journal of Cell Science</em>, 118(11), 2381-2392. doi:10.1242/jcs.02368</a></li>
						<li>Widmaier, E. P., Vander, A. J., Raff, H., &amp; Strang, K. T. (2019). 6.7 Sliding-Filament Mechanism. In <em>Vander's human physiology: The mechanisms of body function</em> (p. 267-269). New York, NY: McGraw-Hill Education.</li>
					</ol>
				</small>
			</div>
		)
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
				<Row>
					<Col>{this.renderReferences()}</Col>
				</Row>
			</div>
		);
	}
}

export default SarcomerePage;