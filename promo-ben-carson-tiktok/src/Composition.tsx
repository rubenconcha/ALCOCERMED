import {Audio} from "@remotion/media";
import {TransitionSeries} from "@remotion/transitions";
import {AbsoluteFill, Sequence, staticFile} from "remotion";
import {BrandBug} from "./components/BrandBug";
import {TikTokCaptions} from "./components/TikTokCaptions";
import {CommunityScene} from "./scenes/CommunityScene";
import {CtaScene} from "./scenes/CtaScene";
import {HookScene} from "./scenes/HookScene";
import {LimitedScene} from "./scenes/LimitedScene";
import {PracticeScene} from "./scenes/PracticeScene";
import {StrategyScene} from "./scenes/StrategyScene";
import {TechniqueScene} from "./scenes/TechniqueScene";

export const PromoBenCarson: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#071318"}}>
      <TransitionSeries name="Montaje vertical">
        <TransitionSeries.Sequence name="1 · Gancho y cartel" durationInFrames={72}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="2 · Revelación del aula" durationInFrames={45}>
          <StrategyScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="3 · Técnica Alcocer" durationInFrames={93}>
          <TechniqueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="4 · Práctica y método" durationInFrames={141}>
          <PracticeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="5 · Comunidad" durationInFrames={84}>
          <CommunityScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="6 · Cupos limitados" durationInFrames={69}>
          <LimitedScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="7 · Llamada a la acción" durationInFrames={132}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <BrandBug />
      <TikTokCaptions />

      <Audio src={staticFile("locucion-master.wav")} volume={1} />
      <Sequence from={68} durationInFrames={35}>
        <Audio src={staticFile("whoosh.wav")} volume={0.16} />
      </Sequence>
      <Sequence from={348} durationInFrames={35}>
        <Audio src={staticFile("whoosh.wav")} volume={0.11} />
      </Sequence>
      <Sequence from={500} durationInFrames={35}>
        <Audio src={staticFile("whoosh.wav")} volume={0.13} />
      </Sequence>
    </AbsoluteFill>
  );
};
