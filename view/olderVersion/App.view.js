sap.ui.jsview("sap.ui.ZTime_Entry.view.App", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.App
	*/ 
	getControllerName : function() {
		return "sap.ui.ZTime_Entry.view.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.App
	*/ 
	createContent : function(oController) {
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.App();
		
		// load the master page
		var logon = sap.ui.xmlview("Logon", "sap.ui.ZTime_Entry.view.Logon");
		logon.getController().nav = this.getController();
		this.app.addPage(logon, true);
		
		// done
		return this.app;
	}

});