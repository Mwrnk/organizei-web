import {
  NavMenu,
  HeaderContainer,
  SecondaryNavMenu,
  StyledLink,
  LogoLink,
  ProfileImage,
  ProfilePlaceholder
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
        <LogoLink to="/escolar">
          Organiz.ei
        </LogoLink>
      </div>

      <NavMenu>
        <ul>
          <StyledLink to="/escolar">
            <li>Escolar</li>
          </StyledLink>
          
          <StyledLink to="/games">
            <li>Games</li>
          </StyledLink>
          
          <StyledLink to="/comunidade">
            <li>Comunidade</li>
          </StyledLink>
          
          <StyledLink to="/planos">
            <li>Planos</li>
          </StyledLink>
        </ul>
      </NavMenu>

      <SecondaryNavMenu>
        <ul>
          <StyledLink to={canUseAI ? "/ia" : "#"}>
            <li className={!canUseAI ? "disabled" : ""}>
              <img src={IconIa} alt="IA" />
            </li>
          </StyledLink>
          
          <StyledLink to="/notificacoes">
            <li>
              <img src={IconNotifacoes} alt="Notificações" />
            </li>
          </StyledLink>
          
          <StyledLink to="/configuracoes">
            <li>
              <img src={Iconconfig} alt="Configurações" />
            </li>
          </StyledLink>
          
          <StyledLink to="/perfil">
            <li className="avatar-li">
              {user?.profileImage ? (
                <ProfileImage
                  src={user.profileImage}
                  alt="Perfil"
                />
              ) : (
                <ProfilePlaceholder>
                  {user?.name ? user.name[0].toUpperCase() : 'P'}
                </ProfilePlaceholder>
              )}
            </li>
          </StyledLink>
        </ul>
      </SecondaryNavMenu>
    </HeaderContainer>
  );
}
