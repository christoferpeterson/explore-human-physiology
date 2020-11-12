import React from "react";

const Sarcomere = ({contractionLevel = 0, resting = true}) => {
  const myosinHeadRotation = resting ? 0 : (45 + 90 * contractionLevel);
  const filamentShift = 90 * contractionLevel;

  return (
    <svg viewBox="0 0 800 585" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <rect id="actin" width="300" height="8" stroke="darkblue" fill="blue" strokeWidth="1" />
      <ellipse id="myosin-head" rx="20" ry="10" stroke="red" fill="pink" strokeWidth="2" transform={`rotate(${myosinHeadRotation})`} />
      <rect id="myosin-body" height="10" width="10" stroke="red" fill="pink" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <g id="myosin">
        <use xlinkHref="#myosin-body" transform="translate(260, 56) scale(14, 1)" />
        <use xlinkHref="#myosin-body" transform="translate(220, 66) scale(18, 1)" />
        <use xlinkHref="#myosin-body" transform="translate(180, 76) scale(22, 1)" />
        <use xlinkHref="#myosin-body" transform="translate(140, 86) scale(26, 1)" />
        <use xlinkHref="#myosin-head" transform="translate(140, 80)" />
        <use xlinkHref="#myosin-head" transform="translate(180, 70)" />
        <use xlinkHref="#myosin-head" transform="translate(220, 60)" />
        <use xlinkHref="#myosin-head" transform="translate(260, 50)" />
      </g>
      <circle id="spring-ring" r="8" fill="transparent" strokeWidth="2" stroke="green" />
      <g id="titin">
        <use xlinkHref="#spring-ring" transform="translate(17, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(27, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(37, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(47, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(57, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(67, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(77, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(87, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(97, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(107, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(117, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(127, 0)" />
        <use xlinkHref="#spring-ring" transform="translate(137, 0)" />
      </g>
      <g id="half-sarcomere">
        <g id="sliding-filament" transform={`translate(${filamentShift}, 0)`}>
          <rect width="8" height="200" stroke="black" fill="black" strokeWidth="1"/>
          <use xlinkHref="#actin" transform="translate(8, 0)" />
          <use xlinkHref="#actin" transform="translate(8, 192)" />
          <use xlinkHref="#titin" transform="translate(0, 100)" />
        </g>
        <use xlinkHref="#myosin" />
        <use xlinkHref="#myosin" transform="scale(1, -1) translate(0 -192)" />
      </g>
      <g id="sarcomere">
        <use xlinkHref="#half-sarcomere"/>
        <use xlinkHref="#half-sarcomere" transform="scale(-1, 1) translate(-800, 0)" />
      </g>
    </defs>
    <use xlinkHref="#sarcomere" />
    <use xlinkHref="#sarcomere" transform="translate(0, 192)" />
    <use xlinkHref="#sarcomere" transform="translate(0, 384)" />
    <use xlinkHref="#sarcomere" transform="translate(0, 576)" />
    <use xlinkHref="#sarcomere" transform={`translate(${-790+(filamentShift*2)}, -96)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${-790+(filamentShift*2)}, 96)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${-790+(filamentShift*2)}, 288)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${-790+(filamentShift*2)}, 480)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${790-(filamentShift*2)}, -96)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${790-(filamentShift*2)}, 96)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${790-(filamentShift*2)}, 288)`} />
    <use xlinkHref="#sarcomere" transform={`translate(${790-(filamentShift*2)}, 480)`} />
  </svg>
  )
}

export default Sarcomere;