/* ---------------------------------------------------------------------
   VOICE: talk to your bot instead of typing.

   Adds a microphone button next to send. Click it, speak, click again.
   A speech model turns what you said into text, here in your browser,
   and puts it in the message box so you can check it before sending.

   Your voice stays on this laptop. The first time you click the button,
   the page downloads the speech model (a file of about 40 MB, not your voice)
   from Hugging Face, so that first time needs the internet.

   To use it, chat.html needs this line just before </body>:
     <script src="voice.js"></script>

   The pipeline:  sound  ->  text (Whisper, in the browser)  ->  your bot  ->  reply
   --------------------------------------------------------------------- */

const VOICE = {
  // ADAPT: the speech model.
  // "Xenova/whisper-tiny.en" is small and quick, English only.
  // "Xenova/whisper-base.en" is more accurate, and about twice the size.
  // For other languages, leave off ".en", for example "Xenova/whisper-base".
  speechModel: "Xenova/whisper-tiny.en",

  // ADAPT: true sends what it heard straight away, without letting you check it first.
  sendStraightAway: false
};

// EXTEND: the easy way, and what it costs.
// Browsers have speech recognition built in (SpeechRecognition). It's a few lines of code,
// but in Chrome your audio is sent to Google to be turned into text, and in some setups
// Safari sends it to Apple. Try it, and compare. Teaches: convenience versus where your data goes.

// EXTEND: let it speak.
// The browser can read replies aloud with speechSynthesis. Choose a voice whose
// localService is true, so the speaking happens on this laptop too. For a more natural
// local voice, look at Piper. Teaches: the full loop, from sound back to sound.

(function () {
  const LIBRARY = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

  const input = document.getElementById("input");
  const form = document.getElementById("form");
  const send = document.getElementById("send");
  if (!input || !form || !send) return;

  const mic = document.createElement("button");
  mic.type = "button";
  mic.className = "send mic";
  mic.textContent = "🎤";
  mic.title = "Speak";
  mic.setAttribute("aria-label", "Speak your message");
  send.before(mic);

  const normalPlaceholder = input.placeholder;
  const say = (text) => { input.placeholder = text || normalPlaceholder; };

  let transcriber = null;   // the speech model, once loaded
  let recorder = null;      // records from the microphone
  let pieces = [];
  let busy = false;

  // Loads the speech model the first time it's needed.
  async function loadSpeechModel(quietly) {
    if (transcriber) return transcriber;
    if (!quietly) say("loading the speech model (first time only)…");
    const { pipeline, env } = await import(LIBRARY);
    // Keep a copy of the model in the browser, if this browser allows it here.
    env.useBrowserCache = typeof caches !== "undefined";
    transcriber = await pipeline("automatic-speech-recognition", VOICE.speechModel);
    return transcriber;
  }

  // Turns a recording into the list of numbers the speech model expects:
  // one channel of sound, 16,000 samples per second.
  async function toSamples(blob) {
    const context = new AudioContext({ sampleRate: 16000 });
    const sound = await context.decodeAudioData(await blob.arrayBuffer());
    context.close();
    return sound.getChannelData(0);
  }

  async function startListening() {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      say("the browser didn't allow the microphone. Check its permissions, then try again.");
      return;
    }
    pieces = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => { if (e.data.size) pieces.push(e.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      transcribe(new Blob(pieces, { type: recorder.mimeType }));
    };
    recorder.start();
    mic.classList.add("listening");
    mic.textContent = "■";
    mic.title = "Stop";
    mic.setAttribute("aria-label", "Stop and turn speech into text");
    say("listening… click ■ when you've finished");
    // Start loading the model while you talk, so it's ready sooner.
    loadSpeechModel(true).catch(() => {});
  }

  function stopListening() {
    mic.classList.remove("listening");
    mic.textContent = "🎤";
    mic.title = "Speak";
    mic.setAttribute("aria-label", "Speak your message");
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }

  async function transcribe(blob) {
    busy = true;
    mic.disabled = true;
    try {
      const model = await loadSpeechModel();
      say("turning speech into text…");
      const samples = await toSamples(blob);
      const result = await model(samples, { chunk_length_s: 30, stride_length_s: 5 });
      const text = (result.text || "").trim();
      say();
      if (!text) { say("didn't catch anything. Try again, a little closer."); return; }
      input.value = (input.value ? input.value + " " : "") + text;
      input.dispatchEvent(new Event("input"));
      input.focus();
      if (VOICE.sendStraightAway) form.requestSubmit();
    } catch (err) {
      console.error(err);
      say(transcriber
        ? "couldn't turn that into text. Try again."
        : "couldn't load the speech model. It needs the internet the first time.");
    } finally {
      busy = false;
      mic.disabled = false;
    }
  }

  mic.addEventListener("click", () => {
    if (busy) return;
    if (recorder && recorder.state === "recording") stopListening();
    else startListening();
  });
})();
