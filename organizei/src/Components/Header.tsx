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
        <Link to="/escolar" style={{ textDecoration: "none", color: "inherit" }}>
          Organiz.ei
        </Link>
      </div>

      <NavMenu>
        <ul>
          <li
            className={location.pathname.includes("/escolar") ? "active" : ""}
          >
            <Link
              to="/escolar"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Escolar
            </Link>
          </li>
          <li
            className={
              location.pathname.includes("/profissional") ? "active" : ""
            }
          >
            <Link
              to="/profissional"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Games
            </Link>
          </li>
          <li
            className={
              location.pathname.includes("/comunidade") ? "active" : ""
            }
          >
            <Link
              to="/comunidade"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Comunidade
            </Link>
          </li>
          <li className={location.pathname.includes("/planos") ? "active" : ""}>
            <Link
              to="/planos"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Planos
            </Link>
          </li>
        </ul>
      </NavMenu>

      <SecondaryNavMenu>
        <ul>
          {canUseAI && (
            <li className={location.pathname === "/ia" ? "active" : ""}>
              <Link
                to="/ia"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={IconIa} />
              </Link>
            </li>
          )}
          <li className={location.pathname === "/notificacoes" ? "active" : ""}>
            <Link
              to="/notificacoes"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={IconNotifacoes} />
            </Link>
          </li>
          <li
            className={location.pathname === "/configuracoes" ? "active" : ""}
          >
            <Link
              to="/configuracoes"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Iconconfig} />
            </Link>
          </li>
          <li className={location.pathname === "/perfil" ? "active" : ""}>
            <Link
              to="/perfil"
              style={{ textDecoration: "none", color: "inherit", display: 'flex', alignItems: 'center' }}
            >
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
            </Link>
          </li>
        </ul>
      </SecondaryNavMenu>
    </HeaderContainer>
  );
}
