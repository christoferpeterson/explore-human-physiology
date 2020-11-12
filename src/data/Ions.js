const Ions = [
	{ 
		displayName: "Potassium", 
		propertyName: "potassium",
		style: "primary", 
		shortNameHtml: "K<sup>+</sup>",
		z: 1,
		concentrationOut: {
			max: 600,
			min: 1
		},
		concentrationIn: {
			max: 200,
			min: 1,
			default: 10
		},
		permeability: {
			max: 9999,
			min: 0
		}
	},
	{ 
		displayName: "Sodium",
		propertyName: "sodium",
		style: "danger",
		shortNameHtml: "Na<sup>+</sup>",
		z: 1,
		concentrationOut: {
			max: 600,
			min: 1
		},
		concentrationIn: {
			max: 200,
			min: 1
		},
		permeability: {
			max: 9999,
			min: 0
		}
	},
	{ 
		displayName: "Chloride",
		propertyName: "chloride",
		style: "success",
		shortNameHtml: "Cl<sup>-</sup>",
		z: -1,
		concentrationOut: {
			max: 600,
			min: 1
		},
		concentrationIn: {
			max: 200,
			min: 1
		},
		permeability: {
			max: 9999,
			min: 0
		}
	}
]

export default Ions;