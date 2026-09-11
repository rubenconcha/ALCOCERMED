import {Footage} from "../components/Footage";

export const TechniqueScene: React.FC = () => (
  <Footage src="clip3.mp4" trimBefore={18} objectPosition="50% 46%" zoomFrom={1.02} zoomTo={1.07} darken={0.16} />
);
