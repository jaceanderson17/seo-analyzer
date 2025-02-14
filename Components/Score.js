import { useState, useEffect } from "react";
import styled from "styled-components";

const Score = ({ score }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  return (
    <GaugeContainer>
      <GaugeOuter>
        <GaugeInner score={normalizedScore}>
          <GaugeValue>{normalizedScore}%</GaugeValue>
        </GaugeInner>
      </GaugeOuter>
    </GaugeContainer>
  );
};

const GaugeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const GaugeOuter = styled.div`
  width: 200px;
  height: 100px;
  background: #e0e0e0;
  border-radius: 100px 100px 0 0;
  position: relative;
  overflow: hidden;
`;

const GaugeInner = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.score}%;
  background: ${(props) => {
    if (props.score >= 80) return "#4CAF50";
    if (props.score >= 60) return "#FFC107";
    return "#F44336";
  }};
  transition: height 0.5s ease-in-out;
  border-radius: 100px 100px 0 0;
`;

const GaugeValue = styled.div`
  position: absolute;
  width: 100%;
  bottom: 10px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

export default Score;
