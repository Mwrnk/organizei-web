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
  }

  li img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }
`;

export const SecondaryNavMenu = styled.div`
  display: flex;

  ul {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: #E9E8E8;
    transition: background 0.3s;
    cursor: pointer;
    padding: 0;
    border: none;
  }

  li:hover {
    background: #d1d1d1;
  }

  li img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
    filter: none;
    transition: filter 0.3s;
  }

  .avatar-li {
    background: none !important;
    border: none !important;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .avatar-li img {
    width: 52px;
    height: 52px;
    border-radius: 19px;
    object-fit: cover;
    filter: none !important;
    border: none !important;
    background: none !important;
    display: block;
    margin: 0;
    padding: 0;
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
