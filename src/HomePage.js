import React from "react";
import {Jumbotron,Button} from "react-bootstrap";
import {
	Link
} from "react-router-dom";

const HomePage = () => {
  return (
    <Jumbotron>
      <h1>Explore Human Physiology</h1>
      <p>An independent project by Christofer Peterson</p>
      <p><small>For Fall 2020 BIOL3225 with Dr. Michael Greene at University of Colorado Denver</small></p>
      <Link to="equilibrium-potential"><Button>Begin Exploring!</Button></Link>
    </Jumbotron>
  )
}

export default HomePage;