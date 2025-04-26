import { NavMenu, HeaderContainer, SecondaryNavMenu } from "../Style/StyledHeader"

export function Header (){
    return(
        <HeaderContainer>
            {/* Logo on left */}
            <div className="logo">
                LOGO
            </div>
            
            {/* Main navigation in center */}
            <NavMenu>
                <ul>
                    <li>Escolar</li>
                    <li>Profissonal</li>
                    <li>Comunidade</li>
                    <li>Planos</li>
                </ul>
            </NavMenu>
            
            {/* Secondary navigation on right */}
            <SecondaryNavMenu>
                <ul>
                    <li>IA</li>
                    <li>Notificacoes</li>
                    <li>Configuracoes</li>
                    <li>Perfil</li>
                </ul>
            </SecondaryNavMenu>
        </HeaderContainer>
    )
}
