# Voiceover

A powerful utility for converting text to speech using OpenAI's TTS voice, with post-processing enhancements via ffmpeg to adjust bass, treble, and speed for improved audio quality. All narration text is managed in a narration.yml file, allowing easy modifications to speed and content for specific screens without needing to regenerate the entire audio set.

## Installation

```sh
git clone https://github.com/symthink/voiceover.git
```

## Usage

Provide a YAML file specifying the narration details, including screen names, text, and optional speed settings. The utility generates audio files using OpenAI's text-to-speech API and enhances them with `ffmpeg`.

### Sample YAML File

```yaml
- screen: introduction
  speed: '1.2'
  text: Your introduction text here. You can optionally specify the speed. It defaults to 1.3.
- screen: overview
  text: The audio files are named after the screen name. The regular speed file produced from the OpenAI text-to-speech API is stored in the "audio" folder. Then, the "ffmpeg" utility is used to adjust the speed while boosting bass and reducing the treble slightly to enhance voice quality at the higher speed. The post-processed file is then stored under "audio-processed".
```

## Features

- Converts text to speech using OpenAI's TTS API
- Adjusts speed, bass, and treble with `ffmpeg`
- Modify speed and content for specific screens via `narration.yml` file
- Outputs raw and processed audio files

## License

This project is open-source and available under the [GNU GENERAL PUBLIC LICENSE](LICENSE).

