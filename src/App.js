import React from 'react';
import {
	Switch,
	Route,
	Link
} from "react-router-dom";
import {Container,Nav,Navbar,NavDropdown,NavLink} from "react-bootstrap";

import { CodeSquare } from 'react-bootstrap-icons';

import HomePage from './HomePage';
import EquilibriumPotentialPage from './PotentialPages/EquilibriumPotentialPage';
import RestingMembranePotentialPage from './PotentialPages/RestingMembranePotentialPage';
import ActionPotentialPage from './PotentialPages/ActionPotentialPage';
import SarcomerePage from './FunctionalUnitPages/SarcomerePage';

function App() {
	return (
		<div>
			<Navbar style={{marginBottom:20}} bg="light" expand="lg">
				<Container>
					<Navbar.Brand href="#">Explore Human Physiology</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<NavDropdown title="Nervous System" id="basic-nav-dropdown">
								<NavDropdown.Item><Link to="equilibrium-potential">Equilibrium Potential</Link></NavDropdown.Item>
								<NavDropdown.Item><Link to="resting-membrane-potential">Resting Membrane Potential</Link></NavDropdown.Item>
								<NavDropdown.Item><Link to="action-potential">Action Potential</Link></NavDropdown.Item>
							</NavDropdown>
							<NavDropdown title="Muscular System" id="basic-nav-dropdown">
								<NavDropdown.Item><Link to="sarcomere">Sarcomere</Link></NavDropdown.Item>
							</NavDropdown>
						</Nav>
						<NavLink style={{paddingLeft:0}} className="ml-auto" href="https://github.com/christoferpeterson/explore-human-physiology" target="_blank"><CodeSquare /> Contribute</NavLink>
						{/* <Form inline>
							<FormControl type="text" placeholder="Search" className="mr-sm-2" />
							<Button variant="outline-success">Search</Button>
						</Form> */}
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Container className="App">
				{/* A <Switch> looks through its children <Route>s and
				renders the first one that matches the current URL. */}
				<Switch>
					<Route exact path="/">
						<HomePage />
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
					<Route path="/sarcomere">
						<SarcomerePage />
					</Route>
          <Route component={() => (<div>404 Not found </div>)} />
				</Switch>
			</Container>
		</div>
	);
}

export default App;