import styled from "styled-components";
import Link from "next/link";

const Navbar = () => {
  return (
    <NavbarSection>
      <Link href="/" style={{ textDecoration: "none" }}>
        <NavbarTitle>Search Engine Optimizer</NavbarTitle>
      </Link>
    </NavbarSection>
  );
};

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 40px;
  border-bottom: 1px solid #e1e4e8;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const NavbarTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #3498db;
  }
`;

export default Navbar;
