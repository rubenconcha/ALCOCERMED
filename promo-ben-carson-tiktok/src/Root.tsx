import "./index.css";
import {Composition, Folder} from "remotion";
import {PromoBenCarson} from "./Composition";
import {CommunityScene} from "./scenes/CommunityScene";
import {CtaScene} from "./scenes/CtaScene";
import {HookScene} from "./scenes/HookScene";
import {LimitedScene} from "./scenes/LimitedScene";
import {PracticeScene} from "./scenes/PracticeScene";
import {StrategyScene} from "./scenes/StrategyScene";
import {TechniqueScene} from "./scenes/TechniqueScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoBenCarsonTikTok"
        component={PromoBenCarson}
        durationInFrames={636}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Escenas-editables">
        <Composition id="EscenaGancho" component={HookScene} durationInFrames={72} fps={30} width={1080} height={1920} />
        <Composition id="EscenaEstrategia" component={StrategyScene} durationInFrames={45} fps={30} width={1080} height={1920} />
        <Composition id="EscenaTecnica" component={TechniqueScene} durationInFrames={93} fps={30} width={1080} height={1920} />
        <Composition id="EscenaPractica" component={PracticeScene} durationInFrames={141} fps={30} width={1080} height={1920} />
        <Composition id="EscenaComunidad" component={CommunityScene} durationInFrames={84} fps={30} width={1080} height={1920} />
        <Composition id="EscenaCupos" component={LimitedScene} durationInFrames={69} fps={30} width={1080} height={1920} />
        <Composition id="EscenaCTA" component={CtaScene} durationInFrames={132} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
