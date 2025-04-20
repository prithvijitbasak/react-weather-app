import "../assets/styles/Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer-wrapper">
        <div className="pb-container">
          <div className="footer-contents">
            <p className="footer-text">
              Designed and Developed by{" "}
              <a href="https://prithvijitbasak.netlify.app/" target="blank" className="name-text">
                Prithvijit Basak
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
