const R = 8.31446261815324;
const F = 96485.3321233100184;

const CtoK = (temperature) => {
	return temperature + 273.15;
}

const calculateNernst = (props) => {
	const {
		temperature: T,
		ionConcentrationOutside: ionO,
		ionConcentrationInside: ionI,
		z = 1
	} = props;

	return -R * CtoK(T) / z / F * (Math.log(ionI / ionO)) * 1000;
}

export default { R, F, CtoK, calculateNernst };