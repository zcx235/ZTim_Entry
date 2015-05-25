jQuery.sap.require("sap.ui.ZTime_Entry.util.Formatter");

sap.ui.controller("sap.ui.ZTime_Entry.view.EETypePage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ZTime_Entry.view.EETypePage
*/
	onInit: function() {
//		this.oInitialInfoReadFinishedDeferred = jQuery.Deferred();
		
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
//		this._oComponent = sap.ui.core.Component.getOwnerComponentFor(this._oView);
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		
		var oEventBus = this._oComponent.getEventBus();
		
		this._oView.setBusy(true);
		var oModel = this._oComponent.getModel();
		var sUserPath = "USER_SET";
		
		var onSuccess = function(oSourceControl, oData){
			this._oView.setBusy(false);	
			if(oSourceControl.results)
			{
				var oUser = oSourceControl.results[0];
				var oUserModel = this._oComponent.getModel("USER");
				oUserModel.setProperty("/BNAME",oUser.BNAME);
				oUserModel.setProperty("/PERNR",oUser.PERNR);
				oUserModel.setProperty("/TIMEKEEPER",oUser.TIMEKEEPER);
				this._oComponent.setModel(oUserModel,"USER");
			}
//			this.oInitialInfoReadFinishedDeferred.resolve();
			this._oComponent.oInitialInfoReadFinishedDeferred.resolve();
			oEventBus.publish("EEType","InitialInfoReadFinished");
		};
		
		var onError = function(oError){
			this._oView.setBusy(false);
			this.oInitialInfoReadFinishedDeferred.resolve();
			oEventBus.publish("EEType","InitialInfoReadFailed");
		};
		
//		user jQuery.proxy to make "this" point to this controller
		var mParameters = {
				success: jQuery.proxy(onSuccess, this),
				error: jQuery.proxy(onError, this)	
		};
		
		oModel.read(sUserPath, mParameters);	
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ZTime_Entry.view.EETypePage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ZTime_Entry.view.EETypePage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ZTime_Entry.view.EETypePage
*/
//	onExit: function() {
//
//	}

	onRouteMatched : function(oEvent){
		
		var sName = oEvent.getParameter("name");

// Don't navto if it's not navto self
		if (sName !== "EE_Type_Page") {
			return;
		}
		
		this.waitForInitialInfoReading(function(){
			var oUserModel = this._oComponent.getModel("USER");
			oOptions = {};
			if( oUserModel.getProperty("/TIMEKEEPER") == "")
			{
//				oOptions.currentView = this.getView();
//				oOptions.targetViewName = "sap.ui.ZTime_Entry.view.EmployeeDetail";
//				oOptions.targetViewType = "XML";
//				this._oRouter.navToWithoutHash(oOptions);
//set true to replace the hash history. In this case, app will go back to launchpad page, not this page 					
				var date = new Date();
				var sendDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(date);
				var aParameters = {date : sendDate.substr(0,10)};
				this._oRouter.navTo("Employee_Detail",aParameters,true);
			}
			else
			{
				oOptions.currentView = this.getView();
				oOptions.targetViewName = "sap.ui.ZTime_Entry.view.ApproveList";
				oOptions.targetViewType = "XML";
				this._oRouter.navTo("Approve_List");
//				this._oRouter.navToWithoutHash(oOptions);
//				this._oRouter.navTo("Approve_List",null,true);
			}
		});
				
	},
	
	waitForInitialInfoReading : function (fnToExecute) {
//		jQuery.when(this.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
		jQuery.when(this._oComponent.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
		
	},
});