
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors.MBY_BounceBall;

BEHAVIOR_CLASS.Instance = class BounceBallBehaviorInstance extends SDK.IBehaviorInstanceBase
{
	constructor(sdkBehType, behInst)
	{
		super(sdkBehType, behInst);
	}
	
	Release()
	{
	}
	
	OnCreate()
	{
	}
	
	OnPropertyChanged(id, value)
	{
	}
	
	LoadC2Property(name, valueString)
	{
		return false; // not handled
	}
};
