import styled from "styled-components";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
