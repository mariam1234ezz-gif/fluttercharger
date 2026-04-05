import { FaLinkedin, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark-bg py-8 px-4 text-center">
      <p className="text-gray-300 mb-6">
        Follow <span className="text-white font-semibold">INNOVATRONICS</span>
      </p>

      <div className="flex justify-center gap-6">

        <a href="https://www.linkedin.com/in/innovatronics-team-522a303a2?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>

        <a href="https://www.instagram.com/innovatronics_ecu?igsh=MWN2aG8ybjByczl4OQ==" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>

        <a href="https://www.tiktok.com/@innovatronics_team?_r=1&_t=ZS-95HvHomttlF" target="_blank" rel="noopener noreferrer">
          <FaTiktok />
        </a>

        <a href="https://www.facebook.com/share/1GAAY6RPDJ/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>

      </div>
      <p className="text-gray-400 text-sm mt-6">
  Developed by{" "}
  <span className="text-white font-medium">
    Innovatronics
  </span>{" "}
  © 2026
</p>
    </footer>
  );
}