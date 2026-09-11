import {Audio, Video} from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {TikTokCaptions} from "./TikTokCaptions";

const VideoSegment: React.FC<{
  trimBefore: number;
  finalReveal?: boolean;
}> = ({trimBefore, finalReveal = false}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: "#071112", overflow: "hidden"}}>
      <Video
        name="Fondo desenfocado"
        src={staticFile("source.mp4")}
        trimBefore={trimBefore}
        muted
        objectFit="cover"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          filter: "blur(44px) brightness(0.34) saturate(0.9)",
          scale: 1.16,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,15,18,0.28) 0%, rgba(4,15,18,0.04) 45%, rgba(4,15,18,0.86) 100%)",
        }}
      />

      <Interactive.Div
        name={finalReveal ? "Plano final del mural" : "Video principal"}
        style={{
          position: "absolute",
          left: 50,
          top: finalReveal ? 410 : 520,
          width: 980,
          height: 551,
          borderRadius: 34,
          overflow: "hidden",
          border: "3px solid rgba(255,255,255,0.42)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
          scale: interpolate(frame, [0, finalReveal ? 126 : 372], [1, 1.035], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Video
          name="Clip fuente"
          src={staticFile("source.mp4")}
          trimBefore={trimBefore}
          muted
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            filter: "contrast(1.05) saturate(1.08) brightness(0.92)",
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Barra de progreso"
      style={{
        position: "absolute",
        top: 46,
        left: 50,
        width: interpolate(frame, [0, 824], [0, 980], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.linear,
        }),
        height: 9,
        borderRadius: 99,
        backgroundColor: "#FFD84D",
        boxShadow: "0 0 24px rgba(255,216,77,0.52)",
      }}
    />
  );
};

const LocationPill: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Ubicación"
      style={{
        position: "absolute",
        top: 92,
        left: 80,
        padding: "17px 28px",
        borderRadius: 999,
        color: "#F7FBFC",
        backgroundColor: "rgba(8,23,27,0.78)",
        border: "2px solid rgba(255,255,255,0.25)",
        fontFamily: "Arial, sans-serif",
        fontSize: 38,
        fontWeight: 900,
        letterSpacing: 2.2,
        opacity: interpolate(frame, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: interpolate(frame, [0, 12], ["0px -18px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      📍 SERRANO · BOLIVIA
    </Interactive.Div>
  );
};

const HookTitle: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Gancho inicial"
      style={{
        position: "absolute",
        top: 195,
        left: 80,
        width: 920,
        color: "white",
        fontFamily: "Arial Black, Arial, sans-serif",
        fontWeight: 900,
        fontSize: 82,
        lineHeight: 0.98,
        letterSpacing: -3.2,
        textAlign: "left",
        textShadow: "0 10px 34px rgba(0,0,0,0.65)",
        opacity: interpolate(frame, [0, 10, 88, 104], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [
            Easing.bezier(0.16, 1, 0.3, 1),
            Easing.linear,
            Easing.bezier(0.7, 0, 0.84, 0),
          ],
        }),
        scale: interpolate(frame, [0, 12], [0.92, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      BUSCAMOS EL
      <br />
      <span style={{color: "#FFD84D"}}>CHARANGO MÁS GRANDE</span>
      <br />
      DE BOLIVIA{" "}
      <span
        style={{
          display: "inline-block",
          width: 76,
          height: 48,
          borderRadius: 8,
          background:
            "linear-gradient(180deg, #D52B1E 0%, #D52B1E 33.33%, #F9E300 33.33%, #F9E300 66.66%, #007934 66.66%, #007934 100%)",
          boxShadow: "0 5px 14px rgba(0,0,0,0.32)",
          verticalAlign: "0.03em",
        }}
      />
    </Interactive.Div>
  );
};

const LocalAnswerLabel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Rótulo respuesta local"
      style={{
        position: "absolute",
        top: 270,
        left: 80,
        padding: "18px 27px",
        borderRadius: 18,
        color: "#071112",
        backgroundColor: "#FFD84D",
        fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: 42,
        fontWeight: 900,
        letterSpacing: 0.2,
        opacity: interpolate(frame, [0, 8, 340, 365], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: [
            Easing.bezier(0.16, 1, 0.3, 1),
            Easing.linear,
            Easing.bezier(0.7, 0, 0.84, 0),
          ],
        }),
        translate: interpolate(frame, [0, 10], ["-26px 0px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      UNA LOCAL NOS DIO LA CLAVE 👀
    </Interactive.Div>
  );
};

const FinalCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Interactive.Div
        name="Título final"
        style={{
          position: "absolute",
          top: 180,
          left: 80,
          width: 920,
          color: "white",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: 80,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: -2.5,
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [0, 12], ["0px 24px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Y ENCONTRAMOS
        <br />
        ESTA PISTA…
      </Interactive.Div>

      <Interactive.Div
        name="Llamada a la acción"
        style={{
          position: "absolute",
          top: 1035,
          left: 80,
          width: 850,
          color: "#F7FBFC",
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: 72,
          lineHeight: 1.03,
          fontWeight: 900,
          letterSpacing: -2,
          textShadow: "0 10px 30px rgba(0,0,0,0.64)",
          opacity: interpolate(frame, [10, 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [10, 24], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        ¿CONOCÍAS
        <br />
        <span style={{color: "#FFD84D"}}>ESTE LUGAR?</span>
        <div
          style={{
            marginTop: 30,
            fontFamily: "Arial, sans-serif",
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 0.5,
          }}
        >
          GUÁRDALO PARA VISITARLO ↗
        </div>
      </Interactive.Div>
    </>
  );
};

const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        opacity: interpolate(frame, [0, 2, 6], [0, 0.18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    />
  );
};

export const TikTokEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#071112"}}>
      <Sequence name="Gancho: museo cerrado" durationInFrames={327}>
        <VideoSegment trimBefore={240} />
        <Audio
          name="Diálogo limpio 1"
          src={staticFile("audio_master.m4a")}
          trimBefore={240}
          volume={1}
        />
      </Sequence>

      <Sequence name="Respuesta de la habitante" from={327} durationInFrames={372}>
        <VideoSegment trimBefore={570} />
        <Audio
          name="Diálogo limpio 2"
          src={staticFile("audio_master.m4a")}
          trimBefore={570}
          volume={1}
        />
      </Sequence>

      <Sequence name="Revelación del mural" from={699} durationInFrames={126}>
        <VideoSegment trimBefore={2058} finalReveal />
        <Audio
          name="Ambiente final"
          src={staticFile("audio_master.m4a")}
          trimBefore={2058}
          volume={(audioFrame) =>
            interpolate(audioFrame, [0, 18, 108, 125], [0, 0.18, 0.18, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
        <FinalCard />
      </Sequence>

      <ProgressBar />
      <LocationPill />

      <Sequence name="Texto gancho" durationInFrames={110}>
        <HookTitle />
      </Sequence>

      <Sequence name="Rótulo local" from={327} durationInFrames={372}>
        <LocalAnswerLabel />
      </Sequence>

      <Sequence name="Destello de corte 1" from={324} durationInFrames={7}>
        <CutFlash />
      </Sequence>
      <Sequence name="Destello de corte 2" from={696} durationInFrames={7}>
        <CutFlash />
      </Sequence>

      <Sequence name="Subtítulos" durationInFrames={699}>
        <TikTokCaptions />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="C0245-TikTok"
      component={TikTokEdit}
      durationInFrames={825}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
