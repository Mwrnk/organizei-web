import {
  NavMenu,
  HeaderContainer,
  SecondaryNavMenu,
} from "../Style/StyledHeader";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContexts";
import { getUserPermissions } from "../Types/User";
import IconNotifacoes from "../../assets/Bell.svg";
import Iconconfig from "../../assets/Settings.svg";
import IconIa from "../../assets/bot.svg";

export function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const userPermissions = user ? getUserPermissions(user.role) : null;
  const canAccessAI = userPermissions?.canAccessAI || false;

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
              Profissional
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

      {/* Menu de notificações, configurações e perfil
            
            COLOCAR ICONES E AJUSTAR ESTILIZAÇÃO    
            
            */}
      <SecondaryNavMenu>
        <ul>
          {canAccessAI && (
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
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
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
