import React from 'react';
import {
	Switch,
	Route,
	Link,
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
								<NavDropdown.Item><Link to="equilibrium-potential">Equilibrium Potential</Link></NavDropdown.Item>
								<NavDropdown.Item><Link to="resting-membrane-potential">Resting Membrane Potential</Link></NavDropdown.Item>
								<NavDropdown.Item><Link to="action-potential">Action Potential</Link></NavDropdown.Item>
								</NavDropdown>
							</Nav.Item>
						</Nav>
					</Col>
				</Row>
				{/* A <Switch> looks through its children <Route>s and
				renders the first one that matches the current URL. */}
				<Switch>
					<Route exact path="/">
						<div>homepage</div>
					</Route>
					<Route path="/equilibrium-potential">
						<EquilibriumPotentialPage />
					</Route>
					<Route path="/resting-membrane-potential">
						<RestingMembranePotentialPage />
					</Route>
					<Route path="/action-potential">
						<ActionPotentialPage />
					</Route>
          <Route component={() => (<div>404 Not found </div>)} />
				</Switch>
			</Container>
		</div>
	);
}

export default App;