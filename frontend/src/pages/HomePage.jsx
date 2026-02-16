import { useRef } from "react";
import "./HomePage.css";
import FirstBlock from "../components/FirstBlock";
import Footer from "../components/sections/Footer";
import Navbar from "../components/Navbar";
import SecondBlock from "../components/SecondBlock";
import FreeTrial from "../components/FreeTrial";
import AboutSection from "../components/sections/AboutSection";
import PricingSection from "../components/sections/PricingSection";
import ContactSection from "../components/sections/ContactSection";


const HomePage = () => {
  const pricingRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        pricingRef={pricingRef}
        contactRef={contactRef}
        aboutUs
        Pricing
        contactUs
        doExam
      />
      <FirstBlock aboutRef={aboutRef} scrollToSection={scrollToSection} />
      <SecondBlock />
      <PricingSection pricingRef={pricingRef} />
      <FreeTrial />
      <ContactSection contactRef={contactRef} />
      <AboutSection aboutRef={aboutRef} />
      <Footer />
    </div>
  );
};

export default HomePage;
