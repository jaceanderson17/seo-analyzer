import styled from "styled-components";
import Head from "next/head";
import PageContainer from "@/Components/PageContainer";
import Score from "@/Components/Score";
import Results from "@/Components/Results";
import { useState, useEffect } from "react";
import handleUrlUpload from "@/utils/handleUrlUpload";
import { toast } from "react-toastify";

export default function Home() {
  const [url, setUrl] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ score: 0, improvements: [] });

  const handleSearch = async (urlSearch) => {
    setShowResults(false);
    if (urlSearch.length === 0) {
      toast.error("Please enter a url to optimize");
      return;
    }

    if (selectedPlan === "premium") {
      toast.error("Premium plan requires Google Chrome browser");
      return;
    }

    const result = await handleUrlUpload(urlSearch, selectedPlan);
    if (!result) {
      toast.error("Sorry, the url you attempted to optimize is not valid");
      return;
    }
    console.log(result);
    setResults(result);
    setShowResults(true);
  };

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
              <Input
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                placeholder="Enter website URL..."
              />
              <Button onClick={() => handleSearch(url)}>Search</Button>
            </SearchBar>
            <PlanOptions>
              <PlanButton
                selected={selectedPlan === "basic"}
                onClick={() => setSelectedPlan("basic")}
              >
                Basic
              </PlanButton>
              <PlanButton
                selected={selectedPlan === "standard"}
                onClick={() => setSelectedPlan("standard")}
              >
                Standard
              </PlanButton>
              <PlanButton
                selected={selectedPlan === "premium"}
                onClick={() => setSelectedPlan("premium")}
              >
                Premium
              </PlanButton>
            </PlanOptions>
            {showResults && (
              <>
                <Score score={results.score} />
                <Results improvements={results.improvements} />
              </>
            )}
          </ContentWrapper>
        </Container>
      </PageContainer>
    </>
  );
}
const PlanOptions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const PlanButton = styled.button`
  padding: 12px 24px;
  border: 2px solid #3498db;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.selected ? "#3498db" : "transparent")};
  color: ${(props) => (props.selected ? "white" : "#3498db")};

  &:hover {
    background: ${(props) => (props.selected ? "#2980b9" : "#ebf5ff")};
  }

  &:active {
    transform: scale(0.98);
  }
`;

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
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #2c3e50;
  color: #f5f6fa;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: darkblue;
  }
`;

// const ResultsContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   gap: 20px;
// `;

// const ResultsHeader = styled.div`
//   font-size: 24px;
//   font-weight: 600;
//   color: #2c3e50;
// `;

// const ResultsScore = styled.div`
//   font-size: 48px;
//   font-weight: 700;
//   color: #2c3e50;
// `;

// const ResultsList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
//   width: 100%;
//   max-width: 800px;
//   margin-top: 20px;
// `;

// const ResultItem = styled.div`
//   background-color: #f8f9fa;
//   border-radius: 8px;
//   padding: 20px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// const IssueContainer = styled.div`
//   margin-bottom: 12px;
// `;

// const SolutionContainer = styled.div`
//   border-top: 1px solid #e9ecef;
//   padding-top: 12px;
// `;

// const IssueLabel = styled.span`
//   font-weight: 600;
//   color: #e74c3c;
//   margin-right: 8px;
// `;

// const SolutionLabel = styled.span`
//   font-weight: 600;
//   color: #27ae60;
//   margin-right: 8px;
// `;

// const IssueText = styled.span`
//   color: #2c3e50;
// `;

// const SolutionText = styled.span`
//   color: #2c3e50;
// `;
