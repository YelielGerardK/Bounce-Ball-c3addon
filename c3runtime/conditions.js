
const C3 = globalThis.C3;

C3.Behaviors.MBY_BounceBall.Cnds =
{
	OnBounce()
	{
		return true;
	},
	
	OnStop()
	{
		return true;
	},
	
	CompareBounceCount(cmp, n)
	{
		return C3.compare(this.bounceCount, cmp, n);
	},
	
	IsEnabled()
	{
		return !!this.isEnabled;
	}
};
