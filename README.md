# Leonida Trophy Atlas — GTA VI Trophy Guide & Tracker

![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)
![rank](https://make.fun/badge/gta6-trophy-guide-01/luthiiiialvaro/gta6-trophy-guide-01/rank.svg)
![reward](https://make.fun/badge/gta6-trophy-guide-01/luthiiiialvaro/gta6-trophy-guide-01/reward.svg)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI** — official names, descriptions and grades, a cited guide for every trophy, a platinum roadmap, missable flags and a spoiler setting. Static files that open in a desktop browser and work with the network off.

## What it does

- **Tracker:** the full official list (1 Platinum, 2 Gold, 6 Silver, 46 Bronze) as a checklist. Tick a trophy off and it stays ticked — progress is saved in the browser (localStorage) and can be exported to a JSON file and imported back.
- **Filters:** by kind (story, missable, collectibles, activities, online), by grade, by earned status, and by search. One trophy is flagged missable — Positive Mental Attitude — with the Chapter 1 meditation that can pass you by.
- **Spoiler setting:** hide the names and descriptions of story trophies until you earn them. 28 of the 55 trophies are hidden on PlayStation until earned; this guide respects that.
- **Guides:** every trophy's detail pane has a guide in the author's own words, with its sources named (and linked where they are online). Where no source had confirmed a method yet at launch, the guide says so instead of guessing.
- **Platinum roadmap:** six stages in the order to play them — story first with chapter saves, strangers & side stories, partner & robbery, activities & collectibles, money & property, then 100% and the Platinum.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network at run time: every file it loads is under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Sources

Official trophy names, descriptions and grades as PlayStation publishes them, from the PS5 list as Exophase and PSNProfiles listed it (reported by Push Square, 18 November 2026). Guides draw on and cite Output Lag's GTA 6 Trophy List, PowerPyx, GTABase and GTA Vice City Hub, among others — see the Sources & notes view inside the app for the full list and how the hidden and missable flags were derived.

Leonida Trophy Atlas is an unofficial fan guide. It is not affiliated with Rockstar Games, Take-Two Interactive or PlayStation, and it shows no Rockstar logo or official artwork.
