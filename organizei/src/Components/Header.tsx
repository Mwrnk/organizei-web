import {
  NavMenu,
  HeaderContainer,
  SecondaryNavMenu,
} from "../Style/StyledHeader";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContexts";
import { useEffect, useState } from "react";
import axios from "axios";

import IconNotifacoes from "../../assets/Bell.svg";
import Iconconfig from "../../assets/Settings.svg";
import IconIa from "../../assets/bot.svg";

export function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const [canUseAI, setCanUseAI] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/users/${user._id}/plan`
        );
        const planName = response.data.data?.name?.toLowerCase();

        if (planName === "premium" || planName === "enterprise") {
          setCanUseAI(true);
        } else {
          setCanUseAI(false);
        }
      } catch (error) {
        console.error("Erro ao buscar plano do usuário no Header:", error);
        setCanUseAI(false);
      }
    };

    fetchUserPlan();
  }, [user?._id]);

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
