
const C3 = globalThis.C3;

C3.Behaviors.MBY_BounceBall.Instance = class BounceBallBehaviorInstance extends globalThis.ISDKBehaviorInstanceBase
{
	constructor()
	{
		super();
		
		// Internal state
		this._vx = 0;
		this._vy = 0;
		this._isEnabled = true;
		this._restitution = 0.8;
		this._minSpeedToStop = 5;
		this._maxBounces = -1;
		this._bounceCount = 0;
		this._maxSubsteps = 8;
		this._maxStepDistance = 8;
		this._separationEpsilon = 0.5;
		this._lastBounceAxis = "";
		this._dtMax = Infinity; // optional clamp
		// New options
		this._useSurfaceNormal = false;
		this._constantBounceSpeedEnabled = false;
		this._constantBounceSpeed = 0;
		
		const properties = this._getInitProperties();
		if (properties)
		{
			const initialSpeed = properties[0] || 0;
			const initialAngleDeg = properties[1] || 0;
			const rad = initialAngleDeg * Math.PI / 180;
			this._vx = initialSpeed * Math.cos(rad);
			this._vy = initialSpeed * Math.sin(rad);
			this._restitution = properties[2];
			this._isEnabled = !!properties[3];
			this._minSpeedToStop = properties[4];
			this._maxBounces = properties[5];
			this._maxSubsteps = Math.max(1, properties[6] | 0);
			this._maxStepDistance = Math.max(0.0001, properties[7]);
			this._separationEpsilon = Math.max(0, properties[8]);
			this._useSurfaceNormal = !!properties[9];
			this._constantBounceSpeedEnabled = !!properties[10];
			this._constantBounceSpeed = Math.max(0, properties[11] || 0);
		}
		
		this._setTicking(this._isEnabled);
	}

	_release()
	{
		super._release();
	}
	
	// Helpers
	_getSpeed()
	{
		return Math.hypot(this._vx, this._vy);
	}
	
	_getAngleDeg()
	{
		return Math.atan2(this._vy, this._vx) * 180 / Math.PI;
	}

	// Helpers for normal-based bounce
	_reflectVelocityWithNormal(nx, ny, force = false)
	{
		// nx, ny must be normalized
		const dot = this._vx * nx + this._vy * ny;
		// When 'force' is true, reflect even if the object velocity is not pointing in to the surface
		// (e.g. a fast-moving solid pushed in to us). This handles dynamic/moving solids better.
		if (force || dot < 0)
		{
			const scale = (1 + this._restitution) * dot;
			this._vx -= scale * nx;
			this._vy -= scale * ny;
		}
	}

	_computeMTVFromOverlap(maxDist, step, dirCount)
	{
		let bestDist = Infinity;
		let bestDx = 0, bestDy = 0;
		const dirs = Math.max(4, dirCount | 0);
		for (let i = 0; i < dirs; i++)
		{
			const ang = (i * 2 * Math.PI) / dirs;
			const ux = Math.cos(ang), uy = Math.sin(ang);
			let d = step;
			while (d <= maxDist)
			{
				this.instance.offsetPosition(ux * d, uy * d);
				const overlap = this.runtime.collisions.testOverlapSolid(this.instance);
				this.instance.offsetPosition(-ux * d, -uy * d);
				if (!overlap)
				{
					if (d < bestDist)
					{
						bestDist = d;
						bestDx = ux * d;
						bestDy = uy * d;
					}
					break;
				}
				d += step;
			}
		}
		if (isFinite(bestDist))
			return { dx: bestDx, dy: bestDy };
		else
			return null;
	}

	// Try progressively larger search radii to escape deep overlaps (e.g. when a fast/large solid moved in to us)
	_computeMTVFromOverlapAdaptive(dirCount = 24)
	{
		const radii = [
			Math.max(this._maxStepDistance * 2, 16),
			64,
			256,
			1024
		];
		for (const r of radii)
		{
			const step = Math.max(1, Math.min(r / 8, 8));
			const mtv = this._computeMTVFromOverlap(r, step, dirCount);
			if (mtv)
				return mtv;
		}
		return null;
	}

	// Tick
	_tick()
	{
		let dt = this.instance.dt;
		if (isFinite(this._dtMax))
			dt = Math.min(dt, this._dtMax);
		
		const speed = this._getSpeed();
		let steps = 1;
		if (this._maxStepDistance > 0)
			steps = Math.ceil((speed * dt) / this._maxStepDistance);
		steps = Math.max(1, Math.min(this._maxSubsteps, steps));
		const stepDt = dt / steps;
		
		for (let i = 0; i < steps; i++)
		{
			const dx = this._vx * stepDt;
			const dy = this._vy * stepDt;
			// Detect if we were already overlapping before moving (e.g. a moving solid pushed in to us)
			const overlappedBefore = this.runtime.collisions.testOverlapSolid(this.instance);
			let didBounce = false;
			
			this.instance.offsetPosition(dx, dy);
			
			if (this.runtime.collisions.testOverlapSolid(this.instance))
			{
				let bounceAxis = "";

				if (this._useSurfaceNormal)
				{
					// Try to escape overlap using adaptive MTV (works for deep overlaps as well)
					const mtv = this._computeMTVFromOverlapAdaptive(24);
					if (mtv)
					{
						this.instance.offsetPosition(mtv.dx, mtv.dy);
						const len = Math.hypot(mtv.dx, mtv.dy);
						if (len > 0)
						{
							const nx = mtv.dx / len, ny = mtv.dy / len;
							// Force reflection to handle moving solids pushing in to us
							this._reflectVelocityWithNormal(nx, ny, true);
							this.instance.offsetPosition(nx * this._separationEpsilon, ny * this._separationEpsilon);
						}
						bounceAxis = "xy";
						didBounce = true;
					}
				}

				if (!bounceAxis)
				{
					// Fallback: axis-specific resolution
					// rollback to pre-move
					this.instance.offsetPosition(-dx, -dy);
					
					// test X only
					this.instance.offsetPosition(dx, 0);
					const blockX = this.runtime.collisions.testOverlapSolid(this.instance);
					this.instance.offsetPosition(-dx, 0);
					
					// test Y only
					this.instance.offsetPosition(0, dy);
					const blockY = this.runtime.collisions.testOverlapSolid(this.instance);
					this.instance.offsetPosition(0, -dy);
					
					let axis = "";
					if (blockX)
					{
						this._vx = -this._vx * this._restitution;
						axis += "x";
					}
					if (blockY)
					{
						this._vy = -this._vy * this._restitution;
						axis += "y";
					}
					if (!blockX && !blockY)
					{
						// Fallback: invert dominant axis
						if (Math.abs(dx) >= Math.abs(dy))
						{
							this._vx = -this._vx * this._restitution;
							axis = "x";
						}
						else
						{
							this._vy = -this._vy * this._restitution;
							axis = "y";
						}
					}
					
					// Nudge out to avoid sticking along velocity direction
					const nv = this._getSpeed();
					if (nv > 0)
					{
						const nx = this._vx / nv, ny = this._vy / nv;
						this.instance.offsetPosition(nx * this._separationEpsilon, ny * this._separationEpsilon);
						if (this.runtime.collisions.testOverlapSolid(this.instance))
							this.instance.offsetPosition(-nx * this._separationEpsilon, -ny * this._separationEpsilon);
					}
					bounceAxis = axis || "xy";
					didBounce = true;
				}

				// Deep overlap recovery only if still overlapping after resolution
				if (this.runtime.collisions.testOverlapSolid(this.instance))
				{
					const mtv2 = this._computeMTVFromOverlapAdaptive(24);
					if (mtv2)
					{
						const len2 = Math.hypot(mtv2.dx, mtv2.dy);
						const nx2 = len2 > 0 ? mtv2.dx / len2 : 0;
						const ny2 = len2 > 0 ? mtv2.dy / len2 : 0;
						this.instance.offsetPosition(mtv2.dx, mtv2.dy);
						this.instance.offsetPosition(nx2 * this._separationEpsilon, ny2 * this._separationEpsilon);
						this._reflectVelocityWithNormal(nx2, ny2, true);
						bounceAxis = "xy";
						didBounce = true;
					}
				}

				// Commit bounce event and bookkeeping once
				if (didBounce)
				{
					this._lastBounceAxis = bounceAxis || "xy";
					this._bounceCount++;
					this._trigger(C3.Behaviors.MBY_BounceBall.Cnds.OnBounce);
				}
			}

			// Optional constant speed only after an actual bounce
			if (didBounce && this._constantBounceSpeedEnabled && this._constantBounceSpeed > 0)
			{
				const a = Math.atan2(this._vy, this._vx);
				this._vx = this._constantBounceSpeed * Math.cos(a);
				this._vy = this._constantBounceSpeed * Math.sin(a);
			}
		}
	}
	
	// Save/load state
	_saveToJson()
	{
		return {
			"vx": this._vx,
			"vy": this._vy,
			"en": this._isEnabled,
			"bc": this._bounceCount
		};
	}

	_loadFromJson(o)
	{
		this._vx = o["vx"]; this._vy = o["vy"]; this._isEnabled = !!o["en"]; this._bounceCount = o["bc"] | 0;
		this._setTicking(this._isEnabled);
	}
	
	// Public API
	set isEnabled(e)
	{
		this._isEnabled = !!e;
		this._setTicking(this._isEnabled);
	}
	get isEnabled() { return this._isEnabled; }
	
	setVelocity(vx, vy)
	{
		this._vx = vx; this._vy = vy;
	}
	
	addVelocity(ax, ay)
	{
		this._vx += ax; this._vy += ay;
	}
	
	setSpeedAngle(speed, angleDeg)
	{
		const r = angleDeg * Math.PI / 180;
		this._vx = speed * Math.cos(r);
		this._vy = speed * Math.sin(r);
	}
	
	set restitution(e)
	{
		this._restitution = Math.max(0, Math.min(1, e));
	}
	get restitution() { return this._restitution; }
	
	set maxBounces(n) { this._maxBounces = (n|0); }
	get maxBounces() { return this._maxBounces; }
	
	resetBounceCount() { this._bounceCount = 0; }
	get bounceCount() { return this._bounceCount; }
	
	set minSpeedToStop(v) { this._minSpeedToStop = Math.max(0, v); }
	get minSpeedToStop() { return this._minSpeedToStop; }
	
	setSubstepping(maxSubsteps, maxStepDistance)
	{
		this._maxSubsteps = Math.max(1, maxSubsteps|0);
		this._maxStepDistance = Math.max(0.0001, maxStepDistance);
	}
	
	set separationEpsilon(eps) { this._separationEpsilon = Math.max(0, eps); }
	get separationEpsilon() { return this._separationEpsilon; }
	
	get velocityX() { return this._vx; }
	get velocityY() { return this._vy; }
	get speed() { return this._getSpeed(); }
	get angleDeg() { return this._getAngleDeg(); }
	get lastBounceAxis() { return this._lastBounceAxis; }
	
	// New API for normal bounce + constant speed
	set useSurfaceNormal(e) { this._useSurfaceNormal = !!e; }
	get useSurfaceNormal() { return this._useSurfaceNormal; }
	
	set constantBounceSpeedEnabled(e) { this._constantBounceSpeedEnabled = !!e; }
	get constantBounceSpeedEnabled() { return this._constantBounceSpeedEnabled; }
	
	set constantBounceSpeed(v) { this._constantBounceSpeed = Math.max(0, v); }
	get constantBounceSpeed() { return this._constantBounceSpeed; }
	
	_getDebuggerProperties()
	{
		const prefix = "behaviors.mby_bounceball";
		return [{
			title: "$" + this.behaviorType.name,
			properties: [
				{ name: prefix + ".properties.restitution.name", value: this.restitution, onedit: v => this.restitution = v },
				{ name: prefix + ".properties.enabled.name", value: this.isEnabled, onedit: v => this.isEnabled = v }
			]
		}];
	}
};
