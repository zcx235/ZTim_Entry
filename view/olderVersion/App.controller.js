sap.ui.controller("sap.ui.ZTime_Entry.view.App", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.App
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.App
*/
//	onExit: function() {
//
//	}
	to : function (pageId, context, parameter) {
		
		var app = this.getView().app;
		
		// load page on demand
		var logon = ("Logon" === pageId);
		if (app.getPage(pageId, logon) === null) {
			var page = sap.ui.view({
				id : pageId,
				viewName : "sap.ui.ZTime_Entry.view." + pageId,
				type : "XML"
			});
			page.getController().nav = this;
			app.addPage(page, logon);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}
		
		// set data context on the page
		if (context) {
			var page = app.getPage(pageId);
			page.setBindingContext(context);
		}
		

		if(parameter)
		{
			app.to(pageId,parameter);
			
		}
		else
		{
			// show the page
			app.to(pageId);	
		}
		
	},
	
	/**
	 * Navigates back to a previous page
	 * @param {string} pageId The id of the next page
	 */
	back : function (pageId) {
		this.getView().app.backToPage(pageId);
	},
});
