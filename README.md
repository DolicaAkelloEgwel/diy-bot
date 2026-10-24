# DIY Bot: starter templates

Two small bots that run entirely on your own laptop. Nothing you type is sent anywhere.

## Download the templates

**[Download the templates (zip)](https://github.com/mahaliahr/diy-bot/archive/refs/heads/main.zip)**

- **Mac:** it unzips by itself into a folder called `diy-bot-main`, in your Downloads.
- **Windows:** right-click the downloaded file and choose **Extract All**, then open the new folder. If you open the files inside the zip without extracting, your changes won't save.

Then start with *Getting ready*, below. Here's what's in the folder:


| File | What it is |
|---|---|
| `check.html` | Gets everything ready, step by step. Open this first. |
| `chat.html` | A bot you talk to, one message at a time. |
| `mirror.html` | A bot that doesn't chat. Give it some of your writing and it reflects it back. |
| `voice.js` | Adds a microphone button to the chat bot. Speech is turned into text on your laptop. |
| `style.css` | How every page looks: fonts, colours and layout. |
| `fonts.css` | The two fonts, stored inside a file. You don't need to edit it. Their licence is in `fonts-licence.txt`. |
| `Modelfile.txt` | The simplest possible bot: a text file and a model, no browser needed. |
| `guide.html` | This guide, as a page. Open it in your browser. |
| `README.md` | The same guide, as plain text. |

Both bots use the same core. What makes them different is how you give them material and how they show what they say.

Each bot's `.html` file is what it does. `style.css` is how they all look.


## 1. Getting ready

1. **Install Ollama** from [ollama.com](https://ollama.com), and open it. It's free, open source software that runs language models on your laptop.
2. **Double-click `check.html`** to open it in your browser, and follow the step it shows you. It checks again by itself every few seconds.

The first time, it will usually ask you to paste one line into Terminal (Mac) or PowerShell (Windows). That line lets the bot pages talk to Ollama, and downloads a model of about 2 to 3GB. After that, everything works without the internet.

When you see three green lights, you're ready.

### More details: what the setup line does

Your browser normally stops pages opened from your own files from talking to programs on your laptop. The setup line sets `OLLAMA_ORIGINS` to `*`, which tells Ollama to accept them.

While it's set, any website open in your browser could also send requests to Ollama: use your models, or download or delete them. It can't reach your files. To undo it:

- **Mac** (it also resets when you restart): `launchctl unsetenv OLLAMA_ORIGINS`, then quit and reopen Ollama.
- **Windows:** `[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", $null, "User")`, then quit and reopen Ollama.

If you'd rather not change the setting and you have Python, open the pages through a small local server instead. In this folder, run:

```
python3 -m http.server 8000
```

Then open [localhost:8000/check.html](http://localhost:8000/check.html). Ollama already trusts pages opened that way.


## 2. Make your bot

1. Open `chat.html` or `mirror.html` in a **text editor**, not a browser.
   - Windows: right-click the file, choose *Open with*, then *Notepad*.
   - Mac: TextEdit shows HTML as a formatted page by default. In TextEdit, go to *Settings*, then *Open and Save*, and tick *Display HTML files as HTML code*. Or use a free code editor such as [VS Code](https://code.visualstudio.com).
2. Near the top of the code, find the section marked **YOUR BOT**. It looks like this:

   ```js
   const BOT = {
     name: "Dot",
     model: "ministral-3:3b",
     temperature: 0.7,
     instructions: `You are Dot, ...`
   };
   ```

3. Replace the instructions with your blueprint: its name and personality, its purpose, what it knows, how it should respond, and what it should never do. Keep the backticks ( \` ) at the start and end.
4. Save the file, then refresh the page in your browser.

That's it. Every time you change the instructions, save and refresh.

### Writing instructions that work

Small models follow short, plain instructions better than long or clever ones. A few habits help:

- **Start with one line saying who it is and what it's for.** "You are Fern, a bot that helps me notice what I already know about my project."
- **Put the most important rule first.** Rules near the top tend to be followed more closely.
- **Say what to do, not only what not to do.** "Don't be long-winded" is vague. "Reply in two sentences, then ask one question" is something it can follow.
- **Set the shape of a reply:** how long, what tone, whether it asks questions, whether it uses lists.
- **If the behaviour is unusual, show one example.** Write a short made-up exchange: what you might say, and how it should answer.

Then test it, open "prompt sent to model", and change one thing at a time. Writing instructions is mostly rewriting them.

### Choosing a model

Each template has a **model** menu listing every model installed on your laptop, with its size. Pick one and your next message uses it. Your instructions stay the same, so you can see how differently each model behaves with the same bot. The `model` in the settings is just the one it starts with.

### Temperature

Next to the model menu there's a **temperature** slider. Lower makes replies steadier and more predictable; higher makes them more surprising, and eventually strange. Try the same message at 0.2 and at 1.2. The `temperature` in the settings is just where the slider starts.

### "prompt sent to model"

Under each message there's a small panel called **prompt sent to model**. Open it to see exactly what the model received: your instructions, anything found in your notes, then the conversation so far. Nothing else is hidden. Your bot is those instructions plus the model.

### Notes it can search (chat)

In the chat sidebar, **add files** or **add a folder** of `.txt` or `.md` files. They're read in your browser, never uploaded. For each message, the page finds the passages that share the most words with what you wrote, and adds up to three of them to the prompt. Open "prompt sent to model" to see what was found.

This is a simple version of what's called retrieval: **collect** (you choose the files), **find** (matching words), then **predict** (the model writes a reply). It matches words, not meanings: ask about "plants" and it won't find a note that only says "fig tree". The notes are forgotten when you close the page.

### Saving and copying

- **copy** under a reply puts it on your clipboard, ready to paste somewhere else.
- **save conversation** (chat) or **save reflections** (mirror) downloads a text file with everything, including the instructions, models and temperatures used. It's made on your laptop.

### Reasoning text

Some models, such as DeepSeek R1, write out a kind of reasoning before they answer. The templates put it in a small greyed panel, **the model's reasoning text**, so the answer stays clear. It's worth reading, but it's more predicted text, not a window into how the model works. These models are also slower.

### A note on breaking the rules

Small models sometimes ignore an instruction, especially strict ones like "only ever ask questions". That's normal, and worth noticing. Try rewording the rule, putting it first, or saying it twice.

### The simplest possible bot: a text file

`Modelfile.txt` is a whole bot in a few lines: which model it runs on, and its instructions. It needs no browser and no setup line.

1. Open it in a text editor, change the instructions between the triple quotes, and save.
2. In Terminal or PowerShell, type `ollama create dot -f` and a space, drag `Modelfile.txt` into the window, and press Enter.
3. Type `ollama run dot` to talk to it, and `/bye` to stop.

Change `dot` to any name you like.


## 3. After the workshop

The code has two markers. Search a file for either word:

- **ADAPT** marks things to change now, such as settings, labels and colours.
- **EXTEND** marks places to build something new, each with a short note on what you could add and what it teaches. There are about a dozen in the chat file, fewer in mirror, and one in `style.css`.

Go as far as you like, in any order.

### Change what it is (settings only)

- **Rewrite the instructions.** The biggest changes come from here. Try a different personality, a stricter rule, or a different purpose.
- **Try other models.** See *Finding more models* below. To change which model a bot starts with, change `model` in the settings.
- **Change the temperature.** Lower is more predictable, higher is more surprising.

### Finding more models

**Start with the Ollama library: [ollama.com/library](https://ollama.com/library).** Every model there works with Ollama, and each page lists its sizes.

1. Search for a model, or browse the list.
2. Pick a size. The tag after the colon is the size, as in `ministral-3:3b`, where 3b means 3 billion parameters.
3. Copy its name and run `ollama pull` followed by that name, for example `ollama pull ministral-3:3b`.
4. Refresh the bot page. The new model appears in the menu.

**Hugging Face ([huggingface.co](https://huggingface.co/models)) has many thousands more,** including small experimental and specialist models. It's busier and harder to read. Two things make it manageable:

- **Look for GGUF in the name.** That's the file format Ollama can run. [This search](https://huggingface.co/models?pipeline_tag=text-generation&library=gguf&sort=trending) shows only those models.
- **Turn the page address into a command.** Take the model's address, change `huggingface.co` to `hf.co`, and put `ollama pull` in front:

  ```
  ollama pull hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF
  ```

  Ollama picks a sensible version of the file for you.

**Before you download, check three things:**

- **Size.** The download size is roughly how much memory the model needs. Under about 4 GB suits most laptops. 8 GB or more needs a newer machine with plenty of memory.
- **Chat or instruct.** For a bot, choose models with "instruct" or "chat" in the name, or that say so on their page. Base models only continue text.
- **The model card.** This is the page that describes the model. Read who made it, what it was trained on (if they say), and its licence. Some licences limit what you can do with it.

### A bigger build

For anyone who already codes, or wants to learn. These steps take the bot out of the browser, one at a time. Each builds on the last, and each is a small project in itself.

1. **A script, not a page.** Talk to Ollama from Python with its library (`pip install ollama`, see [ollama-python](https://github.com/ollama/ollama-python)). Everything the templates do is a few lines there, and a script can read files, run on its own and talk to other programs. *Teaches: the bot as a program, not a page.*
2. **Find by meaning.** Turn your notes into embeddings with `nomic-embed-text` (Ollama's `/api/embed`), save them, and find the closest ones to each message. Start with a plain file; move to a small database such as Chroma when you have a lot. *Teaches: how retrieval really works, and what "similar" means to a model.*
3. **A local voice.** Listen with Whisper ([whisper.cpp](https://github.com/ggml-org/whisper.cpp) runs well on laptops) and speak with Piper, a small text-to-speech tool. Both run on your laptop, so your voice stays there too. *Teaches: the full chain from sound to text to reply to sound, and where each part runs.*
4. **Let it act.** Ollama supports "tools": you describe a function, such as saving a note or checking the date, and the model can ask to use it. Or skip the model's choice and run the script on a schedule (cron on Mac, Task Scheduler on Windows). *Teaches: the difference between a bot that talks and one that does things.*
5. **Put it somewhere.** Run it on a Raspberry Pi in a room, or on one shared computer that others reach over the network (see the `OLLAMA_URL` EXTEND note in the code). *Teaches: hosting, and who a bot belongs to once others use it.*

Write down your plan as a chain before you build it: *what goes in, what happens to it, what comes out, and where each step runs.* If a step needs the internet, decide whether that's fine.

### Change how it feels (small edits)

- **Fonts and colours.** Open `style.css` in your text editor. The first three sections are the controls: fonts shared by every page, then colours for the chat bot, then colours for the mirror bot. Each value has a note saying what it changes. Save, then refresh the page.
- **The fonts.** Rubik and Roboto Mono are stored in `fonts.css`, so they work without the internet. To use other fonts, change the two names in section 1 of `style.css`. Any font installed on your laptop works by its name.
- **Words on the screen.** Change labels like "Say something to begin" or "Reflect" in the HTML.
- **How replies look.** Ask for one sentence, a list of three words, or a postcard in the instructions, then style the reply to match.

### Change how you interact with it

- **No typing at all.** Replace the chat box with one button that sends the same request each time, like drawing a card from a deck. Its instructions could be: "Give me one short provocation for my work today."
- **Give it something to refer to.** For a little, paste it into the instructions under a heading like "What you know about me". For more, use **notes it can search**. To change how many passages it finds, change `HOW_MANY` in the chat file.
- **Make it find by meaning.** Ollama can turn text into "embeddings" with a model like `nomic-embed-text`, so notes can be matched by meaning, not just shared words. This is the next step after the simple search, and needs a little more code.
- **Talk instead of typing.** The chat bot has a microphone button, added by `voice.js`. Click it, speak, then click ■. A small Whisper speech model turns what you said into text in your browser, and puts it in the message box so you can check it before sending. The first click downloads the speech model (about 40 MB, not your voice), so that needs the internet. To change the speech model, or send straight away, see the settings at the top of `voice.js`. To remove the button, delete the `voice.js` line at the bottom of `chat.html`.
- **Why not the browser's own speech recognition?** It's easier to code, but in Chrome your audio is sent to Google to be turned into text, and some setups of Safari send it to Apple. Try both, and notice the difference.

### Give it a memory

Within one conversation, the bot already remembers: the whole conversation is sent each time, which you can see in "prompt sent to model". Close the page and it forgets. A memory that lasts is the same idea: text that gets put back into the prompt. Each step below is a small change from the last.

1. **Memory in the instructions.** No code needed. Add a heading such as "What you know about me" to the instructions, and write a few lines under it. *Teaches: memory is just more text in the prompt.*
2. **A memory box that's kept.** Add a box to the page for those lines, save what's in it with `localStorage`, and add it to the prompt each time, after the instructions. It survives closing the page, but only in that one browser. Add a "forget everything" button too, especially on a shared laptop. *Teaches: where memory is stored, and how easily it's lost.*
3. **The bot suggests what to remember.** Add a "remember this" button under a reply. It sends the conversation back to the model with a request like "Write one short line about me worth remembering", and adds the answer to the box, where you can edit or delete it. Small models often choose oddly. *Teaches: what it's like when something else decides what's worth keeping.*
4. **Memory as a file.** Use a small script outside the browser (step 1 of *A bigger build*) to keep the memory in a text file in the bot's folder. It lasts across browsers, and you can open and read it like any other file. *Teaches: persistence, and memory you can inspect.*
5. **Memory that grows.** Once there's too much to send every time, search past conversations for the parts that matter to each message, the same idea as *notes it can search*. This is roughly how commercial chatbots remember. *Teaches: why memory and retrieval are the same problem.*

Questions to design with, at any step:

- Who decides what's remembered: you, or the bot?
- Can you see all of it, change it, delete it?
- Where does it live, and who else can read it?
- When should it forget?

Try asking the same questions of a commercial chatbot's memory.

### Connect it to your practice

- **Run it at a set time.** A small script can send your notes to the model every evening and save the reflection, like a diary that writes back.
- **Keep its notes.** The chat forgets your notes when you close the page. To keep them, or to watch a folder for changes, you'll need a small script outside the browser.
- **Link it to tools you already use**, like a notes app or a drawing tool.

A good place to start: which ideas from your blueprint didn't fit today?


## If something goes wrong

### A yellow box says there's a typo

Something in the file can't be read, most often a missing backtick ( ` ), quote or comma in YOUR BOT. Undo your last change, or look near the line number it gives. Then save and refresh.

### If the check page can't connect

Follow what the page says. If Ollama is closed, open it. If the page shows a setup line, paste it into Terminal or PowerShell. If it still won't connect, the text-file bot (`Modelfile.txt`) works without the browser.

### "The model isn't installed"

Run `ollama pull` followed by the model name shown in the message, or pick a different model from the menu. If the menu says no models were found, open `check.html`.

### Replies are very slow

The first reply is always slower while the model loads. If it stays slow, close other apps, try a smaller model, or pair up with someone.


## Further reading

- [Ollama documentation](https://docs.ollama.com) and [model library](https://ollama.com/library)
- [Using Hugging Face models with Ollama](https://huggingface.co/docs/hub/en/ollama)
- [Tracery](https://tracery.io), a tool for making generative text bots without a language model
- Kate Compton, *So you want to build a generator*, a friendly introduction to generative design
- Allison Parrish's teaching materials on computational poetry and text generation
- [The Electronic Literature Collection](https://collection.eliterature.org), an archive of generative and electronic writing
