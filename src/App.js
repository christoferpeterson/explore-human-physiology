import React from "react";
import {Container,Row,Col,Form,Button} from "react-bootstrap";
import Physics from "./Physics";
import CellPresets from "./CellPresets";
import Chart from "./Chart";

const CUSTOM_INDEX = -1;
const HISTORY_INTERVAL = 200;
const HISTORY_LENGTH = 60;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      preset: 0,
      ionConcentrationOutside: 10,
      ionConcentrationInside: 100,
      temperature: 37,
      equilibriumPotential: -61.5,
      history: [],
      startTime: new Date(),
    }

    for (let index = -HISTORY_LENGTH; index < 0; index++) {
      this.state.history.push({x: index, y: this.state.equilibriumPotential})
    }
  }

  componentDidMount = () => {
    this.updateHistoryInterval = setInterval(this.updateHistory, HISTORY_INTERVAL);
  }

  updateHistory = () => {
    const newHistory = [...this.state.history];
    const currentTime = Math.round((new Date() - this.state.startTime) / 1000);
    newHistory.push({x: currentTime, y: this.state.equilibriumPotential});

    if(newHistory.length > HISTORY_LENGTH) {
      newHistory.shift();
    }

    this.update({history: newHistory});
  }

  update = (newState, updateEquilibriumPotential) => {
    const updatedState = {...this.state, ...newState};
    if(!!updateEquilibriumPotential) {
      updatedState.equilibriumPotential = Physics.calculateNernst(updatedState)
    }
    this.setState(updatedState);
  }

  updatePreset = (event) => {
    const presetIndex = event.target.value;
    const preset = CellPresets[presetIndex];
    console.log(event,preset, presetIndex, CellPresets);
    const newState = {
      preset: presetIndex,
      ionConcentrationOutside: preset.KConcentrationOut,
      ionConcentrationInside: preset.KConcentrationIn,
      temperature: preset.T
    };
    this.update(newState, true);
  }

  rangeInput = (props) => {
    const {
      variableName,
      min,
      max,
      label
    } = props;

    const value = this.state[variableName];

    const onChange = (event) => {
      const newState = {preset: CUSTOM_INDEX};
      newState[variableName] = Math.max(Math.min(event.target.valueAsNumber, max), min);
      this.update(newState, true);
    }

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control value={value} min={min} max={max} type="number" onChange={onChange} />
      </Form.Group>
    )
  }

  render = () => {
    const {
      equilibriumPotential,
      preset,
      history
    } = this.state;

    return (
      <Container className="App">
        <Row>
          <Col>
            <h1>Equilibrium Potential</h1>
            <Form>
              <Form.Group>
                <Form.Label>Presets</Form.Label>
                <Form.Control as="select" custom value={preset} onChange={this.updatePreset}>
                  {CellPresets.map((value,index) => (<option key={index} value={index}>{value.name}</option>))}
                  <option value={CUSTOM_INDEX}>Custom</option>
                </Form.Control>
              </Form.Group>
              {this.rangeInput({label: "Ion Concentration Outside of the Cell", variableName: "ionConcentrationOutside", min: 1, max: 600})}
              {this.rangeInput({label: "Ion Concentration Inside of the Cell", variableName: "ionConcentrationInside", min: 1, max: 200})}
              {this.rangeInput({label: "Temperature of the System (°C)", variableName: "temperature", min: 0, max: 100})}
              <Form.Group>
                <Form.Label>Equilibrium Potential of K<sup>+</sup></Form.Label>
                <Form.Control value={equilibriumPotential.toFixed(1)} type="number" disabled />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart chartTitle={"Equilibrium Potential"} data={history} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
