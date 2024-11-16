import { FaLinkedin, FaGithub } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
interface Social {
  id: string;
  url: string;
  icon: React.ReactNode;
  title: string;
}

const socials: Social[] = [
  {
    id: "twitter",
    url: "https://twitter.com/eventflow",
    icon: <FaXTwitter className="size-1/2" />,
    title: "Twitter"
  },
  {
    id: "linkedin",
    url: "https://linkedin.com/company/eventflow",
    icon: <FaLinkedin className="size-1/2" />,
    title: "LinkedIn"
  },
  {
    id: "github",
    url: "https://github.com/eventflow",
    icon: <FaGithub className="size-1/2" />,
    title: "GitHub"
  }
];

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container py-10">
        <div className="flex w-full max-md:flex-col">
          <div className="small-compact flex flex-1 flex-wrap items-center justify-center gap-5">
            <p className="opacity-70">Copyright © 2024 EventFlow. All rights reserved.</p>
          </div>
          <div className="flex items-center justify-center sm:ml-auto">
            <p className="legal-after relative mr-9 text-p5 transition-all duration-500 hover:text-p1">
              Privacy Policy
            </p>
            <p className="text-p5 transition-all duration-500 hover:text-p1">
              Terms of Use
            </p>
          </div>

          <ul className="flex flex-1 justify-center gap-3 max-md:mt-10 md:justify-end">
            {socials.map(({ id, url, icon, title }: Social) => (
              <li key={id}>
                <a href={url} className="social-icon" title={title}>
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
