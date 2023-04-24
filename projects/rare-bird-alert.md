---
title: Rare Bird Alert
layout: project-page.njk
liveUrl: "https://rarebird.parkerdavis.dev/US-AZ-013?days=7"
githubUrl: "https://github.com/parkerdavis1/eBirdRareBird"
description: "Alternative to eBird's Rare Bird Alerts"
date: 2023-03-01
---
<div class="reading-width">

<a href="https://rarebird.parkerdavis.dev/US-AZ-013?days=7">

{% image "assets/images/rare-bird-alert/rba-dark3.png", "RBA dark mode" %}

</a>

I created this full stack multi-page app using Sveltekit and TailwindCSS. It uses eBird's own RESTful API to gather and summarize large amounts of data with sorting and grouping by species and location, greatly reducing window scroll height when compared to eBird original design. It is progressively enhanced with essential data being loaded with no client-side javascript required.

For the design, I incorporated some of the more modern design elements found in other parts of eBird such as boldly colored title and filter bars, filter tags, as well as incorporating fades and slide-in animations for details and filter modals.

</div>
