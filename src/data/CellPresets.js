export default [
	{ 
		name: "Default",
		potassium: {
			concentrationOut: 10,
			concentrationIn: 100,
			permeability: 100
		},
		sodium: {
			concentrationOut: 100,
			concentrationIn: 10,
			permeability: 1
		},
		chloride: {
			concentrationOut: 100,
			concentrationIn: 10,
			permeability: 10
		},
		T: 37
	},
	{ 
		name: "Generic Cell",
		potassium: {
			concentrationOut: 4.5,
			concentrationIn: 120,
			permeability: 100
		},
		sodium: {
			concentrationOut: 145,
			concentrationIn: 15,
			permeability: 5
		},
		chloride: {
			concentrationOut: 116,
			concentrationIn: 20,
			permeability: 10
		},
		T: 37 
	},
	{ 
		name: "Skeletal Muscle",
		potassium: {
			concentrationOut: 4.5,
			concentrationIn: 150,
			permeability: 100
		},
		sodium: {
			concentrationOut: 145,
			concentrationIn: 12,
			permeability: 12
		},
		chloride: {
			concentrationOut: 116,
			concentrationIn: 4.2,
			permeability: 1000
		},
		T: 37 
	},
	{ 
		name: "Squid Axon",
		potassium: {
			concentrationOut: 20,
			concentrationIn: 200,
			permeability: 100
		},
		sodium: {
			concentrationOut: 440,
			concentrationIn: 50,
			permeability: 1
		},
		chloride: {
			concentrationOut: 540,
			concentrationIn: 40,
			permeability: 10
		},
		T: 37 
	},
	{ 
		name: "Red Cell",
		potassium: {
			concentrationOut: 4.5,
			concentrationIn: 140,
			permeability: 100
		},
		sodium: {
			concentrationOut: 145,
			concentrationIn: 11,
			permeability: 54
		},
		chloride: {
			concentrationOut: 116,
			concentrationIn: 80,
			permeability: 21
		},
		T: 37 
	}
]