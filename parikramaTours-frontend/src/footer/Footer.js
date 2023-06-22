import "./footer.css";
import logo from "./../images/parikrama_footer_img.jpg";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer__logo">
          <img src={logo} alt="Parikrama logo" />
        </div>
        <ul className="footer__nav">
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">Download apps</a>
          </li>
          <li>
            <a href="#">Become a guide</a>
          </li>
          <li>
            <a href="#">Careers</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <p className="footer__copyright">&copy; by Prathamesh Nadhe.</p>
      </footer>
    </>
  );
}

export default Footer;
