import {Footage} from "../components/Footage";

export const LimitedScene: React.FC = () => (
  <Footage src="clip5.mp4" trimBefore={150} objectPosition="50% 48%" zoomFrom={1.02} zoomTo={1.075} darken={0.2} />
);
