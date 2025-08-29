const SDK = globalThis.SDK;

////////////////////////////////////////////
// NEVER CHANGE THE BEHAVIOR ID AFTER RELEASE
const BEHAVIOR_ID = "MBY_BounceBall";
////////////////////////////////////////////

const BEHAVIOR_CATEGORY = "general";

const BEHAVIOR_CLASS = SDK.Behaviors.MBY_BounceBall = class BounceBallBehavior extends SDK.IBehaviorBase
{
	constructor()
	{
		super(BEHAVIOR_ID);
		
		SDK.Lang.PushContext("behaviors." + BEHAVIOR_ID.toLowerCase());
		
		this._info.SetName(globalThis.lang(".name"));
		this._info.SetDescription(globalThis.lang(".description"));
		this._info.SetCategory(BEHAVIOR_CATEGORY);
		this._info.SetAuthor("MBY");
		this._info.SetHelpUrl(globalThis.lang(".help-url"));
		
		this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
		
		SDK.Lang.PushContext(".properties");
		
		this._info.SetProperties([
			new SDK.PluginProperty("float", "initial-speed", 0),
			new SDK.PluginProperty("float", "initial-angle-deg", 0),
			new SDK.PluginProperty("float", "restitution", 0.8),
			new SDK.PluginProperty("check", "enabled", true),
			new SDK.PluginProperty("float", "min-speed-to-stop", 5),
			new SDK.PluginProperty("integer", "max-bounces", -1),
			new SDK.PluginProperty("integer", "max-substeps", 8),
			new SDK.PluginProperty("float", "max-step-distance", 8),
			new SDK.PluginProperty("float", "separation-epsilon", 0.5),
			// New options
			new SDK.PluginProperty("check", "use-surface-normal", false),
			new SDK.PluginProperty("check", "constant-speed-enabled", false),
			new SDK.PluginProperty("float", "constant-speed", 0)
		]);
		
		SDK.Lang.PopContext();
		SDK.Lang.PopContext();
	}
};

BEHAVIOR_CLASS.Register(BEHAVIOR_ID, BEHAVIOR_CLASS);
