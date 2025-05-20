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
  const { currentPlan, isLoading } = useAuth();

  if (isLoading) return null; // ou um spinner se preferir

  const canUseAI = currentPlan === "premium" || currentPlan === "enterprise";

  return (
    <HeaderContainer>
      <div className="logo">
        <Link to="/perfil" style={{ textDecoration: "none", color: "inherit" }}>
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
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Perfil
            </Link>
          </li>
        </ul>
      </SecondaryNavMenu>
    </HeaderContainer>
  );
}
