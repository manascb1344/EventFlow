import { Element, Link as LinkScroll } from "react-scroll";
import Button from "@/components/Landing-Button";

interface ButtonProps {
  icon: string;
  markerFill: string;
  href?: string;
  containerClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Hero: React.FC = () => {
  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32 max-sm:pt-24 max-sm:pb-24">
      <Element name="hero">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 max-sm:flex-col">
            <div className="relative z-2 flex-1 max-lg:max-w-388 max-sm:max-w-full">
              <div className="caption small-2 uppercase text-p3 max-sm:text-center">
                Event Management
              </div>
              <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12 max-sm:text-4xl max-sm:text-center max-sm:leading-tight">
                Streamline Your Events
              </h1>
              <p className="max-w-440 mb-14 body-1 max-md:mb-10 max-sm:mb-8 max-sm:text-center max-sm:max-w-full">
                A <strong>comprehensive platform</strong> for managing events from start to finish. Features include <strong>ticketing</strong>, <strong>speaker management</strong>, and <strong>analytics</strong>. Perfect for conference planners and event managers.
              </p>
              <div 
                onClick={() => {}} 
                className="hover:opacity-90 cursor-pointer max-sm:flex max-sm:justify-center"
              >
                <LinkScroll to="features" offset={-100} spy smooth>
                  <Button 
                    icon="/images/zap.svg" 
                    markerFill="#fff"
                    containerClassName="max-sm:w-full"
                    onClick={() => {}}
                  >
                    Get Started
                  </Button>
                </LinkScroll>
              </div>
            </div>
            <div className="flex-1 max-w-[600px] pointer-events-none max-sm:mt-12 max-sm:flex max-sm:justify-center">
              <img
                src="/images/hero.svg"
                className="w-full h-auto rounded-full relative [filter:drop-shadow(0_0_60px_rgb(59,130,246,2.0))] max-sm:max-w-[50%] max-sm:mx-auto"
                width="10%"
                height="auto"
                alt="Event management platform dashboard"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Hero;
