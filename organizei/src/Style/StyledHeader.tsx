import styled from 'styled-components';

export const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  padding: 0;

  ul {
    display: flex;
    gap: 32px;
    margin: 0;
    padding: 8px 16px;
    background-color: #1d1b20;
    border-radius: 30px;
    list-style: none;
  }

  li {
    color: #ffffff;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 30px;
    transition: background 0.3s, color 0.3s;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background-color: #e9e8e8;
      color: #1d1b20;
    }

    &.active {
      background-color: #ffffff;
      color: #1e1e1e;
      font-weight: bold;
    }
  }
`;
export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
`;

export const SecondaryNavMenu = styled.div`
  display: flex;
  align-items: center;

  ul {
    display: flex;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    cursor: pointer;
    color: #333333;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.3s;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
