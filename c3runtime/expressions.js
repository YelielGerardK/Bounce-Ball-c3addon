
const C3 = globalThis.C3;

C3.Behaviors.MBY_BounceBall.Exps =
{
	VelocityX()
	{
		return this.velocityX;
	},
	
	VelocityY()
	{
		return this.velocityY;
	},
	
	Speed()
	{
		return this.speed;
	},
	
	Angle()
	{
		return this.angleDeg;
	},
	
	BounceCount()
	{
		return this.bounceCount;
	},
	
	LastBounceAxis()
	{
		return this.lastBounceAxis;
	}
};
