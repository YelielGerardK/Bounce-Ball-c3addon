
const C3 = globalThis.C3;

// Actions call the public API so they match scripting behavior
C3.Behaviors.MBY_BounceBall.Acts =
{
	SetEnabled(e)
	{
		this.isEnabled = e;
	},
	
	SetVelocity(vx, vy)
	{
		this.setVelocity(vx, vy);
	},
	
	SetSpeedAngle(speed, angleDeg)
	{
		this.setSpeedAngle(speed, angleDeg);
	},
	
	AddVelocity(ax, ay)
	{
		this.addVelocity(ax, ay);
	},
	
	SetRestitution(e)
	{
		this.restitution = e;
	},
	
	SetMaxBounces(n)
	{
		this.maxBounces = n;
	},
	
	ResetBounceCount()
	{
		this.resetBounceCount();
	},
	
	SetMinSpeedToStop(v)
	{
		this.minSpeedToStop = v;
	},
	
	SetSubstepping(maxSubsteps, maxStepDistance)
	{
		this.setSubstepping(maxSubsteps, maxStepDistance);
	},
	
	SetSeparationEpsilon(eps)
	{
		this.separationEpsilon = eps;
	},

	// New actions
	SetUseSurfaceNormal(e)
	{
		this.useSurfaceNormal = e;
	},

	SetConstantSpeedEnabled(e)
	{
		this.constantBounceSpeedEnabled = e;
	},

	SetConstantSpeed(v)
	{
		this.constantBounceSpeed = v;
	}
};
