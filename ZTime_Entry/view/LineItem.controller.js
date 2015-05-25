jQuery.sap.require("sap.ui.ZTime_Entry.util.Formatter");
jQuery.sap.require("sap.ui.ZTime_Entry.util.Error");

sap.ui.controller("sap.ui.ZTime_Entry.view.LineItem", {
	IsCreate : null,
	IsSuccess: null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.LineItem
*/
	onInit: function() {
		
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		this._oModel = this._oComponent.getModel();
		
		var oEventBus = this._oComponent.getEventBus();
		oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
//		oEventBus.subscribe("EEType", "InitialInfoReadFinished", this.onPernrInfoLoaded, this);
		
//		this.getView().addEventDelegate({
//			onBeforeShow : function(evt)
//			{
//				sap.ui.getCore().byId("LineItem").getController().beforeShow(evt);
//			},
//			
//			onBeforeHide : function(evt)
//			{
////				alert("onBeforeHide");
//			}
//		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.LineItem
*/
	onBeforeRendering: function() {
//		alert("onBeforeRendering");
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.LineItem
*/
	onAfterRendering: function() {
//		alert("a");
//		console.log(this.getView().getBindingContext());
//		var oModel = sap.ui.getCore().byId("EmployeeDetail").getModel("TIME");
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.LineItem
*/
	onExit: function() {
	    var oEventBus = this._oComponent.getEventBus();
    	oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
//		oEventBus.unsubscribe("EEType", "InitialInfoReadFinished", this.onPernrInfoLoaded, this);
	},
	
	onMetadataFailed : function(){
		this.oInitialInfoReadFinishedDeferred.resolve();
	},
	
//	onPernrInfoLoaded : function(){
//		this.oInitialInfoReadFinishedDeferred.resolve();
//	},
	
	onRouteMatched : function(oEvent){
		var sName = oEvent.getParameter("name");
		var oArguments = oEvent.getParameter("arguments");
		
		if (sName !== "Line_Item") { 
			return;
		}
		
		this.beforeShow(oEvent);
		
//		jQuery.when(this.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(function(){
		jQuery.when(this._oComponent.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(function(){
			this.bindView(oArguments);
			this._oUserModel = this._oComponent.getModel("USER");
		},this));
		
	},
	
	bindView : function(oArguments){
		if(oArguments.entity)
		{
			var sPath = "/" + oArguments.entity;
			this._oView.bindElement(sPath);
			
			//Check if the data is already on the client
			if(!this._oModel.getData(sPath)) 
			{
				// Check that the entity specified was found.
				this._oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = this._oModel.getData(sPath);
					if (!oData) 
					{
//						this.showEmptyView();
//						this.fireDetailNotFound();
						alert("No Data");
					}
					else
					{
						this.initDate();
					}
				}, this));
			}
			else
			{
				this.initDate();
			}
			
		}
	},
	
	initDate : function(date)
	{
		var showDate = new Date();
		if(date)
		{
			showDate = new Date(date);
			showDate.setHours("0");
			showDate.setMinutes("0");
			showDate.setSeconds("0");
		}
		else
		{
			var dateRecord = this._oView.getBindingContext().getProperty("WORKDATE");	
			showDate.setFullYear(dateRecord.getUTCFullYear());
			showDate.setMonth(dateRecord.getUTCMonth());
			showDate.setDate(dateRecord.getUTCDate());
			showDate.setHours("0");
			showDate.setMinutes("0");
			showDate.setSeconds("0");
		}
		this._oView.byId("date").setDateValue(showDate);
	},
	
	handleAwartHelp : function(oController) {
	    this.inputId = oController.oSource.sId;
	    // create value help dialog
	    if (!this._valueHelpDialog) {
	      this._valueHelpDialog = sap.ui.xmlfragment(
	    	"sap.ui.ZTime_Entry.fragment.AWART",
	        this
	      );
	      this._oView.addDependent(this._valueHelpDialog);
//	      var oContext = sap.ui.getCore().byId("LineItem").getBindingContext();
		  var selectDate = this._oView.byId("date").getValue();
		  var sendDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(selectDate);
		  var oFilters = [];
		  var oFilter = new sap.ui.model.Filter("PERNR",sap.ui.model.FilterOperator.EQ,this._oUserModel.getProperty("/PERNR"));
		  oFilters.push(oFilter);
		  oFilter = new sap.ui.model.Filter("WORKDATE",sap.ui.model.FilterOperator.EQ,sendDate);
		  oFilters.push(oFilter);
		  var oTemplate = new sap.m.StandardListItem({
			title: "{AWART}",
			description: "{ATEXT}"
		  });
		  this._valueHelpDialog.bindAggregation("items",{
			  path : "/AWART_DESC_SET",
			  template : oTemplate,
			  filters : oFilters
		  });
	    }

	    // open value help dialog
	    this._valueHelpDialog.open();
	  },

	handleValueHelpClose : function(oEvent)
	{
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) 
		{
			var awartInput = this.getView().byId(this.inputId);
		    awartInput.setValue(oSelectedItem.getTitle());
		}
	},
		
	handlePress : function(oEvent)
	{
		
		var date = this._oView.byId("date").getDateValue();
		var hour = this._oView.byId("hour").getValue();
		var hour_type = this._oView.byId("hour_type").getValue();
		var msg = "";
		var msgContent;
		
		if( date && hour && hour_type)
		{
			this._oView.setBusy(true);
			var oEntry = {};
			var oContext 		= this._oView.getBindingContext();
			oEntry.PERNR 		= this._oUserModel.getProperty("/PERNR");
			oEntry.COUNTER		= "";
			oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate(date);
			oEntry.AWART		= hour_type;
			oEntry.ATEXT		= "";
			oEntry.CATSHOURS	= hour;
//			var oModel = sap.ui.getCore().getModel("ODATA");
			if(IsCreate)
			{	
				//create time entry
				var mParameters = {};
				mParameters.success = jQuery.proxy(function(message){
			 										msg = "Create Entry Successfully!";
			 										IsSuccess = true;
			 										this.oTime_EntryOperationDeferred.resolve();
			 										},this);
			 	mParameters.error =  jQuery.proxy(function(message){
			 										msg = "Create Entry Failed";
			 										IsSuccess = false;
			 										msgContent = sap.ui.ZTime_Entry.util.Error.getErrorMsg(message.response.body);
			 										this.oTime_EntryOperationDeferred.resolve();
			 										},this);
			 	mParameters.async = true;
				this._oModel.create('/TIME_ENTRY_TZONE_SET', oEntry, mParameters);
			}
			else
			{
				//update time entry
				var mParameters = {};
				mParameters.success = jQuery.proxy(function(message){
													msg = "Update Entry Successfully!";
													IsSuccess = true;
													this.oTime_EntryOperationDeferred.resolve();
													},this);
				mParameters.error = jQuery.proxy(function(message){
													msg = "Update Entry Failed";
													IsSuccess = false;
													msgContent = sap.ui.ZTime_Entry.util.Error.getErrorMsg(message.response.body);
													this.oTime_EntryOperationDeferred.resolve();
													},this);
				mParameters.async = true;
				oEntry.COUNTER = oContext.getProperty("COUNTER");
// encodeURIComponent translates : to %3A				
				var path = "/TIME_ENTRY_TZONE_SET(PERNR='" + oEntry.PERNR + 
						   "',COUNTER='" + oEntry.COUNTER + 
						   "',WORKDATE=datetimeoffset'" + encodeURIComponent(oEntry.WORKDATE) + 
						   "',AWART='" + oEntry.AWART + "')";
//				this._oModel.setUseBatch(false);
				this._oModel.update(path,oEntry, mParameters);
			}
			jQuery.when(this.oTime_EntryOperationDeferred).then(jQuery.proxy(function(){
//				this._oView.setBusy(false);
				// show create/update status			
				if(msg)
				{	
					if(sap.m.MessageToast)
					{
						sap.m.MessageToast.show(msg);
					}		
				}
	// show error message			
				if(msgContent)
				{
					this._oView.byId("error_label").setVisible(true);
					this._oView.byId("error_text").setVisible(true);
					this._oView.byId("error_text").setText(msgContent);
				}
				else
				{
					this._oView.byId("error_label").setVisible(false);
					this._oView.byId("error_text").setVisible(false);
				}
				// only do this after success
				if(IsSuccess)
				{
//					this._oView.setBusy(true);
					var navBack = function(){
						this._oView.setBusy(false);
						this._oRouter.myNavBack("Employee_Detail");
					}
					setTimeout(jQuery.proxy(navBack,this),2000);
					
				}
				else
				{
					this._oView.setBusy(false);
				}
			},this));
		}
		else
		{
			msg = "Enter Work Date, Duration and Att/Abs Type";
			if(sap.m.MessageToast)
			{
				sap.m.MessageToast.show(msg);
			}	
		}
		
	},
	
	handleNavButtonPress : function()
	{
		if(this._oRouter.previousHash() == undefined)
		{
			var date = new Date();
			var sendDate = sap.ui.ZTime_Entry.util.Formatter.toSendDate(date);
			var aParameters = {date : sendDate.substr(0,10)};
			this._oRouter.myNavBack("Employee_Detail",aParameters);
		}
		else
		{
			this._oRouter.myNavBack("Employee_Detail");
		}	
	},
	
	initPage : function()
	{
		this.byId("date").setValue();
		this.byId("hour").setValue();
		this.byId("hour_type").setValue();
	},
	
	beforeShow : function(oEvent)
	{
		this.oTime_EntryOperationDeferred = jQuery.Deferred();
		//init IsSuccess
		this.IsSuccess = false;
		this._oView.byId("error_label").setVisible(false);
		this._oView.byId("error_text").setVisible(false);
		this._oView.byId("error_text").setText("");
		var oNew = oEvent.getParameter("arguments").NEW;
		if(oNew == "true")
		{
			this.initPage();
			this._oView.byId("date").setEditable(true);
			IsCreate = true;
			this._oView.byId("bottom_button").setText("Create");
			this._oView.byId("delete_button").setVisible(false);
			var selectedDate = oEvent.getParameter("arguments").date;
			if(selectedDate)
			{
				this.initDate(selectedDate);
			}
		}	
		else if(oNew == "false")
		{
			IsCreate = false;
			this._oView.byId("bottom_button").setText("Update");
			this._oView.byId("delete_button").setVisible(true);
			this._oView.byId("date").setEditable(false);
		}
//		alert("onBeforeShow");
	},
	
	handleDelete : function()
	{
		this._oView.setBusy(true);
		var date = this._oView.byId("date").getDateValue();
		var hour = this._oView.byId("hour").getValue();
		var hour_type = this._oView.byId("hour_type").getValue();
		var msg = "";
		var oEntry = {};
//		var oContext = sap.ui.getCore().byId("LineItem").getBindingContext();
		oEntry.PERNR 		= this._oUserModel.getProperty("/PERNR");
		oEntry.COUNTER		= "";
		oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate(date);
		oEntry.AWART		= hour_type;
		oEntry.ATEXT		= "";
		oEntry.CATSHOURS	= hour;
		oEntry.COUNTER = this._oView.getBindingContext().getProperty("COUNTER");
		var path = "/TIME_ENTRY_TZONE_SET(PERNR='" + oEntry.PERNR + 
				   "',COUNTER='" + oEntry.COUNTER + 
				   "',WORKDATE=datetimeoffset'" + encodeURIComponent(oEntry.WORKDATE) + 
				   "',AWART='" + oEntry.AWART + "')";
		mParameters = {};
		mParameters.success = jQuery.proxy(function(message){
											msg = "Delete Entry Successfully!";
											IsSuccess = true;
											this.oTime_EntryOperationDeferred.resolve();
											},this);
		mParameters.error = jQuery.proxy(function(message){
											msg = "Delete Entry Failed";
											IsSuccess = false;
											this.oTime_EntryOperationDeferred.resolve();
											},this);
		mParameters.async = true;
		this._oModel.remove(path, mParameters);
		
		jQuery.when(this.oTime_EntryOperationDeferred).then(jQuery.proxy(function(){
//			this._oView.setBusy(false);
			if(msg)
			{
				if(sap.m.MessageToast)
				{
					sap.m.MessageToast.show(msg);
				}
				// only do this after success
				if(IsSuccess)
				{
					this._oView.setBusy(true);
					var navBack = function(){
						this._oView.setBusy(false);
						this._oRouter.myNavBack("Employee_Detail");
					}
					setTimeout(jQuery.proxy(navBack,this),2000);
				}
			}
			
		},this));
	},
});