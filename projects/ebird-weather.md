---
title: RainCrow
layout: project-page.njk
liveUrl: "https://raincrow.netlify.app/"
githubUrl: "https://github.com/parkerdavis1/RainCrow"
description: "RainCrow is a web app to retrieve historical weather records for eBird checklists."
date: 2022-10-31
---
<!-- 
<div class="screenshot-container full-width">
    <div class="screenshot">
        <img src="/assets/images/RainCrowScreenshots/submitted.png" alt="">
    </div>
    <div class="screenshot">
        <img src="/assets/images/RainCrowScreenshots/pre-submit.png" alt="">
    </div>
    <div class="screenshot">
        <img src="/assets/images/RainCrowScreenshots/about.png" alt="">
    </div>
    <div class="screenshot">
        <img src="/assets/images/RainCrowScreenshots/options.png" alt="">
    </div>
</div> -->

<!-- <div class="image-slider full-width">
    <ul>
        <li>
            <img src="/assets/images/RainCrowScreenshots/submitted.png" alt="">
        </li>
        <li>
            <img src="/assets/images/RainCrowScreenshots/pre-submit.png" alt="">
        </li>
        <li>
            <img src="/assets/images/RainCrowScreenshots/about.png" alt="">
        </li>
        <li>
            <img src="/assets/images/RainCrowScreenshots/options.png" alt="">
        </li>
    </ul>
</div> -->

<div class="reading-width">

## Background

