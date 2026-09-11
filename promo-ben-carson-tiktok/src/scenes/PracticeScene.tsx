import {Footage} from "../components/Footage";

export const PracticeScene: React.FC = () => (
  <Footage src="clip2.mp4" trimBefore={186} objectPosition="49% 50%" zoomFrom={1.03} zoomTo={1.08} darken={0.17} />
);
