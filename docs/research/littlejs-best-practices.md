# LittleJS Coding Best Practices Reference

These excerpts capture LittleJS engine guidance that we should mirror in our implementation plan. Source: [LittleJS documentation](https://killedbyapixel.github.io/LittleJS/docs/).

## Core Loop & Object Model
> "Object oriented system with base class engine object" and "Call `engineInit()` to start it up!"

This highlights that LittleJS expects the game loop to be orchestrated via `engineInit` and `EngineObject` lifecycles.

## Utilities for Math, Colors, Timing, and Randomness
> "Vector2 - fast, simple, easy 2D vector class", "Color - holds a rgba color with some math functions", "Timer - tracks time automatically", and "RandomGenerator - seeded random number generator"

The Utilities page emphasizes reusing these built-in helpers instead of rolling our own.

## Audio Handling
> "Create a sound object and cache the zzfx samples for later use"

Leaning on the built-in caching layer avoids redundant decoding work and keeps playback consistent.

## Tile Layers & Collision
> "Caches arrays of tiles to off screen canvas for fast rendering" and "Tile layers can also have collision with EngineObjects"

LittleJS encourages layering scenes through its tile layer system for both rendering speed and collision handling.

## Debug & Instrumentation
> "Press Esc to show debug overlay with mouse pick" and "Number keys toggle debug functions" (with time scaling and capture helpers)

Surfacing these toggles in our builds keeps instrumentation close at hand for QA and balancing.

> _All quotations pulled from the [LittleJS documentation site](https://killedbyapixel.github.io/LittleJS/docs/)._ 
