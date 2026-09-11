import {Footage} from "../components/Footage";

export const StrategyScene: React.FC = () => (
  <Footage src="clip1.mp4" trimBefore={120} objectPosition="53% 50%" zoomFrom={1.01} zoomTo={1.055} darken={0.16} />
);
