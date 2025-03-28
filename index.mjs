import fs from "fs";
import path from "path";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import 'dotenv/config';
import YAML from 'yaml';

const fileContents = fs.readFileSync('./narration.yml', 'utf8');
const narration = YAML.parse(fileContents);

const openai = new OpenAI();
// How do you create a platform?
// 

async function generateSpeech(item) {
  const speechFile = path.resolve(`./audio/${item.screen}.mp3`);
  const processedFile = path.resolve(`./audio-processed/${item.screen}.mp3`);

  if (fs.existsSync(processedFile)) {
    console.log(`Skipping:`, processedFile);
    return;
  }
  
  if (!fs.existsSync(speechFile)) {
    console.log(`Generating speech for: ${item.screen}.mp3`);
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: item.text
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log(`Speech screen created: ${speechFile}`);
  } else {
    console.log(`Speech screen already exists: ${speechFile}`);
  }

  // Process the audio screen to improve quality
  await processAudio(speechFile, processedFile, item.speed || '1.3');
}

async function processAudio(inputscreen, outputscreen, speed) {
  console.log(`Processing audio: ${inputscreen}`);
  return new Promise((resolve, reject) => {
    ffmpeg(inputscreen)
      .audioFilters([
        "equalizer=f=100:t=q:w=1:g=3",   // Boost bass (100Hz) by +3dB
        "equalizer=f=4000:t=q:w=1:g=-3", // Reduce harsh treble (4kHz) by -3dB
        `atempo=${speed}`                     // Speed up while preserving pitch
      ])
      .on("end", () => {
        console.log(`Processed audio saved as: ${outputscreen}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error processing audio: ${err}`);
        reject(err);
      })
      .save(outputscreen);
  });
}

async function print() {
  const str = YAML.stringify(narration);
  const yamlFile = path.resolve('./narration2.yml');
  await fs.promises.writeFile(yamlFile, str);
  console.log('Wrote file: ', yamlFile);
}

async function run() {
  for (let item of narration) {
    try {
      await generateSpeech(item);
    } catch (error) {
      console.error(`Error processing ${item.screen}:`, error);
    }
  }
  console.log("All tasks completed.");
}

run().catch(console.error);
// print().catch(console.error);
