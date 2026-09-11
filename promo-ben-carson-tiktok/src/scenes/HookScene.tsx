import {Footage} from "../components/Footage";

export const HookScene: React.FC = () => (
  <Footage src="clip1.mp4" trimBefore={0} objectPosition="50% 50%" zoomFrom={1.03} zoomTo={1.08} darken={0.12} />
);
