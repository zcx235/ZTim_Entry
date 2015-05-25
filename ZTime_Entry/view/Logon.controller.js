sap.ui.controller("sap.ui.ZTime_Entry.view.Logon", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Logon
*/
	onInit: function() {
//		var sServiceUrl = this.getUrl("/sap/opu/odata/sap/z_demo_zz_srv/");
//		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true,"azhu","abc1234");
//		alert(getCookie("SAP_SESSIONID_EC7_800"));
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Logon
*/
	onBeforeRendering: function() {
		
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Logon
*/
	onAfterRendering: function() {
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Logon
*/
//	onExit: function() {
//
//	}
	
	handlePress : function(){
//		var account= $.cookie('SAP_SESSIONID_EC7_800');
//		alert(account);
//		var sServiceUrl = this.getUrl("/sap/opu/odata/sap/z_demo_zz_srv/");
		var username = this.getView().byId("username").getValue();
		var password = this.getView().byId("password").getValue();

		//using SAP SSO Token Login
		var logoffUrl = this.getUrl("/sap/public/bc/icf/logoff");
		var sServiceUrl = this.getUrl("/sap/opu/odata/sap/ZTIME_ENTRYS_SRV/");
		
		var oView = this.getView();
		var oController = this;
		//sequence ---- error, then statusCode
//		jQuery.ajax({  
//	           type: "GET",  
//	           url: logoffUrl,  //Clear SSO cookies: SAP Provided service to do that  
//	        }).done(function(data){ //Now clear the authentication header stored in the browser  
                    if (!document.execCommand("ClearAuthenticationCache")) {  
                         //"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
                         $.ajax({  
                                   type: "GET",  
                                   url: sServiceUrl, //any URL to a Gateway service  
                                   username: username, //when request fails, will clear the authentication header  
                                   password: password, 
                                   error: function(msg) {
                                	   var msgText = "";
                                	   switch(msg.status)
                                	   {
                                	   		case 401:
                                	   			msgText = "Username or Password is incorrect.";
                                	   			break;
                                	   		case 403:
                                	   			msgText = "Unauthorized";
                                	   			break;
                                	   }
//                                	   $("#errorArea").css("display","table-row");
//                                	   var errorAreaId = sap.ui.getCore().byId("logon").createId("errorArea")
                                	   var errorAreaId = oView.createId("errorArea");
                                	   $("#"+errorAreaId).css("display","table-row");
                                	   oView.byId("errorMsg").setText(msgText);
//                                	   +msg.responseText
//                                	   alert("1+$('#logon--errormsg').append("您所输入的用户名和密码有误，请重新输入");
                                   },
                                   statusCode: { 401: function() {  
//                                	   alert("2.statsCode");
                                	   //$('#logon--errormsg').append("您的账号不具备访问权限，请联系管理员");
                                   } }, 
                                   success: function(){
//                                	   alert('3. success');
               						   var oUserData = {BNAME: username, PERNR: "", TIMEKEEPER:""};
//               						   var oUserModel = new sap.ui.model.json.JSONModel(oUserData);
               						   sap.ui.getCore().getModel("USER").setData(oUserData);
               						   
                                	   var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,true,username,password);
                                	   sap.ui.getCore().setModel(oModel,"ODATA");
                                	   oController.nav.to("EmployeeList");
//                                	   $('#logon--errormsg').attr("class","alert alert-success");
//                                	   $('#logon--errormsg').append("登陆成功");
                                   }
                        });  
                    }  
//	        }); 

		
//		var oModel2 = new sap.ui.model.odata.ODataModel(sServiceUrl,true,username,password).attachMetadataFailed(
//				function(oEvent){
//					var message = oEvent.getParameters().getParameter("message");
//					var statusText = oEvent.getParameters().getParameter("statusText");
//					alert(message + statusText);
//				}).attachRequestFailed(
//				function(res)
//				{
//					alert('Fail');
//				});
//		oModel2.refreshSecurityToken()
//		console.log(oModel2);
//		oModel.read('/PA0001_SET',null.null,true,null,null,function(){},function
//				{
//				
//				})
		//oModel.read("/Collectionname", null, null,false,
//				  function(oData, response)
//				  {
//				  //Success
//				  }
//				  function(oError)
//				  {
//				  //Error
//				  });
	},
	
	getUrl : function(sUrl)
	{
		if( sUrl == "")
			return sUrl;
		if(window.location.hostname == "localhost")
		{
			return "proxy" + sUrl;
		}
		else
		{
			return sUrl;
		}
	},
	
});