jQuery.sap.declare("sap.ui.ZTime_Entry.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("sap.ui.ZTime_Entry.MyRouter");

(function() {
	var mRoutenames = {
		EE_TYPE_PAGE: "EE_Type_Page",
		EMPLOYEE_DETAIL: "Employee_Detail",
		LINE_ITEM: "Line_Item",
		APPROVE_LIST: "Approve_List",
		APPROVE_DETAIL: "Approve_Detail"
	};
	
sap.ui.core.UIComponent.extend("sap.ui.ZTime_Entry.Component", {
	metadata : {
		name : "ZTime_Entry",
		version : "1.0",
		includes : ["css/cell.css","css/error.css"],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		config : {
			resourceBundle : "i18n/messageBundle.properties",
			user : "model/user.json",
			ee : "model/ee.json",
			serviceConfig : {
				name: "ZTIME_ENTRYS_SRV",
				serviceUrl: "../../../../../proxy/sap/opu/odata/sap/ZTIME_ENTRYS_SRV/"
			}
		},

// How to user targetParent, targetControl, targetAggregation, check Route.js _routeMatched function
		routing : {
			config : {
				routerClass : sap.ui.ZTime_Entry.MyRouter,
				viewType : "XML",
				viewPath : "sap.ui.ZTime_Entry.view",
				targetParent : "AppView",		// App.view.xml ID
				targetControl : "fioriContent", // This is the control in which new views are placed
                targetAggregation : "pages", // This is the aggregation in which the new views will be placed
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : mRoutenames.EE_TYPE_PAGE,
					view : "EETypePage",
//					targetAggregation : "pages",
//					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "EEDetail&{date}",
							name : mRoutenames.EMPLOYEE_DETAIL,
							targetControl : "",
							view : "EmployeeDetail",
							subroutes : [
							             {
							            	 pattern : "LineItem/:entity:&:NEW::date:",
							            	 name : mRoutenames.LINE_ITEM,
							            	 targetControl : "",
							            	 view : "LineItem",
							             }
							            ],
						},
						{
							pattern : "ApproveList&:FromDate:&:EndDate:",
							name : mRoutenames.APPROVE_LIST,
							targetControl : "",
							view : "ApproveList",
						},
					]
				},
			]
		}
	},
	
	oInitialInfoReadFinishedDeferred : jQuery.Deferred(),
	
	createContent : function() {
		// create root view
		var oViewData = {
			component : this	
		};
		
		var oView = sap.ui.view({
			id : "AppView",
			viewName : "sap.ui.ZTime_Entry.view.App",
			type : "XML",
			viewData : oViewData
		});
		
		return oView;
	},
	
	init : function(){
		// call super init (will call function "create content")
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        
        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var sRootPath = jQuery.sap.getModulePath("sap.ui.ZTime_Entry");
        
        // Get the service URL for the oData model
		var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		var sServiceUrl = oServiceConfig.serviceUrl;
		
        // the metadata is read to get the location of the i18n language files later
        var mConfig = this.getMetadata().getConfig();
        this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
	
        // create oData model
        var oDataModel = this._initODataModel(sServiceUrl);
        
        //create user model
        var oUserModel = new sap.ui.model.json.JSONModel([sRootPath,mConfig.user].join("/"));
        this.setModel(oUserModel,"USER");
        
        var oEEModel = new sap.ui.model.json.JSONModel([sRootPath,mConfig.ee].join("/"));
        this.setModel(oEEModel,"EE");
                
        // initialize router and navigate to the first page
        this.getRouter().initialize();
	},
	
	// creation and setup of the oData model
    _initODataModel : function(sServiceUrl) {
        jQuery.sap.require("sap.ui.ZTime_Entry.util.messages");
        var oConfig = {
            metadataUrlParams : {},
            json : true,
            // loadMetadataAsync : true,
            defaultBindingMode :"TwoWay",
            defaultCountMode: "Inline",
            useBatch : true
        };
        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, oConfig);
        oModel.attachRequestFailed(null, function(oParameter){
        	this.getEventBus().publish("Component", "MetadataFailed");
        	sap.ui.ZTime_Entry.util.messages.showErrorMessage(oParameter);
        	});
        this.setModel(oModel);
        return oModel;
    },
    
    getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	}
});
}());