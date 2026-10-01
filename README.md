# software-project

🚀 **Live Application:** [https://pomodoro-notetaker.netlify.app/](https://pomodoro-notetaker.netlify.app/)

## `Product Vision`

Creating a website where poeple can access the features of three separate softwares (Pomodoro Timer, Note Taking and Scheduling) at once. Here people will be able to use pomodoro timer along with Note taking and can also schedule their important events in the same website. Currently there is seperate apps to do this three tasks but here I am taking it into one webapp so that people can access it from anywhere.

## `AI Log`

### [Added Note Taking Feature] — [30 September, 2026]

- _Tool(s) used:_ Gemini
- _What I asked for:_ Guidance and code to persist note data in `localStorage`.
- _What I kept as-is:_ The core logic for saving, retrieving, and updating notes in `localStorage`.
- _What I changed or rejected, and why:_ Removed the AI given styling to match my project's UI design, and removed extra features like image attachments that were outside the scope of my feature.
- _Something the AI got wrong that I had to catch:_ It didn't handle null checks when `localStorage` is empty on first load, which threw a runtime error during initialization.
