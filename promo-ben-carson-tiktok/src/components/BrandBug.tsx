import {interpolate, useCurrentFrame} from "remotion";

export const BrandBug: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 76,
        left: 74,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 22px",
        borderRadius: 999,
        backgroundColor: "rgba(4, 20, 26, 0.78)",
        border: "2px solid rgba(255,255,255,0.18)",
        boxShadow: "0 12px 34px rgba(0,0,0,0.24)",
        opacity: interpolate(frame, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div style={{width: 16, height: 16, borderRadius: 99, backgroundColor: "#2CE080", boxShadow: "0 0 20px #2CE080"}} />
      <div style={{color: "white", fontSize: 26, fontWeight: 900, letterSpacing: 1.4}}>PREPA BEN CARSON</div>
    </div>
  );
};
