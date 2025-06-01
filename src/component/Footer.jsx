import '../css/Footer.css';
import logo from '../img/header/logo.svg';
function Footer(){
    return(
        <div className='footer'>
            <div className='footer-logo'>
                <img src={logo} alt="logo" />
            </div>
        </div>
    )
}
export default Footer;
