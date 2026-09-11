import type {Caption} from "@remotion/captions";
import {useCallback, useEffect, useMemo, useState} from "react";
import {
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";

const accentFor = (text: string) => {
  if (text.includes("MEDICINA")) return "#FFD64A";
  if (text.includes("ALCOCER")) return "#2CE080";
  if (text.includes("15 DE SEPTIEMBRE")) return "#FFD64A";
  if (text.includes("CUPOS")) return "#FF6B5E";
  if (text.includes("ESCRÍBENOS")) return "#2CE080";
  return "#FFFFFF";
};

const CaptionCard: React.FC<{caption: Caption}> = ({caption}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localDuration = Math.max(1, ((caption.endMs - caption.startMs) / 1000) * fps);

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 315,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [0, 5, localDuration - 5, localDuration], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: `0 ${interpolate(frame, [0, 8], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        })}px`,
      }}
    >
      <div
        style={{
          maxWidth: 920,
          padding: "18px 30px 20px",
          borderRadius: 28,
          backgroundColor: "rgba(2, 15, 20, 0.84)",
          border: "2px solid rgba(255,255,255,0.14)",
          boxShadow: "0 16px 44px rgba(0,0,0,0.34)",
          color: accentFor(caption.text),
          fontSize: caption.text.length > 36 ? 54 : 64,
          fontWeight: 950,
          lineHeight: 1.03,
          letterSpacing: -1.4,
          textAlign: "center",
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};

export const TikTokCaptions: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender("Cargando subtítulos"));
  const {fps} = useVideoConfig();

  const load = useCallback(async () => {
    try {
      const response = await fetch(staticFile("captions.json"));
      if (!response.ok) throw new Error(`No se pudieron cargar los subtítulos: ${response.status}`);
      setCaptions(await response.json());
      continueRender(handle);
    } catch (error) {
      cancelRender(error);
    }
  }, [cancelRender, continueRender, handle]);

  useEffect(() => {
    load();
  }, [load]);

  return useMemo(() => {
    if (!captions) return null;
    return (
      <>
        {captions.map((caption) => {
          const from = Math.round((caption.startMs / 1000) * fps);
          const durationInFrames = Math.max(1, Math.round(((caption.endMs - caption.startMs) / 1000) * fps));
          return (
            <Sequence key={`${caption.startMs}-${caption.text}`} from={from} durationInFrames={durationInFrames}>
              <CaptionCard caption={caption} />
            </Sequence>
          );
        })}
      </>
    );
  }, [captions, fps]);
};
