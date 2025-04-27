import styled from "styled-components";

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

export const SecondaryNavMenu = styled.div`
  display: flex;

  ul {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    cursor: pointer;
    color: #333333;
    border-radius: 23px;
    transition: background 0.3s;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 16px;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

export const HeaderContainer = styled.header`
  margin-top: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 20px 20px;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);

  .logo {
    flex: 1;
  }

  ${NavMenu} {
    flex: 2;
    display: flex;
    justify-content: center;
  }

  ${SecondaryNavMenu} {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
`;
