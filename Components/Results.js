import styled from "styled-components";

const Results = ({ improvements }) => {
  if (!improvements || improvements.length === 0) {
    return null;
  }

  return (
    <ResultsContainer>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Issue</TableHeader>
            <TableHeader>Recommendation</TableHeader>
            <TableHeader>Predicted Score Increase</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {improvements.map((improvement, index) => (
            <TableRow key={index}>
              <TableCell>{improvement.issue}</TableCell>
              <TableCell>{improvement.fix}</TableCell>
              <TableCell>{improvement.potentialGain}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ResultsContainer>
  );
};

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableRow = styled.tr`
  text-align: left;
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e1e4e8;
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e1e4e8;
  color: #34495e;
`;

export default Results;
