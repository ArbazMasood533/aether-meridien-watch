import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Philosophy from "@/components/Philosophy";
import Calibre from "@/components/Calibre";
import Showcase from "@/components/Showcase";
import Specs from "@/components/Specs";
import Reserve from "@/components/Reserve";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Philosophy />
        <Calibre />
        <Showcase />
        <Specs />
        <Reserve />
      </main>
      <Footer />
    </>
  );
}
