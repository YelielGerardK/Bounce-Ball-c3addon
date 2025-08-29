# Bounce ball — Simple usage guide (EN)

This behavior moves an object like a bouncing ball that collides with Solid objects.

## Quick start
- Add the behavior to your Sprite.
- Place walls/floors with the Solid behavior.
- In properties, set Initial speed and Initial angle (deg).
- Run: the object bounces on Solids.

## Properties (Preferences)
- Initial speed: starting speed (px/s).
- Initial angle (deg): starting direction in degrees (0=right, 90=down).
- Restitution: energy kept on bounce [0–1] (1 = perfectly elastic).
- Enabled: start behavior active.
- Min speed to stop: stop when speed falls below this (px/s).
- Max bounces: stop after this many bounces (-1 = unlimited).
- Max substeps: upper limit of internal sub-steps to reduce tunneling.
- Max step distance: max distance per sub-step (pixels).
- Separation epsilon: tiny push after resolution to avoid sticking (pixels).
- Use surface normal: reflect using the collision surface normal (better on slopes/angled surfaces).
- Constant speed after bounce: keep speed constant after each bounce.
- Constant speed: speed to enforce after a bounce (px/s).

## Conditions
- On bounce (trigger): fires when a bounce is resolved.
- On stop (trigger): fires when the behavior stops (too slow or max bounces).
- Compare bounce count (cmp, count): compare current bounce count.
- Is enabled: check if the behavior is enabled.

## Actions
- Set enabled(enabled): enable/disable the behavior.
- Set velocity(vx, vy): set velocity in px/s.
- Set speed & angle(speed, angleDeg): set speed (px/s) and direction (deg).
- Add velocity(ax, ay): add an impulse to velocity (px/s).
- Set restitution(value 0–1): set bounce energy retention.
- Set max bounces(count): -1 = unlimited.
- Reset bounce count(): reset internal counter to 0.
- Set min speed to stop(speed): stop below this speed.
- Set substepping(maxSubsteps, maxStepDistance): configure sub-steps.
- Set separation epsilon(epsilon): small push to avoid sticking.
- Use surface normal(enabled): toggle normal-based reflection.
- Constant speed after bounce(enabled): toggle constant speed mode.
- Set constant speed(speed): enforced speed after each bounce.

## Expressions
- VelocityX: current X velocity (px/s).
- VelocityY: current Y velocity (px/s).
- Speed: current speed (px/s).
- Angle: current angle (degrees).
- BounceCount: number of bounces so far.
- LastBounceAxis: axis of last bounce: "x", "y", or "xy".

## Tips
- Increase Max substeps / lower Max step distance if the object is very fast to reduce tunneling.
- Use Separation epsilon to prevent sticking on corners.
- Enable Use surface normal for better behavior on sloped/rotated solids.
- Use Constant speed after bounce when you want arcade-like constant speed.

References:
- Construct Addon SDK — Defining ACES: https://www.construct.net/en/make-games/manuals/addon-sdk/guide/defining-aces
- Construct Addon SDK — Configuring behaviors: https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-behaviors