jQuery.sap.declare("sap.ui.ZTime_Entry.MyRouter");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("sap.ui.core.routing.Router");

sap.ui.core.routing.Router.extend("sap.ui.ZTime_Entry.MyRouter", {
	
	constructor : function() {
		sap.ui.core.routing.Router.apply(this, arguments);
		this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this);
	},

	/**
	 * Changes the view without changing the hash.
	 * 
	 * @param {object} oOptions must have the following properties
	 * <ul>
	 * 	<li> currentView : the view you start the navigation from.</li>
	 * 	<li> targetViewName : the fully qualified name of the view you want to navigate to.</li>
	 * 	<li> targetViewType : the viewtype eg: XML</li>
	 * 	<li> isMaster : default is false, true if the view should be put in the master</li>
	 * 	<li> transition : default is "show" the navigation transition</li>
	 * 	<li> data : the data passed to the navContainers life cycle events</li>
	 * </ul>
	 * @public
	 */
	navToWithoutHash : function (oOptions) {
		var oApp = this._findApp(oOptions.currentView);

		// Load view, add it to the page aggregation, and navigate to it
		var oView = this.getView(oOptions.targetViewName, oOptions.targetViewType);
		oApp.addPage(oView, oOptions.isMaster);
		oApp.to(oView.getId(), oOptions.transition || "show", oOptions.data);
	},	
	
	myNavBack : function(sRoute, mData) {
		var sPreviousHash = this.previousHash();

		//The history contains a previous entry
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			var bReplace = true; // otherwise we go backwards with a forward history
			this.navTo(sRoute, mData, bReplace);
		}
	},
	
	_findApp : function(oControl) {
		var sAncestorControlName = "fioriContent";

		if (oControl instanceof sap.ui.core.mvc.View && oControl.byId(sAncestorControlName)) {
			return oControl.byId(sAncestorControlName);
		}

		return oControl.getParent() ? this._findApp(oControl.getParent(), sAncestorControlName) : null;
	},
	
	previousHash : function(){
		var oHistory = sap.ui.core.routing.History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();
		
		return sPreviousHash;
	}
});

