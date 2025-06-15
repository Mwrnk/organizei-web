import {
  NavMenu,
  HeaderContainer,
  SecondaryNavMenu,
} from "../Style/StyledHeader";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContexts";

import IconNotifacoes from "../../assets/Bell.svg";
import Iconconfig from "../../assets/Settings.svg";
import IconIa from "../../assets/bot.svg";

export function Header() {
  const location = useLocation();
  const { currentPlan, isLoading, user } = useAuth();

  if (isLoading) return null;
  const canUseAI = currentPlan === "premium" || currentPlan === "enterprise";

  return (
    <HeaderContainer>
      <div className="logo">
        <Link to="/escolar" style={{ textDecoration: "none", color: "inherit" ,fontSize: "22px"}}>
          Organiz.ei
        </Link>
      </div>

      <NavMenu>
        <ul>
          <Link
            to="/escolar"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname.includes("/escolar") ? "active" : ""}>
              Escolar
            </li>
          </Link>
          
          <Link
            to="/games"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname.includes("/games") ? "active" : ""}>
              Games
            </li>
          </Link>
          
          <Link
            to="/comunidade"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname.includes("/comunidade") ? "active" : ""}>
              Comunidade
            </li>
          </Link>
          
          <Link
            to="/planos"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname.includes("/planos") ? "active" : ""}>
              Planos
            </li>
          </Link>
        </ul>
      </NavMenu>

      <SecondaryNavMenu>
        <ul>
          {canUseAI && (
            <Link
              to="/ia"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <li className={location.pathname === "/ia" ? "active" : ""}>
                <img src={IconIa} />
              </li>
            </Link>
          )}
          
          <Link
            to="/notificacoes"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname === "/notificacoes" ? "active" : ""}>
              <img src={IconNotifacoes} />
            </li>
          </Link>
          
          <Link
            to="/configuracoes"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname === "/configuracoes" ? "active" : ""}>
              <img src={Iconconfig} />
            </li>
          </Link>
          
          <Link
            to="/perfil"
            style={{ textDecoration: "none", color: "inherit", display: "block" }}
          >
            <li className={location.pathname === "/perfil" ? "active" : ""}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Perfil"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: 'none',
                    boxShadow: 'none',
                    background: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#888',
                    fontSize: 16,
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'P'}
                </div>
              )}
            </li>
          </Link>
        </ul>
      </SecondaryNavMenu>
    </HeaderContainer>
  );
}
