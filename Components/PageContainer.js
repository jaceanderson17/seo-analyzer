import styled from "styled-components";
import Navbar from "./Navbar";

const PageContainer = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <MainContent>{children}</MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: #f5f6fa;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 0;
`;

export default PageContainer;
