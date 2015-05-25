jQuery.sap.require("sap.ui.ZTime_Entry.util.Formatter");

sap.ui.controller("sap.ui.ZTime_Entry.view.ApproveList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.ApproveList
*/
	onInit: function() {
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oRouter.attachRoutePatternMatched(this.onRouteMatched,this);
		this._oModel = this._oComponent.getModel();
		
		var oEventBus = this._oComponent.getEventBus(); 
		oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.ApproveList
*/
	onBeforeRendering: function() {
	
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.ApproveList
*/
	onAfterRendering: function() {
//		this.showApproveDetail();
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.ApproveList
*/
	onExit: function() {
	    var oEventBus = this._oComponent.getEventBus();
    	oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
	},
	
	onMetadataFailed : function(){
		
	},
	
	initValue : function(){
		this.oTKReadFinished = jQuery.Deferred();
		this._TKResponse = null;
	},
	
	onRouteMatched : function(oEvent){
		var sName = oEvent.getParameter("name");
		
		if (sName !== "Approve_List") { 
			return;
		}
		
		this.initValue();
		jQuery.when(this._oComponent.oInitialInfoReadFinishedDeferred).then(jQuery.proxy(function(){
			this.showApproveDetail(oEvent);}
		,this));

	},
	
	getTKInfor : function(){
		var bname = this._oUserModel.getProperty("/BNAME");
		var oFilters = [];
		var oFilter = new sap.ui.model.Filter("SACHZ",sap.ui.model.FilterOperator.EQ,bname);
		oFilters.push(oFilter);
		var mParameters = {};
		mParameters['async'] = true;
		mParameters['filters'] = oFilters;
		mParameters['success'] = jQuery.proxy(function(sRes)
												{
													alert("Get EmployeeList Success");
													this._TKResponse = sRes;
													this.oTKReadFinished.resolve();
												},this);
		mParameters['error'] = jQuery.proxy(function(eRes)
												{
													alert("Get EmployeeList Error");
													this.oTKReadFinished.resolve();
												},this);							
		this._oModel.read("/TIMEKEEPER_EE_SET",mParameters);
	},
	
	getTimeEntrys : function(){
		var oEEModel = this._oComponent.getModel("EE");
		if(this._TKResponse){
			var oFilters_PERNR = [];
			for(var i in this._TKResponse.results)
			{	
				var oFilter = new sap.ui.model.Filter("PERNR",sap.ui.model.FilterOperator.EQ,this._TKResponse.results[i].PERNR);
				oFilters_PERNR.push(oFilter);
				
				oEEModel.setProperty("/PERSONS/"+i+"/PERNR",this._TKResponse.results[i].PERNR);
				oEEModel.setProperty("/PERSONS/"+i+"/ENMAE",this._TKResponse.results[i].ENAME);
			}
			this._oView.byId("ApproveList").setModel(oEEModel,"PERSON_INFO");
		}
	},
	
	showApproveDetail : function(oEvent)
	{
		this._oUserModel = this._oComponent.getModel("USER");
		this.getTKInfor();
		
//		jQuery.when(this.oTKReadFinished).then(jQuery.proxy(function(){
//			this.getTimeEntrys();}
//		,this));
		jQuery.when(this.oTKReadFinished).then(jQuery.proxy(this.getTimeEntrys(),this));		
/*		
		var oFilters_PERNR = [];
		
		mParameters['success'] = function(sRes)
								{
									var bindPersons = {PERSONS : []};
									for(var i in sRes.results)
									{	
										var oFilter = new sap.ui.model.Filter("PERNR",sap.ui.model.FilterOperator.EQ,sRes.results[i].PERNR);
										oFilters_PERNR.push(oFilter);
										
										var bindPerson  = {PERNR : "", ENAME : ""};
										bindPerson.PERNR = sRes.results[i].PERNR;
										bindPerson.ENAME = sRes.results[i].ENAME;
										bindPersons.PERSONS.push(bindPerson);
									}
									var oPersonModel = new sap.ui.model.json.JSONModel(bindPersons);
									sap.ui.getCore().byId("ApproveList").setModel(oPersonModel,"PERSON_INFO");
									
									
									var oFilterInfo = {};
									oFilterInfo['filters'] = oFilters_PERNR;
									oFilterInfo['and'] = false;
									var oFilters_PERNRs = new sap.ui.model.Filter(oFilterInfo);
									var oFilters = [];
									oFilters.push(oFilters_PERNRs);
									
									var calendar = sap.ui.getCore().byId("ApproveList").byId("weekly_calendar");
									var currentDate =  new Date(calendar.getCurrentDate());
									var weekBegin = sap.ui.ZTime_Entry.util.Formatter.getWeekBegin(currentDate);
									var weekEnd   = sap.ui.ZTime_Entry.util.Formatter.getWeekEnd(currentDate);
									var oFilter = new sap.ui.model.Filter("WORKDATE",sap.ui.model.FilterOperator.BT,weekBegin,weekEnd);
									oFilters.push(oFilter);
									oFilter = new sap.ui.model.Filter("STATUS",sap.ui.model.FilterOperator.EQ,'20');
									oFilters.push(oFilter);
									
									var oModel = sap.ui.getCore().getModel("ODATA");
									var mParameters = {};
									mParameters['async'] = false;
									mParameters['filters'] = oFilters;
									mParameters['success'] = function(sResponse)
															{	
																var records = {};
//																var record = {PERNR:"",TOTAL:"",TIME_ENTRY:[]};
																var oPersons = sap.ui.getCore().byId("ApproveList").getModel("PERSON_INFO").getData();
																for(var i in sResponse.results)
																{
																	if(records[sResponse.results[i].PERNR])
																	{
																		records[sResponse.results[i].PERNR].TOTAL = Number(records[sResponse.results[i].PERNR].TOTAL) +
																													Number(sResponse.results[i].CATSHOURS);
																	}
																	else
																	{	
																		records[sResponse.results[i].PERNR] = {PERNR:"",TOTAL:"",ENAME:"",TIME_ENTRYS:[]};
																		records[sResponse.results[i].PERNR].PERNR = sResponse.results[i].PERNR;
																		
																		records[sResponse.results[i].PERNR].TOTAL = sResponse.results[i].CATSHOURS;
																		for(var j in oPersons.PERSONS)
																		{
																			if(oPersons.PERSONS[j].PERNR == records[sResponse.results[i].PERNR].PERNR)
																			{
																				records[sResponse.results[i].PERNR].ENAME = oPersons.PERSONS[j].ENAME;
																				break;
																			}
																		}	
																	}
																	records[sResponse.results[i].PERNR].TIME_ENTRYS.push(sResponse.results[i]);
																}
																var bindRecords = {APPROVE_PERSONS:[]};
																$.each(records,function(key,values){
																	bindRecords.APPROVE_PERSONS.push(values);
																});
																var oTimeEntryModel = new sap.ui.model.json.JSONModel(bindRecords);
																var approveList = sap.ui.getCore().byId("ApproveList");
																approveList.setModel(oTimeEntryModel,"TIME_RECORDS");
																
																var oModel = sap.ui.getCore().getModel("ODATA");
																var mParameters = {};
																mParameters['async'] = false;
																mParameters['success'] = function(sResponse)
																						 {	
																							var reject_reasons = {REJECT_REASONS : [] };
																							var reject_reason = {REASON:"",TEXT:""};
																							reject_reasons.REJECT_REASONS.push(reject_reason);
																							for(var i in sResponse.results)
																							{
																								reject_reason = {REASON:"",TEXT:""};
																								reject_reason.REASON = sResponse.results[i].REASON;
																								reject_reason.TEXT   = sResponse.results[i].TEXT;
																								reject_reasons.REJECT_REASONS.push(reject_reason);
																							}
																							var oRejectReasonModel = new sap.ui.model.json.JSONModel(reject_reasons);
																							sap.ui.getCore().byId("ApproveList").setModel(oRejectReasonModel,"REJ_REASONS");
																						 };
																oModel.read("/REJECT_REASON_SET",mParameters);						 
																
																var oSelectTemplate = new sap.ui.core.Item({key: "{REJ_REASONS>REASON}",
																											text: "{REJ_REASONS>TEXT}"	
																											});
																var oTemplate = new sap.m.ColumnListItem(  
																		  {	type: "Navigation",
																			press: approveList.getController().getDetail,
																			vAlign: "Middle",
																			cells: [
																		          new sap.m.Text({text : "{TIME_RECORDS>PERNR}"}),  
																		          new sap.m.Text({text : "{TIME_RECORDS>ENAME}"}),
																				  new sap.m.Text({text : "{TIME_RECORDS>TOTAL}"}),
																				  new sap.m.ToggleButton({
//																					  					  activeIcon: "sap-icon://accept",
																					  					  text : "Approve",
																					  					  press : sap.ui.getCore().byId("ApproveList").getController().pressApproveAll }),
																				  new sap.m.ToggleButton({
																					  					  activeIcon: "sap-icon://decline",
																					  					  text : "Reject",
																						  				  press : sap.ui.getCore().byId("ApproveList").getController().pressRejectAll }),
																				  new sap.m.Select({
																					  				enabled : false,
																					  				change	: sap.ui.getCore().byId("ApproveList").getController().changeSelected}).bindItems({
																					  							path: "REJ_REASONS>/REJECT_REASONS",
																					  							template: oSelectTemplate})	  				  
//																		          new sap.m.Input({enabled : false})
//																				  new sap.m.Select({items : [
//																				                             new sap.ui.core.Item({
//																				                            	 					key 	: "0",
//																				                            	 					text	: "",
//																				                             						}),
//																				                             new sap.ui.core.Item({
//																				                            	 					key		: "1",
//																				                            	 					text	: "Approve All",
//																				                             						}),
//																				                             new sap.ui.core.Item({
//																				                            	 					key		: "2",
//																				                            	 					text	: "Reject All",
//																				                             						})
//																				                             ]})
																		          ]  
																		  });   
																approveList.byId("approve_detail").bindItems({
																	path : "TIME_RECORDS>/APPROVE_PERSONS",
																	template: oTemplate
																});
															};
									mParameters['error'] = function(eResponse)
															{
																alert("Get Time Entry Error");
															};
									oModel.read("/TIME_ENTRY_TZONE_SET",mParameters);
								};
*/
	},
	
	handleChangeCurrentDate : function()
	{
		this.showApproveDetail();
	},
	
	getDetail : function(oEvent)
	{
		var context = oEvent.getSource().getBindingContext("TIME_RECORDS");
		sap.ui.getCore().byId("ApproveList").getController().nav.to("ApproveDetail", context);
	},
	
	handleSubmit : function(oEvent)
	{
		var items = sap.ui.getCore().byId("ApproveList").byId("approve_detail").getItems();
		var approveItems = [];
		var rejectItems	 = [];
		for(var i in items)
		{
			var cells = items[i].getCells();
			if(cells)
			{
//				var selectedKey = cells[3].getSelectedKey();
//				switch(selectedKey)
//				{
//				case "1" :
//					approveItems.push(items[i]);
//					break;
//				case "2" :
//					rejectItems.push(items[i]);
//					break;
//				}
				var isApproveAll = cells[3].getPressed();
				var isRejectAll	 = cells[4].getPressed();
				if(isApproveAll)
				{
					approveItems.push(items[i]);
				}
				else if(isRejectAll)
				{
					rejectItems.push(items[i]);
				}
			}	
		}
		this.processApprove(approveItems);
		this.processReject(rejectItems);
		this.showApproveDetail();
	},
	
	processApprove : function(approveItems)
	{
		var oEntrys = [];
		for(var i in approveItems)
		{
			oEntry = {};
			var oBindingContext = approveItems[i].getBindingContext("TIME_RECORDS");
			var timeRecords = oBindingContext.getProperty("TIME_ENTRYS");
			for(var j in timeRecords)
			{
				var oEntry = {};
				var workdate 		= timeRecords[j].WORKDATE;
				oEntry.PERNR 		= timeRecords[j].PERNR;
				oEntry.COUNTER		= timeRecords[j].COUNTER;
				oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate_Unchange(workdate);
				oEntry.AWART		= timeRecords[j].AWART;
				oEntry.ATEXT		= timeRecords[j].ATEXT;
				oEntry.CATSHOURS	= timeRecords[j].CATSHOURS;
				oEntry.STATUS		= "30";
				oEntrys.push(oEntry);
			}	
			
			var iFailed;
			for(var k in oEntrys)
			{
				var oEntry = oEntrys[k];
				var path = "/TIME_ENTRY_TZONE_SET(PERNR='" + oEntry.PERNR + 
				   "',COUNTER='" + oEntry.COUNTER + 
				   "',WORKDATE=datetimeoffset'" + oEntry.WORKDATE + 
				   "',AWART='" + oEntry.AWART + "')";
				var oModel = sap.ui.getCore().getModel("ODATA");
				oModel.update(path,oEntry,null,
					function(message)
					{
						
					}, 
					function(message)
					{
						iFailed =  true;
						msgContent = sap.ui.ZTime_Entry.util.Error.getErrorMsg(message.response.body);
					});
			}
		}		
	},
	
	processReject : function(rejectItems)
	{
		var oEntrys = [];
		for(var i in approveItems)
		{
			oEntry = {};
			var oBindingContext = approveItems[i].getBindingContext("TIME_RECORDS");
			var timeRecords = oBindingContext.getProperty("TIME_ENTRYS");
			for(var j in timeRecords)
			{
				var oEntry = {};
				var workdate 		= timeRecords[j].WORKDATE;
				oEntry.PERNR 		= timeRecords[j].PERNR;
				oEntry.COUNTER		= timeRecords[j].COUNTER;
				oEntry.WORKDATE		= sap.ui.ZTime_Entry.util.Formatter.toSendDate_Unchange(workdate);
				oEntry.AWART		= timeRecords[j].AWART;
				oEntry.ATEXT		= timeRecords[j].ATEXT;
				oEntry.CATSHOURS	= timeRecords[j].CATSHOURS;
				oEntry.STATUS		= "40";
				oEntrys.push(oEntry);
			}	
			
			var iFailed;
			for(var k in oEntrys)
			{
				var oEntry = oEntrys[k];
				var path = "/TIME_ENTRY_TZONE_SET(PERNR='" + oEntry.PERNR + 
				   "',COUNTER='" + oEntry.COUNTER + 
				   "',WORKDATE=datetimeoffset'" + oEntry.WORKDATE + 
				   "',AWART='" + oEntry.AWART + "')";
				var oModel = sap.ui.getCore().getModel("ODATA");
				oModel.update(path,oEntry,null,
					function(message)
					{
						
					}, 
					function(message)
					{
						iFailed =  true;
						msgContent = sap.ui.ZTime_Entry.util.Error.getErrorMsg(message.response.body);
					});
			}
		}				
	},
	
	pressApproveAll : function(oEvent)
	{
		var cells = oEvent.getSource().getParent().getCells();
		if(cells)
		{
			cells[4].setPressed(false);
			cells[4].setIcon("");
			var oBindingContext = oEvent.getSource().getParent().getBindingContext("TIME_RECORDS");
			var sPath = oBindingContext.getPath();
			var time_entrys = oBindingContext.getProperty("TIME_ENTRYS");
			if(oEvent.getSource().getPressed())
			{
				cells[5].setEnabled(false);
				oEvent.getSource().setIcon("sap-icon://accept");
				
				for(var i in time_entrys)
				{
//					time_entrys[i].STATUS = "30";
					var path = sPath + "/TIME_ENTRYS/" + i + "/STATUS";
					oBindingContext.getModel().setProperty(path,"30");
					path =  sPath + "/TIME_ENTRYS/" + i + "/REASON";
					oBindingContext.getModel().setProeprty(path,"");
				}	
				
			}
			else
			{
				oEvent.getSource().setIcon("");
				for(var i in time_entrys)
				{
//					time_entrys[i].STATUS = "20";
					var path = sPath + "/TIME_ENTRYS/" + i + "/STATUS";
					oBindingContext.getModel().setProperty(path,"20");
					path =  sPath + "/TIME_ENTRYS/" + i + "/REASON";
					oBindingContext.getModel().setProeprty(path,"");
				}	
			}	
		}	
	},
	
	pressRejectAll : function(oEvent)
	{
		var cells = oEvent.getSource().getParent().getCells();
		if(cells)
		{
			cells[3].setPressed(false);
			cells[3].setIcon("");
			var oBindingContext = oEvent.getSource().getParent().getBindingContext("TIME_RECORDS");
			var sPath = oBindingContext.getPath();
			var time_entrys = oBindingContext.getProperty("TIME_ENTRYS");
			if(oEvent.getSource().getPressed())
			{
				cells[5].setEnabled(true);
				oEvent.getSource().setIcon("sap-icon://decline");
				
				for(var i in time_entrys)
				{
//					time_entrys[i].STATUS = "40";
					var path = sPath + "/TIME_ENTRYS/" + i + "/STATUS";
					oBindingContext.getModel().setProperty(path,"40");	
				}
			}
			else
			{
				cells[5].setEnabled(false);
				cells[5].setValue("");
				oEvent.getSource().setIcon("");
				
				for(var i in time_entrys)
				{
//					time_entrys[i].STATUS = "20";
					var path = sPath + "/TIME_ENTRYS/" + i + "/STATUS";
					oBindingContext.getModel().setProperty(path,"20");
					path =  sPath + "/TIME_ENTRYS/" + i + "/REASON";
					oBindingContext.getModel().setProeprty(path,"");
				}
			}
		}
	},
	
	changeSelected : function(oEvent)
	{
		var selectedKey = oEvent.getParameter("selectedItem").getProperty("key");
		var oBindingContext = oEvent.getSource().getParent().getBindingContext("TIME_RECORDS");
		var sPath = oBindingContext.getPath();
		var time_entrys = oBindingContext.getProperty("TIME_ENTRYS");
		for(var i in time_entrys)
		{
//			time_entrys[i].STATUS = "40";
			var path = sPath + "/TIME_ENTRYS/" + i + "/REASON";
			oBindingContext.getModel().setProperty(path,selectedKey);	
		}
	},
});