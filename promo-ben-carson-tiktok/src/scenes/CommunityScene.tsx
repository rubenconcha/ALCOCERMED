import {Footage} from "../components/Footage";

export const CommunityScene: React.FC = () => (
  <Footage src="clip4.mp4" trimBefore={30} objectPosition="50% 47%" zoomFrom={1.03} zoomTo={1.075} darken={0.16} />
);
