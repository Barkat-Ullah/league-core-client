import React from "react";
import HeroSection from "./HeroSection";
import UpcomingTournaments from "./UpcomingTournaments";
import ConcreteFieldStory from "./ConcreteFieldStory";
import HowItWorks from "./HowItWorks";
import WhySmallSidedSoccer from "./WhySmallSidedSoccer";
import ForEveryPlayer from "./ForEveryPlayer";
import CoachesSection from "../proving-camp/sections/CoachesSection";
import Store from "./Store";
import Newsletter from "./Newsletter";

function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingTournaments />
      <ConcreteFieldStory />
      <CoachesSection />
      <Store />
      <HowItWorks />
      <WhySmallSidedSoccer />
      <ForEveryPlayer />
      {/* <FoundersBundle /> */}
      <Newsletter />
    </div>
  );
}

export default Home;
