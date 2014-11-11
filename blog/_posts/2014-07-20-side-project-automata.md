---
layout: post
title:  "Side project: Automata"
date:   2014-07-20 18:59:00
category: post
---

<img src="http://i.imgur.com/Y6bDRNi.gif" />

<!-- more -->

Yesterday I started working on a small <a href="http://en.wikipedia.org/wiki/Life-like_cellular_automaton">Life-like cellular automaton</a> project which I'm calling "Automata" for the time being. I've always been really interested in <a href="http://www.bitstorm.org/gameoflife/">Conway's Game of Life</a> (<a href="http://pmav.eu/stuff/javascript-game-of-life-v3.1.1/">HTML5/Canvas version here</a>), as well as games like <a href="http://pandemic3.com/">Pandemic</a>, and getting to work with cell-like entities is an easy place to enter do some basic algorithm building. The idea behind this project is that it will eventually become a multiplayer, websockets-powered game where players have to conquer the largest amount of cells to win. They will be able to indirectly influence the performance of their cell army by giving "mutations" to specific cells, which will then propagate throughout the other cells. Meanwhile, the cells have a core set of rules that they abide by, very similar to Conway's game of life:

- Cells either move to or divide into a random empty space if it is available
- Cells "fight" with nearby individual enemy cells, having a 50% chance of winning against those cells
- Cells surrounded by three or more cells owned by a single opponent are consumed by that opponent

Working on this project has had me run into some pretty interesting bugs related to how I'm iterating over my two-dimensional array: left to right, then top down. I had to make the cells resulting from movement/division "inert" (eventually renamed to movedThisTurn) for the turn so that they wouldn't reproduce in the same turn they were created. It took me a while to figure out why cells in the top left would always multiply exponentially!

The randomness of this behavior also threw me for a loop. I was logging how many cells belonged to each owner, but after about 20 each, they would start to vary (before touching). I couldn't figure out why this was--at first I suspected a race condition--but then I realized that they would always start to vary after a certain point due to the simple random positioning, exposing more "open" areas for some cells and less for others.

<img src="http://i.imgur.com/tQpfjut.gif" />
<img src="http://i.imgur.com/mW5jpd2.gif" />
<img src="http://i.imgur.com/Wl68bOZ.gif" />
<img src="http://i.imgur.com/eWgYFCA.gif" />

There's something in the turn pattern that is causing the cells in the bottom right (purple) to win almost every time. My current working theory is that this is a subtle side-effect of evaluating left-to-right top-to-bottom, and I'm unsure what the best way to go about solving this problem would be. Right now I'm considering increasing the randomness by storing all of my cells in an array and randomly searching and executing turns on them, but I might have another way to eliminate the problem entirely. I'll loop back to this problem shortly.

I want cells to be able to "push" other cells, but since there is no physics or sophisticated state engine in place, all having one cell push another cell would mean that that cell would need to take its turn, then push another cell, and on, all the way until all cells have taken their turn. What happens to the original cell? Should I keep a reference to it then cycle back after I've applied my "forces"? The same issue happens recursively down to each cell I have push another cell.

Another way to deal with this would be to actually allow cells to occupy the same space, resulting in an interesting cause-and-effect between turns. If I allow cells to take up multiple spaces, I can visually mark where there are large clusters of cells, and make all cells have a priority to move out of a crowded space. I'm visualizing that this would result in a sort of "ebb and flow", similar to how large flocks of small birds move:

<div class="center">
	<a href="http://www.telegraph.co.uk/news/picturegalleries/picturesoftheday/7187689/Pictures-of-the-day-8-February-2010.html?image=11">
		<img src="http://i.telegraph.co.uk/multimedia/archive/01573/flock-birds_1573997i.jpg" />
	</a>
	<p>A massive flock of birds flies over Geumgang Lake in Gunsan, South Korea. (Photo taken from the Telegraph. Click for original source.)</p>
</div>

This would also potentially make room for more interesting combat dynamics between cells: instead of fighting neighbors, cells have the desire to collide with opposing cells and then attack them. Cells could have health, so that when they are attacked, their health is reduced by some amount but they can still fight back, escape, etc. All this could be marked visually, such as making clusters of cells darker by reducing the opacity of each cell when inside a cluster. This would also make some very interesting patterns appear at the edges where enemy cells meet and mix their colors. This would hopefully also be random enough that it would offset the bottom-right cells always winning--if not, I will need to make random cells take their turns instead of left-to-right top-to-bottom.

Some other thoughts:

- I'm currently working on mutation ideas. So far, I'm thinking about faster healing (ordinarily, cells would heal 1 point every 3 turns), more health, stronger attack, and "bombardier" (cells throw neighboring, weaker cells in a random direction).
- I'd like the mutations to NOT affect all cells at once. Rather, the player selects a specific cell and then they get a tint for that mutation. Over time, they duplicate and you can see "waves" of differently mutated cells.
- Still undecided as to whether or not cells should be able to have multiple mutations at once.

Thanks for reading! I'll update my progress soon--I like this project a lot.