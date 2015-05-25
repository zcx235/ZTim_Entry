jQuery.sap.require("sap.ui.ZTime_Entry.util.Formatter");
jQuery.sap.require("sap.ui.ZTime_Entry.util.Error");

sap.ui.controller("sap.ui.ZTime_Entry.view.EmployeeDetail", {
	iconArray : {
			"10" : "sap-icon://create",
			"{TIME>STATUS}" : "sap-icon://create"
	},
	
	pernr	 : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.EmployeeDetail
*/
	onInit: function() {
//		this.oInitialInfoReadFinishedDeferred = jQuery.Deferred();
		
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		this._oModel = this._oComponent.getModel();
//		this.getView().addEventDelegate({
//			onBeforeShow : function(evt)
//			{
//				this.beforeShow(evt);
//			},
//		})
		var oEventBus = this._oComponent.getEventBus(); 
		oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
//		oEventBus.subscribe("EEType", "InitialInfoReadFinished", this.onPernrInfoLoaded, this);
		
//		this.getView().setBusy(true);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.EmployeeDetail
*/
//	onBeforeRendering: function() {
//
//	},
	
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.EmployeeDetail
*/
	onAfterRendering: function() {
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.EmployeeDetail
*/
	onExit: function() {
	    var oEventBus = this._oComponent.getEventBus();
    	oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
//		oEventBus.unsubscribe("EEType", "InitialInfoReadFinished", this.onPernrInfoLoaded, this);
	},
	
	onMetadataFailed : function(){
		
	},
	
//	onPernrInfoLoaded : function(){
//		this.oInitialInfoReadFinishedDeferred.resolve();
//	},
	
	onInitialInfoReadFinished : function()
	{
		this._oUserModel = this._oComponent.getModel("USER");
		this._bindEmployeeDetail();
		this._bindTimeEntrys();
	},

	_bindEmployeeDetail : function()
	{
		var sPath = "/EE_INFO_SET('" + this._oUserModel.getProperty("/PERNR") + "')";
//		this._oComponent.setModel(this._oModel,"EE");
		this._oView.byId("detail_page").bindElement(sPath);
	},
	
	_bindTimeEntrys : function()
	{
//		var oFilterDate = this._oView.byId("calendar").getCurrentDate();
		var oSelectedDates = this._oView.byId("calendar").getSelectedDates();
		if(oSelectedDates.length > 0)
		{
			var oFilterDate = oSelectedDates[0];
//			var oFilterDate = oEvent.getParameter("arguments").date;
			var oFormattedDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(oFilterDate);
			var oFilters = [];
			var oFilter = new sap.ui.model.Filter("PERNR",sap.ui.model.FilterOperator.EQ,this._oUserModel.getProperty("/PERNR"));
			oFilters.push(oFilter);
			oFilter = new sap.ui.model.Filter("WORKDATE",sap.ui.model.FilterOperator.EQ,oFormattedDate);
			oFilters.push(oFilter);
			this._oView.byId("timeentry").getBinding("items").filter(oFilters);
//			var oTemplate = this._oView.byId("columnListItem").clone();
//			this._oView.byId("timeentry").bindItems({
//			path : "/TIME_ENTRY_TZONE_SET",
//			template: oTemplate,
//			filters : oFilters
//			});  
		}

	},
	
	onRouteMatched : function(oEvent)
	{
		var sName = oEvent.getParameter("name");
		
		if (sName !== "Employee_Detail") { 
			return;
		}
		
		this.beforeShow(oEvent);
//		jQuery.when(this.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(this.onInitialInfoReadFinished,this));
		jQuery.when(this._oComponent.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(this.onInitialInfoReadFinished,this));
	},
	
	selectDate : function(oEvent)
	{
		var selectDate = oEvent.getParameter("date");
		if(oEvent.getParameter("didSelect"))
		{
			var sendDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(selectDate);
			var aParameters = {date : sendDate.substr(0,10)};
			this._oRouter.navTo("Employee_Detail",aParameters);
//			var pernr = this._oUserModel.getProperty("/PERNR");
//			var selectDate = oEvent.getParameter("date");
//			var sendDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(selectDate);
//			var oFilters = [];
//			var oFilter = new sap.ui.model.Filter("PERNR",sap.ui.model.FilterOperator.EQ,pernr);
//			oFilters.push(oFilter);
//			oFilter = new sap.ui.model.Filter("WORKDATE",sap.ui.model.FilterOperator.EQ,sendDate);
//			oFilters.push(oFilter);
//			this._oView.byId("timeentry").getBinding("items").filter(oFilters,sap.ui.model.FilterType.Application);
		}
		else
		{
			this._oView.byId("calendar").toggleDatesSelection([selectDate],true);
		}
		

	},
	
	handleLineItemPress : function(oEvent)
	{
		var context = oEvent.getSource().getBindingContext();
		var oParameters = {
							entity : context.getPath().substr(1),
							NEW : false
						  };
		this._oRouter.navTo("Line_Item",oParameters);
//		var oEventBus = this._oComponent.getEventBus();
//		oEventBus.publish("EEType","InitialInfoReadFinished");
	},
	
	handleCreate : function()
	{
		var selectedDates = this._oView.byId("calendar").getSelectedDates();
		var selectedDate;
		if(selectedDates.length > 0)
		{
			selectedDate = selectedDates[0];
		}
		var oParameters = {
							entity : "",
							NEW : true,
							date : selectedDate
							};
		this._oRouter.navTo("Line_Item",oParameters);
	},
	
	handleSubmit : function(oEvent)
	{
		this._oView.setBusy(true);
		var oEntrys = [];
		var items = this._oView.byId("timeentry").getItems();
		for(var i in items)
		{
			var cells = items[i].getCells();
			if(cells)
			{
				if(cells[0].getProperty("selected"))
				{
					var oBindingContext = items[i].getBindingContext();
					var oEntry = {};
					var workdate = oBindingContext.getProperty("WORKDATE");
					oEntry.PERNR 		= oBindingContext.getProperty("PERNR");
					oEntry.COUNTER 		= oBindingContext.getProperty("COUNTER");
//					oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate(workdate);
					oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate_Unchange(workdate);
					oEntry.AWART		= oBindingContext.getProperty("AWART");
					oEntry.ATEXT		= oBindingContext.getProperty("ATEXT");
					oEntry.CATSHOURS	= oBindingContext.getProperty("CATSHOURS");
					oEntry.STATUS		= "20";
					oEntrys.push(oEntry);
				}
			}
		}
		
		var iFailed = false;
//		var batchChanges = [];
		for(var i in oEntrys)
		{
			var oEntry = oEntrys[i];
			var sPath = "/TIME_ENTRY_TZONE_SET(PERNR='" + oEntry.PERNR + 
			   "',COUNTER='" + oEntry.COUNTER + 
			   "',WORKDATE=datetimeoffset'" + encodeURIComponent(oEntry.WORKDATE) + 
			   "',AWART='" + oEntry.AWART + "')";
			var mParameters = {};
			mParameters.success = jQuery.proxy(function(message)
												{
													alert("Success");
												},this);
			mParameters.error = jQuery.proxy(function(message)
												{
													iFailed =  true;
													msgContent = sap.ui.ZTime_Entry.util.Error.getErrorMsg(message.response.body);
												},this);
			mParameters.async = false;
			this._oModel.update(sPath, oEntry,mParameters);
//			batchChanges.push(this._oModel.createBatchOperation(sPath,'PUT',oEntry));				
		}
//		this._oModel.setUseBatch(true);
//		this._oModel.addBatchChangeOperations(batchChanges);
//		
//		var batchSuccess = jQuery.proxy(function(message){
//											this.oBathFinished.resolve();
//										},this);
//		var batchError = jQuery.proxy(function(message){
//											this.oBathFinished.resolve();
//										},this);
//		this._oModel.submitBatch(batchSuccess,batchError);
		this._oView.setBusy(false);
		if(!iFailed)
		{
			if(sap.m.MessageToast)
			{
				sap.m.MessageToast.show("Submit Entry Successfully!");
			}	
		}
		else
		{
			if(sap.m.MessageToast)
			{
				if(msgContent)
				{
					sap.m.MessageToast.show(msgContent);
				}
				else
				{
					sap.m.MessageToast.show("Submit Entry Failed");
				}	
			}	
		}
//		this._oModel.refresh();
		this._oView.byId("timeentry").getBinding("items").refresh();
	},
	
	beforeShow : function(evt)
	{
		this.oBathFinished = jQuery.Deferred();
		if(evt.getParameter("arguments").date)
		{
			var oSetDate = new Date(evt.getParameter("arguments").date);
			if(oSetDate)
			{
				var oLocaleDate = this.toLocaleDate(oSetDate);
				this._oView.byId("calendar").unselectAllDates();
				this._oView.byId("calendar").toggleDatesSelection([oLocaleDate],true);
//				this._oView.byId("calendar").setCurrentDate(oLocaleDate.toLocaleString());
			}
		}
	},
	
	toLocaleDate : function(date)
	{
		var retDate = new Date();
		retDate.setFullYear(date.getUTCFullYear());
		retDate.setMonth(date.getUTCMonth());
		retDate.setDate(date.getUTCDate());
		retDate.setHours("0");
		retDate.setMinutes("0");
		retDate.setSeconds("0");
		return retDate;
	}
});
