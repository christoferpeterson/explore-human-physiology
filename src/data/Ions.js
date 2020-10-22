export default [
	{ 
		displayName: "Potassium", 
		propertyName: "potassium", 
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