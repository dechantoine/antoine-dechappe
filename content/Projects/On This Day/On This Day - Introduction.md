---
title: On This Day - Introduction
draft: false
tags:
  - llms
  - automation
  - video-generation
  - side-project
date: 2025-01-24
---
<!-- PROJECT LOGO -->
<div align="center">
  <a>
    <img src="/assets/on-this-day-logo.png" alt="Logo" width="180" height="180">
  </a>

  <h3 align="center">On This Day</h3>

  <p align="center">
    An LLM pipeline that turns a historical event into a short, narrated, vertical video — daily, for under $1.
    <br />
    <br />
    <a href="https://www.tiktok.com/@on_this_day_videos">Videos (TikTok archive)</a>
    ·
    <a href="https://github.com/dechantoine/on-this-day">Repository</a>
  </p>
</div>

# About The Project

**On This Day** takes a historical event that happened on a given calendar date and turns it into a short, narrated,
vertical video. Wikipedia supplies the raw events, an LLM picks the interesting ones and writes a script and a
storyboard, a text-to-image model illustrates it, a TTS model narrates it, and MoviePy stitches everything into a
finished video with synced subtitles.

I'd already been building with LLMs professionally for a while, so this wasn't a learning project. I started it in
January 2025 to prove, on a real recurring workload, that I could ship a full GenAI content pipeline solo and end
to end: event research, prompt engineering, TTS, image generation, and video assembly.

From **2025-09-15 to 2025-11-29**, I ran the pipeline daily under a self-imposed constraint: one finished video
per day, for **under $1 in API costs**, with **under 10 minutes of manual steering** in the app (picking an
event, a hook, a storyboard, and a handful of images), everything else automated by a CLI. The videos went out
on TikTok as [@on_this_day_videos](https://www.tiktok.com/@on_this_day_videos).

The channel didn't get the views to justify keeping it running, and I eventually stopped posting. But the
pipeline itself and the string of very concrete engineering problems that only show up once you're actually
generating content with LLMs and diffusion models were worth writing about. This series is that story.

## Objectives

- Build a fully-automatable, human-steerable content pipeline: Wikipedia → LLM script → storyboard → images →
  narration → final video.
- Keep the pipeline cheap and fast enough to run once a day, solo: under $1/day in API costs, under 10 minutes of
  manual curation.
- Solve visual consistency across independently-generated images of the same recurring characters/places — the
  hardest and last problem the project solved (its storyboard/"visual lookbook" system).

## Roadmap

- [x] Wikipedia event crawler + LLM qualification of candidate events
- [x] LLM script generation (hook + narrative body)
- [x] Text-to-speech narration
  - [x] Local, free model (Kokoro) — later dropped
  - [x] ElevenLabs adapter, including forced alignment (word-level timestamps)
  - [x] ElevenLabs v3 + expressive audio tags
- [x] Text-to-image generation (Imagen) with per-scene prompts
- [x] Storyboard generator + "visual lookbook" for cross-image character/location consistency
- [x] Video assembly with MoviePy: Ken Burns-style pan/zoom, title card, karaoke-style subtitles
- [x] Gradio app for human-in-the-loop curation (one tab per pipeline stage)
- [x] CLI for headless batch automation (bulk event fetching, final video rendering)
- [ ] Image-to-video animation

# Demo

The most-watched video from the run — on Genghis Khan and Jalal al-Din at the Indus River, November 24, 1221:

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@on_this_day_videos/video/7576276985589009686" data-video-id="7576276985589009686" style="max-width: 605px;min-width: 325px;" >
  <section>
    <a target="_blank" title="@on_this_day_videos" href="https://www.tiktok.com/@on_this_day_videos?refer=embed">@on_this_day_videos</a>
    On this day, November 24, 1221, a defeated king performed an act of defiance that shocked the most ruthless conqueror in history. Cornered at the Indus River by Genghis Khan's Mongol army, Jalal al-Din, fully armored, rode his horse off a 30-foot cliff into the raging current. Genghis Khan was so struck by this astonishing act of courage that he ordered his archers to hold their fire, granting his formidable enemy an unlikely escape. A single moment of profound respect for a brave foe.
    <a title="genghiskhan" target="_blank" href="https://www.tiktok.com/tag/genghiskhan?refer=embed">#GenghisKhan</a>
    <a title="mongolempire" target="_blank" href="https://www.tiktok.com/tag/mongolempire?refer=embed">#MongolEmpire</a>
    <a title="jalalaldin" target="_blank" href="https://www.tiktok.com/tag/jalalaldin?refer=embed">#JalalAlDin</a>
    <a title="medievalhistory" target="_blank" href="https://www.tiktok.com/tag/medievalhistory?refer=embed">#MedievalHistory</a>
    <a target="_blank" title="♬ Epic Legend - Auracle" href="https://www.tiktok.com/music/Epic-Legend-6999394394508658689?refer=embed">♬ Epic Legend - Auracle</a>
  </section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

## Series

1. **This introduction**: origin, goals, constraints.
2. *Finding a voice*: from a free local TTS model to ElevenLabs, and why forced alignment became the pipeline's
   load-bearing dependency.
3. *Chasing the hook*: what actually got clicks: a look back at the daily performance stats I kept (publish time,
   first-hour and first-24h views, topic, hook wording) and what they taught me about writing for the first three
   seconds.
4. *The last feature, and turning off the lights*: the storyboard generator that finally solved visual
   consistency, and why the channel got shut down anyway.
