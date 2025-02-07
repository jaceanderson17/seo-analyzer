import styled from "styled-components";
import Head from "next/head";
import PageContainer from "@/Components/PageContainer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Search Engine Optimizer</title>
        <meta
          name="description"
          content="We improve your SEO by analyzing your website and providing you with a score and a list of recommendations to improve your SEO."
        />
      </Head>
      <PageContainer>
        <Container>
          <ContentWrapper>
            <Header>Welcome to the Search Engine Optimizer</Header>
            <SubHeader>
              Simply enter a website URL and we'll give you a score and a list
              of recommendations to improve your SEO.
            </SubHeader>
            <SearchBar>
              <Input placeholder="Enter website URL..." />
              <Button>Search</Button>
            </SearchBar>
          </ContentWrapper>
        </Container>
      </PageContainer>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  text-align: center;
  gap: 20px;
`;

const Header = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubHeader = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #666;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 16px;
  color: black;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  background-color: blue;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: darkblue;
  }
`;
