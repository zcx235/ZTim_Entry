sap.ui.controller("sap.ui.ZTime_Entry.view.EmployeeList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.EmployeeList
*/
	onInit: function() {
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.EmployeeList
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.EmployeeList
*/
	onAfterRendering: function() {
		var oModel = sap.ui.getCore().getModel("ODATA");
		var oUser = sap.ui.getCore().getModel("USER");
		oModel.read("USER_SET('"+ oUser.getProperty("/BNAME") + "')",null,null,false,
					function(response)
					{
						var oUserData = {BNAME: response.BNAME, PERNR: response.PERNR, TIMEKEEPER:response.TIMEKEEPER};
//						var oUserData = response;
						sap.ui.getCore().getModel("USER").setData(oUserData);
						//var oUserModel = new sap.ui.model.json.JSONModel(oUserData);
						;
						if( response.TIMEKEEPER == "")
						{
							//sap.ui.getCore().getModel("ODATA").read("EE_INFO_SET('" + response.PERNR + "')",null,null,false);
//							var sPath = "/EE_INFO_SET('" + response.PERNR + "')";
//							var oContext = new sap.ui.model.Context(sap.ui.getCore().getModel("ODATA"),sPath);
							var oController = sap.ui.getCore().byId("EmployeeList").getController();
							oController.nav.to("EmployeeDetail");
						}
						else
						{
							var oController = sap.ui.getCore().byId("EmployeeList").getController();
							oController.nav.to("ApproveList");
//							var oEeListView = sap.ui.getCore().byId("EmployeeList");
//							var oModel = sap.ui.getCore().getModel("ODATA");
//							var oFilters = [];
//							var oFilter = new sap.ui.model.Filter("SACHZ",sap.ui.model.FilterOperator.EQ,response.TIMEKEEPER);
//							oFilters.push(oFilter);  
//							oEeListView.setModel(oModel,"TK_EE"); 
//							
//							var oTemplate = new sap.m.ObjectListItem(  
//									  {	title: "{TK_EE>ENAME}",
//										type : "Active",
////										press: sap.ui.getCore().byId("EmployeeList").getController().handleEePress,
//										attributes: [
//									          new sap.m.ObjectAttribute({
//									        	  text : "{TK_EE>PERNR}" })
////									          new sap.m.Text({text : "{TIME>STATUS}"}),
//									          ],
//									  });  
//							
//							oEeListView.byId("ee_list").bindItems({
//								path : "TK_EE>/TIMEKEEPER_EE_SET",
//								template: oTemplate,
//								filters : oFilters
//							});  
						}	
					},
					function(response)
					{
						
					});
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.EmployeeList
*/
//	onExit: function() {
//
//	}
	handleEeSelect : function(oEvent) {
		var oContext = oEvent.getParameter("listItem").getBindingContext("TK_EE");
		var parameter = {PERNR : oContext.getProperty("PERNR")};
		sap.ui.getCore().byId("EmployeeList").getController().nav.to("EmployeeDetail",null,parameter);
	}
});