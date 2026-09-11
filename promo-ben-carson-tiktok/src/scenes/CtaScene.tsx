import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Footage} from "../components/Footage";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Footage src="clip1.mp4" trimBefore={174} objectPosition="55% 50%" zoomFrom={1.02} zoomTo={1.08} darken={0.34} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(1,12,16,0.18) 0%, rgba(1,12,16,0.42) 42%, rgba(1,12,16,0.92) 100%)"}} />
      <div
        style={{
          position: "absolute",
          left: 82,
          right: 82,
          top: 430,
          textAlign: "center",
          opacity: interpolate(frame, [4, 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
          translate: `0 ${interpolate(frame, [4, 18], [42, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
        }}
      >
        <div style={{fontSize: 46, fontWeight: 900, color: "white", letterSpacing: 8}}>INICIAMOS</div>
        <div style={{fontSize: 152, lineHeight: 0.92, fontWeight: 950, color: "#FFD64A", letterSpacing: -8, marginTop: 20}}>15 SEPT</div>
        <div style={{fontSize: 36, fontWeight: 850, color: "rgba(255,255,255,0.9)", marginTop: 28, letterSpacing: -0.5}}>TÉCNICA ALCOCER · PREPA BEN CARSON</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 155,
          right: 155,
          bottom: 540,
          padding: "24px 34px",
          borderRadius: 999,
          backgroundColor: "#2CE080",
          color: "#042117",
          textAlign: "center",
          fontSize: 44,
          fontWeight: 950,
          letterSpacing: 0.5,
          boxShadow: "0 18px 50px rgba(44,224,128,0.3)",
          opacity: interpolate(frame, [14, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: `0 ${interpolate(frame, [14, 26], [28, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
        }}
      >
        ESCRÍBENOS AHORA
      </div>
    </AbsoluteFill>
  );
};
