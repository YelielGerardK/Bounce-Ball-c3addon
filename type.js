
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors.MBY_BounceBall;

BEHAVIOR_CLASS.Type = class BounceBallBehaviorType extends SDK.IBehaviorTypeBase
{
	constructor(sdkBehavior, iBehaviorType)
	{
		super(sdkBehavior, iBehaviorType);
	}
};
