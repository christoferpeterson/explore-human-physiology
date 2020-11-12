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

const calculateGoldman = (props) => {
	const {
		temperature: T,
		sodium: {
			permeability: permNa,
			concentrationOut: cOutNa,
			concentrationIn: cInNa
		},
		chloride: {
			permeability: permCl,
			concentrationOut: cOutCl,
			concentrationIn: cInCl
		},
		potassium: {
			permeability: permK,
			concentrationOut: cOutK,
			concentrationIn: cInK
		}
	} = props;

	return -R * CtoK(T) / F * Math.log((permK * cInK + permNa * cInNa + permCl * cOutCl) / (permK * cOutK + permNa * cOutNa + permCl * cInCl)) * 1000;
}

const Physics = { R, F, CtoK, calculateNernst, calculateGoldman };

export default Physics;