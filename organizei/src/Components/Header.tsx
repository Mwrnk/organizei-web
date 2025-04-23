import {NavMenu} from "../Style/StyledHeader"
export function Header (){
    return(
        <div>
            
            <NavMenu>
                <ul>
                    <li>Escolar</li>
                    <li>Profissonal</li>
                    <li>Comunidade</li>
                    <li>Planos</li>
                </ul>
            </NavMenu>
            <div>
                <ul>
                <li>IA</li>
                <li>Notificacoes</li>
                <li>Configuracoes</li>
                <li>Perfil</li>
                </ul>
            </div>
        </div>

    )

}