[eBird](https://ebird.org/about) is a global citizen science database where users submit checklists to contibute to a shared understanding of the world's bird life.

As a somewhat obsessive eBird user, I like to include weather observations in the comments for my checklists. Often when birding away from urban areas, the cell service is spotty to nonexistant so looking up current conditions in a standard weather app doesn't work. I wanted to create a streamlined way to fetch historical weather data for a specific location and time after returning from far afield while also practicing writing asynchronous javascript and fetching data from APIs.

## Description

To get weather data for a checklist that is already submitted to eBird, all the user has to do is input the checklist ID (or the entire URL) for a checklist and click "Get Weather". The app gathers the weather conditions for the location and duration of the checklist and displays them below the input form. The data is copied with the "Copy to Clipboard" button and can now be pasted in the comments section for a given checklist.

{% image "assets/images/RainCrowScreenshots/submitted.png", "RainCrow eBird Weather submitted screenshot" %}

If the user wants to gather weather data before a checklist is submitted, they can use the "Pre-Submit" form. This removes the need to edit a checklist after submitting it. It is especially useful for shared checklists, allowing weather observations to be shared with all observers.

It does require more input from the user, but I tried to make the input as painless as possible. The locate button automatically inputs your current GPS coordinates. The date and start time automatically pre-fill the current date and the time rounded down to the nearest hour. The duration accepts minutes, mimicking data fields on eBird.

<!-- ![eBird Weather app pre-submit screenshot](/assets/images/RainCrowScreenshots/pre-submit.png) -->
{% image "assets/images/RainCrowScreenshots/pre-submit.png", "RainCrow eBird Weather pre-submit screenshot" %}

The app came a long way from the original build, though I do still have a soft spot for the super minimalist look:

<picture class="small-image">
    <img src="/assets/images/ebirdweather-first.png" alt="First version of RainCrow">
</picture>


## Challenges

### Erratic API returns with Visual Crossing

In my first implementation, I used the [Visual Crossing "Timeline Weather" API](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/) because it was the only service I could find to make free historical weather API calls.

In my initial testing, I found Visual Crossing's results to be inconsistent with real-time weather data collected at the start and end of each checklist. I realized that for each API call, Visual Crossing rounds the inputed time down to the base hour. The weather data returned for a 11:59am call would be for 11:00am (59 minutes earlier) instead of the actual time or 12:00pm (1 minute later). This was not nearly accurate enough to be useful, so I implemented functions to get the weather data for the upper and lower bounds of a time. If I wanted weather data for 10:30am, I would fetch data for 10:00am and 11:00am. A simple calculation could then give a coarse estimate of the temperature at the desired minute.

Each checklist needs weather for the start time and end time, and each of those times requires two weather API calls to get the upper and lower bounds. To increase effeciency and reduce redundant API calls I implemented a function to only make the minimum necessary API calls in the cases where there are shared times between upper and lower bounds of start and end times.

I was relatively satisfied with this implementation in many cases but I found that using the app too close to the requested times (such as right after finishing an eBird checklist) would result in erratic data results from Visual Crossing. There was no way to predict whether the API would return forecast weather data or the most recent recorded observations (which could be any minute, not on the hour), or the standard historical data (on the hour). There were somewhat convuluted ways of dealing with this inconsistency but I decided I might try another Weather API to see if that might be simpler.

### UNIX time stamps with OpenWeather

Open Weather recently introduced the ["One Call" API](https://openweathermap.org/api/one-call-3#history) which is very similar to Visual Crossing so I decided to give it a try.

One perk was the API automatically returned weather for the minute that you request, instead of having to do multiple API requests and calculations. This improved efficiency and greatly reduced complexity for very recent weather requests.

OpenWeather does require inputting a UNIX timestamp for queries. Because the location of a checklist is not necessarily in the same timezone as the user and UNIX timestamps are based on UTC time, I needed some way to find the timezone offset for any given location. I looked into a few tools and services but they seemed overly bloated, complex or too expensive.

Eventually I realized OpenWeather provides timezone offset data in its API returns, so it was only a matter of making a pre-weather query to get the timezone offset for a location, then use that data to calculate the necessary UNIX timestamps to make the actual weather requests. Some minor inefficiency but necessary due to this specific API's quirks.

## Svelte and added customization

I decided I wanted to add some user customization to the app so I recreated the app in [Svelte](https://svelte.dev/). I added an options button to allow the user to pick which weather data to include in their checklist, which has a preview field at the top. I added regex form validation and refined the error handling.

<!-- ![RainBird options menu screenshot](/assets/images/RainCrowScreenshots/options.png) -->
{% image "assets/images/RainCrowScreenshots/options.png", "RainBird options menu screenshot" %}

## User Feedback

After sending the app to some other eBird users, I continued to refine the UI/UX. I added the ability to enter the entire URL for a checklist instead of just the Checklist ID. The About section was edited to be as concise as possible while addressing most of the questions and issues users experienced. I made the options update **localStorage** so each user's preferred data-to-include and units are retained between uses.

<!-- ![RainBird About menu screenshot](/assets/images/RainCrowScreenshots/about.png) -->
{% image "assets/images/RainCrowScreenshots/about.png", "RainBird about menu screenshot" %}

## Collaboration & Internationalization (i18n)

[Marie-Andrée Boucher-Beaulieu](https://ebird.org/profile/MjczODA4OQ/) volunteered to incorporate an i18n library into the RainCrow codebase and translate the text into French. This paved the way for [JC Paniagua](https://ebird.org/profile/OTc2Mjc0/) to contribute a spanish translation as well. The opportunity to collaborate with others on this project has been really gratifying.

## Looking Forward

While being amazing resources that are free in low-use cases, the primary limitations of the eBird Weather app are related to the weather APIs it uses. The times I imagine this app would be most useful are when the user returns from birding in remote corners of the world, deep in canyons or high on mountain tops where there is no cell service. Unfortunately, there are rarely weather stations close to these locations, so the weather data returned from the APIs does not necessarily reflect the weather of the microhabitat where you actually were. There is much more room for error in these remote locations.

After the 1000 free daily API requests, OpenWeather is on the expensive side ($0.002 per request) for use in an app that does not generate revenue. When serving thousands of requests a day this adds up over the course of a year (1000 requests x $0.002 x 365 days = $730 a year). If Visual Crossing (at $0.0001 per request) tweaked their API to return sub-hourly historical data I would consider switching back. In the meantime, I will likely add a "Buy Me A Coffee" donation button and limit each users requests to 5-10 requests a day.

</div>
