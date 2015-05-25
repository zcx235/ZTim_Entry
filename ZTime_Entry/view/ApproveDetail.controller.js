jQuery.sap.require("sap.ui.ZTime_Entry.util.Formatter");

sap.ui.controller("sap.ui.ZTime_Entry.view.ApproveDetail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.ApproveDetail
*/
	onInit: function() {
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		this._oModel = this._oComponent.getModel();
//		this.getView().addEventDelegate({
//			onBeforeShow : function(evt)
//			{
//				sap.ui.getCore().byId("ApproveDetail").getController().beforeShow(evt);
//			},
//		});	
		
		var oEventBus = this._oComponent.getEventBus(); 
		oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.ApproveDetail
*/
	onBeforeRendering: function() {
		
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.ApproveDetail
*/
	onAfterRendering: function() {
		var oModel = sap.ui.getCore().byId("ApproveList").getModel("REJ_REASONS");
		this.getView().setModel(oModel,"REJ_REASONS");
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.ApproveDetail
*/
//	onExit: function() {
//
//	}

	onMetadataFailed : function(){
		
	},
	
	onRouteMatched : function(oEvent){
		
	},
	
	handleSave : function(){
		var items = this.getView().byId("time_detail").getItems();
		for(var i in items)
		{
			var cells = items[i].getCells();
			if(cells)
			{
				var oBindingContext = items[i].getBindingContext();
				var sPath = oBindingContext.getPath("STATUS");
				if(cells[2].getPressed())
				{
					oBindingContext.getModel().setProperty(sPath,"30");
				}
				else if(cells[3].getPressed())
				{
					
					oBindingContext.getModel().setProperty(sPath,"40");
				}
			}	
		}
		this.nav.back("ApproveList");
	},
	
	handleCancel : function(oEvent)
	{
		this.nav.back("ApproveList");
	},
	
	approve : function(oEvent){
		var cells = oEvent.getSource().getParent().getCells();
		if(cells)
		{
			cells[3].setPressed(false);
			cells[3].setIcon("");
			if(oEvent.getSource().getPressed())
			{
				cells[4].setEnabled(false);
				oEvent.getSource().setIcon("sap-icon://accept");	
			}
			else
			{
				oEvent.getSource().setIcon("");
			}	
		}	
	},
	
	reject : function(oEvent)
	{
		var cells = oEvent.getSource().getParent().getCells();
		if(cells)
		{
			cells[2].setPressed(false);
			cells[2].setIcon("");
			if(oEvent.getSource().getPressed())
			{
				cells[4].setEnabled(true);
				oEvent.getSource().setIcon("sap-icon://decline");
			}
			else
			{
				cells[4].setEnabled(false);
				cells[4].setValue("");
				oEvent.getSource().setIcon("");
			}
		}		
	},
	
	beforeShow : function(evt)
	{
		var oTimeEntryModel = sap.ui.getCore().byId("ApproveList").getModel("TIME_RECORDS");
		sap.ui.getCore().byId("ApproveDetail").setModel(oTimeEntryModel);
	},
});