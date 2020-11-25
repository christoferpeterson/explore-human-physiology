import React from "react";
import {
	Link
} from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Explore Human Physiology</h1>
      <h2>Nervous System</h2>
      <ul>
        <li><Link to="equilibrium-potential">Equilibrium Potential</Link></li>
        <li><Link to="resting-membrane-potential">Resting Membrane Potential</Link></li>
        <li><Link to="action-potential">Action Potential</Link></li>
      </ul>
      <h2>Muscular System</h2>
      <ul>
        <li><Link to="sarcomere">Sarcomere</Link></li>
      </ul>
    </div>
  )
}

export default HomePage;