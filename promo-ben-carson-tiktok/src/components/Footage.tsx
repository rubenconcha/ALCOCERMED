import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type FootageProps = {
  src: string;
  trimBefore: number;
  objectPosition?: string;
  zoomFrom?: number;
  zoomTo?: number;
  darken?: number;
};

export const Footage: React.FC<FootageProps> = ({
  src,
  trimBefore,
  objectPosition = "50% 50%",
  zoomFrom = 1,
  zoomTo = 1.045,
  darken = 0.18,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: "#071318"}}>
      <Video
        src={staticFile(src)}
        trimBefore={trimBefore}
        muted
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          objectPosition,
          scale: interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          filter: "saturate(1.1) contrast(1.06) brightness(0.98)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(3,14,18,${darken + 0.04}) 0%, transparent 28%, transparent 60%, rgba(3,14,18,${darken + 0.42}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
