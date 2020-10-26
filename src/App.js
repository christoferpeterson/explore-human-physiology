import React from 'react';
import {
	Switch,
	Route,
	useLocation
} from "react-router-dom";
import {Container,Row,Col,Nav,Navbar,NavDropdown} from "react-bootstrap";
	
import EquilibriumPotentialPage from './Potentials/EquilibriumPotentialPage';
import RestingMembranePotentialPage from './Potentials/RestingMembranePotentialPage';
import ActionPotentialPage from './Potentials/ActionPotentialPage';

function App() {
	const path = useLocation();
	return (
		<div>
			<Navbar bg="light" expand="lg">
				<Container>
					<Row>
						<Col>
							<Navbar.Brand href="/">Explore Human Physiology</Navbar.Brand>
						</Col>
					</Row>
				</Container>
			</Navbar>
			<Container className="App">
				<Row>
					<Col>
						<Nav>
							<Nav.Item>
								<NavDropdown title="Potentials">
								<NavDropdown.Item href="/equilibrium-potential">Equilibrium Potential</NavDropdown.Item>
								<NavDropdown.Item href="/resting-membrane-potential">Resting Membrane Potential</NavDropdown.Item>
								<NavDropdown.Item href="/action-potential">Action Potential</NavDropdown.Item>
								</NavDropdown>
							</Nav.Item>
						</Nav>
					</Col>
				</Row>
				{/* A <Switch> looks through its children <Route>s and
				renders the first one that matches the current URL. */}
				<Switch>
					<Route path="/equilibrium-potential">
						<EquilibriumPotentialPage />
					</Route>
					<Route path="/resting-membrane-potential">
						<RestingMembranePotentialPage />
					</Route>
					<Route path="/action-potential">
						<ActionPotentialPage />
					</Route>
				</Switch>
			</Container>
		</div>
	);
}

export default App;