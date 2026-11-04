# Recon: BetterMe Health Coaching (iOS and Android)

Public sources only. No account, no code, no network capture. Screens and copy are not copied.

## Sources
| source | url |
| --- | --- |
| App Store listing | https://apps.apple.com/app/1264546236 |
| Store screenshot descriptions | https://mwm.ai/ko/apps/betterme-health-coaching/1264546236 |
| Onboarding and paywall analysis | https://screensdesign.com/showcase/betterme-health-coaching |
| Feature overview (own site) | https://betterme.world/articles/what-is-betterme-app/amp/ |
| Review: features | https://themanual.com/fitness/betterme-health-coaching-app-experience |
| Review: complaints | https://unstar.app/blog/is-betterme-legit-worth-it-fitness-app-reviews-2026 |
| Review: pricing and personalisation | https://nutrola.app/en/blog/is-betterme-still-worth-it-2026 |
| Pricing (in app purchases) | https://apppricinglab.com/app/apple/1264546236 |

## Core loop
Quiz, personal plan, today's workout (guided with timer), daily routine ticks (water, steps, meals), progress.

## Screens
| ID | screen | purpose |
| --- | --- | --- |
| S01 | Onboarding quiz | one question per screen: goal, body, activity, focus, days |
| S02 | Plan ready | summary of the plan and targets |
| S03 | Today | today's workout plus daily routine (water, steps, meals, breathing) |
| S04 | Plan / journey | day by day plan (store shows a 15 day plan) |
| S05 | Workout player | timer, calories, next exercise preview |
| S06 | Workout library | Pilates, calisthenics, yoga, home workouts |
| S07 | Challenges | paid add on programmes |
| S08 | Meals | recipes with kcal and cooking time |
| S09 | Mind | breathing, mood, cognitive tips |
| S10 | Progress | weight, steps, health metrics |
| S11 | Coach chat | 1 to 1 human coaching (paid) |
| S12 | Paywall | subscription offer after the quiz |

## Flows
F01 First run: S01 > S02 > S03 (BetterMe puts S12 between S02 and S03)
F02 Daily workout: S03 > S05 > summary > S03  (target: 1 tap from Today)
F03 Log water: S03, tap a glass
F04 Log weight: S10 > enter weight > chart
F05 Challenge day: S07 > day N > S05
F06 Cook a meal: S03 or S08 > recipe > mark eaten
F07 Breathe: S03 or S09 > session

## Data model (inferred)
Profile (goal, sex, age, height, weight, goal weight, activity, focus areas, days)
Session (workout, date, sets) · Weight entry (date, kg) · Measurements (date, waist...) · Photo (date, image)
Daily (date, water ml, steps, meals eaten, breathing minutes, mood) · Challenge (id, start date, days done)

## Cannot be cloned
Human coaches, Apple Health and Watch sync from a web app, their recipe and video content, their user base.

## Size
M. Hard parts: progress photos on device, health data without Apple Health, payments for a web app.
