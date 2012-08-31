# WireWorld-JS #
### A JavaScript/HTML5 Implementation of the WireWorld Cellular Automata ###

This is very much a work in progress.  Some of the code is messy and/or undocumented at this time.  I've tested this in
Google Chrome but it should work in all major browsers.

Rules of the Cellular Automata:
- Empty cell => Empty cell
- Wire head => Wire tail
- Wire tail => Conductor
- Conductor => Wire head if exactly 1 or 2 neighbors (including diagonals!) are wire head

These rules are applied to each cell in the world on each step.


Controls:
- Left click to change a cell
- Q changes your cell-type to Empty
- W changes your cell-type to Conductor
- E changes your cell-type to Wire head
- R changes your cell-type to Wire tail

Resources:
- http://en.wikipedia.org/wiki/Wireworld
- http://karlscherer.com/Wireworld.html
