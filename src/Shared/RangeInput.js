import React from "react";
import {Row,Col,Form,Button,InputGroup} from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const RangeInput = ({
	state = {},
	update = () => {},
	propertyName,
	style="dark",
	variableName,
	min,
	max,
	label,
	logSlider
}) => {
	const value = !!propertyName ? state[propertyName][variableName] : state[variableName];

	const calculateValue = (v) => Math.max(Math.min(v, max), min);
	const calculateLogValue = (v) => Math.max(Math.min(Math.round(Math.pow(10,v)), max), min);
	const getSliderValue = (v) => logSlider ? Math.log10(v) : v;

	const onInputChange = (event) => {
		const newState = {preset: -1};
		const newValue = calculateValue(event.target.valueAsNumber);
		if(!!propertyName) {
			newState[propertyName] = state[propertyName];
			newState[propertyName][variableName] = newValue
		}
		else
			newState[variableName] = newValue;
		update(newState, true);
	};

	const onSliderChange = (event) => {
		const newState = {preset: -1};
		const newValue = (logSlider ? calculateLogValue : calculateValue)(event.target.valueAsNumber);
		if(!!propertyName) {
			newState[propertyName] = state[propertyName];
			newState[propertyName][variableName] = newValue
		}
		else
			newState[variableName] = newValue;
		update(newState, true);
	}

	const decrement = () => {
		const newState = {preset: -1};
		const newValue = calculateValue(value-1);
		if(!!propertyName) {
			newState[propertyName] = state[propertyName];
			newState[propertyName][variableName] = newValue
		}
		else
			newState[variableName] = newValue;
		update(newState, true);
	}

	const increment = () => {
		const newState = {preset: -1};
		const newValue = calculateValue(value+1);
		if(!!propertyName) {
			newState[propertyName] = state[propertyName];
			newState[propertyName][variableName] = newValue
		}
		else
			newState[variableName] = newValue;
		update(newState, true);
	}

	return (
		<Form.Group>
			<Row>
				<Col xs={2} sm={2}><strong><Form.Label dangerouslySetInnerHTML={{__html: label}} /></strong></Col>
				<Col xs={10} sm={10} md={4}>
					<InputGroup size="sm">
							<InputGroup.Prepend>
								<Button disabled={value == min} variant={style} onClick={decrement}>-</Button>
							</InputGroup.Prepend>
							<Form.Control value={value} min={min} max={max} type="number" onChange={onInputChange} />
							<InputGroup.Append>
								<Button disabled={value == max} variant={style} onClick={increment}>+</Button>
							</InputGroup.Append>
					</InputGroup>
				</Col>
				<Col xs={12} sm={12} md={6}>
					<RangeSlider 
						variant={style} 
						value={getSliderValue(value)} 
						min={getSliderValue(min)} 
						max={getSliderValue(max)} 
						step={logSlider ? 0.01 : 1} 
						onChange={onSliderChange}
						tooltip="off" />
				</Col>
			</Row>
		</Form.Group>
	)
}

export default RangeInput;