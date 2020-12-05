import React from "react";

const LabelledSarcomere = () => {
	const solidLineStyle = { stroke:"black", strokeWidth: 2 };
	const dashedLineStyle = { strokeWidth: 2, strokeDasharray: "5", stroke: "grey" };
	const textStyle = { font: "bold 1.25em sans-serif", textAnchor: "middle" };
	return (
		<svg viewBox="0 0 800 350" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<g id="m-line">
					<line style={solidLineStyle} y1="0" x2="0" y2="175" />
					<rect width="75" height="30" fill="white" x="-30" y="10"></rect>
					<text style={textStyle}  y="32">M-line</text>
				</g>
				<rect id="actin2" width="300" height="8" stroke="darkblue" fill="blue" strokeWidth="1" />
      <ellipse id="myosin2-head" rx="20" ry="10" stroke="red" fill="pink" strokeWidth="2" transform={`rotate(45)`} />
      <rect id="myosin2-body" height="10" width="10" stroke="red" fill="pink" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <g id="myosin2">
        <use xlinkHref="#myosin2-body" transform="translate(260, 56) scale(14, 1)" />
        <use xlinkHref="#myosin2-body" transform="translate(220, 66) scale(18, 1)" />
        <use xlinkHref="#myosin2-body" transform="translate(180, 76) scale(22, 1)" />
        <use xlinkHref="#myosin2-body" transform="translate(140, 86) scale(26, 1)" />
        <use xlinkHref="#myosin2-head" transform="translate(140, 80)" />
        <use xlinkHref="#myosin2-head" transform="translate(180, 70)" />
        <use xlinkHref="#myosin2-head" transform="translate(220, 60)" />
        <use xlinkHref="#myosin2-head" transform="translate(260, 50)" />
      </g>
      <circle id="spring-ring2" r="8" fill="transparent" strokeWidth="2" stroke="green" />
      <g id="titin2">
        <use xlinkHref="#spring-ring2" transform="translate(17, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(27, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(37, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(47, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(57, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(67, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(77, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(87, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(97, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(107, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(117, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(127, 0)" />
        <use xlinkHref="#spring-ring2" transform="translate(137, 0)" />
      </g>
      <g id="half-sarcomere2">
        <g id="sliding-filament2" transform={`translate(0, 0)`}>
          <rect width="8" height="200" stroke="black" fill="black" strokeWidth="1"/>
          <use xlinkHref="#actin2" transform="translate(8, 0)" />
          <use xlinkHref="#actin2" transform="translate(8, 192)" />
          <use xlinkHref="#titin2" transform="translate(0, 100)" />
        </g>
        <use xlinkHref="#myosin2" />
        <use xlinkHref="#myosin2" transform="scale(1, -1) translate(0 -192)" />
      </g>
      <g id="sarcomere2">
        <use xlinkHref="#half-sarcomere2"/>
        <use xlinkHref="#half-sarcomere2" transform="scale(-1, 1) translate(-800, 0)" />
      </g>
			</defs>
			
			<use xlinkHref="#m-line" transform="translate(400, 0)" />
			
			<line style={solidLineStyle} x1="308" y1="267" x2="308" y2="317" />
			<line style={solidLineStyle} x1="492" y1="267" x2="492" y2="317" />
			<line style={dashedLineStyle} x1="308" y1="292" x2="492" y2="292" />
			<rect width="75" height="30" fill="white" x="364" y="280"></rect>
			<text style={textStyle} x="400" y="300">H-zone</text>
			
			<line style={solidLineStyle} x1="135" y1="267" x2="135" y2="350" />
			<line style={dashedLineStyle} x1="0" y1="312" x2="135" y2="312" />
			<rect width="67" height="30" fill="white" x="28" y="300"></rect>
			<text style={textStyle} x="60" y="320">I-band</text>
			
			<line style={dashedLineStyle} x1="135" y1="335" x2="665" y2="335" />
			<line style={solidLineStyle} x1="665" y1="267" x2="665" y2="350" />
			<rect width="75" height="30" fill="white" x="364" y="320"></rect>
			<text style={textStyle} x="400" y="340">A-band</text>
			
			<line style={dashedLineStyle} x1="35" y1="45" x2="0" y2="75" />
			<text style={textStyle} x="60" y="40">Z-disk</text>
			
			<line style={dashedLineStyle} x1="645" y1="45" x2="592" y2="70" />
			<text style={textStyle} x="675" y="45">actin2</text>
			<use xlinkHref="#sarcomere2" transform="translate(0, 75)" />
			
			<line style={dashedLineStyle} x1="135" y1="135" x2="300" y2="175" />
			<text style={textStyle} x="90" y="130">myosin2</text>
		</svg>
	)
}

export default LabelledSarcomere;