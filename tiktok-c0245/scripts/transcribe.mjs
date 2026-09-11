import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";

const whisperCppVersion = "1.5.5";
const model = "small";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const whisperPath = path.join(process.cwd(), "whisper.cpp");
const inputFilename = process.env.TRANSCRIBE_INPUT ?? "audio_16k.wav";
const outputPrefix = process.env.TRANSCRIBE_PREFIX ?? "full";
const inputPath = path.join(projectRoot, "public", inputFilename);
const captionsPath = path.join(projectRoot, "public", `captions-${outputPrefix}.json`);
const rawPath = path.join(projectRoot, "public", `transcript-${outputPrefix}-raw.json`);
const textPath = path.join(projectRoot, "public", `transcript-${outputPrefix}.txt`);

await installWhisperCpp({
  to: whisperPath,
  version: whisperCppVersion,
  printOutput: true,
});

await downloadWhisperModel({
  model,
  folder: whisperPath,
  printOutput: true,
});

const whisperCppOutput = await transcribe({
  model,
  whisperPath,
  whisperCppVersion,
  inputPath,
  tokenLevelTimestamps: true,
  language: "es",
  flashAttention: false,
  printOutput: true,
});

const {captions} = toCaptions({whisperCppOutput});
const transcriptText = whisperCppOutput.transcription
  .map((item) => `[${item.timestamps.from} --> ${item.timestamps.to}] ${item.text.trim()}`)
  .join("\n");

fs.writeFileSync(captionsPath, JSON.stringify(captions, null, 2));
fs.writeFileSync(rawPath, JSON.stringify(whisperCppOutput, null, 2));
fs.writeFileSync(textPath, `${transcriptText}\n`);

console.log(`Wrote ${captions.length} captions to ${captionsPath}`);
