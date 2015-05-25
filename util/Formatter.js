jQuery.sap.declare("sap.ui.ZTime_Entry.util.Formatter");

sap.ui.ZTime_Entry.util.Formatter = {
		iconMap : {
				10 : {
					text : "In Process",
					src	 : "sap-icon://status-in-process"
				},
				20 : {
					text : "Released for Approval",
					src	 : "sap-icon://shipping-status"
				},
				30 : {
					text : "Approved",
					src	 : "sap-icon://status-completed"
				}
			},
		
		
		toDispalyDate : function(value){
			if(value)
			{
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
				return oDateFormat.format(new Date(value),"UTC");
			}
			else
			{
				return value;
			}
		},

		toSendDate : function(value){
			if(value)
			{				
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ssZ"});
				// Can't prase :, use %3A to replace it
//				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH%3Amm%3AssZ"});
				var sDate = new Date(value);
				var UTCDate = new Date();
				UTCDate.setUTCFullYear(sDate.getFullYear());
				UTCDate.setUTCMonth(sDate.getMonth());
				UTCDate.setUTCDate(sDate.getDate());
				UTCDate.setUTCHours("0");
				UTCDate.setUTCMinutes("0");
				UTCDate.setUTCSeconds("0");
				return oDateFormat.format(UTCDate,"UTC");
			}
			else
			{
				return value;
			}
		},
		
		toSendDate_Unchange : function(value){
			if(value)
			{
				// Can't prase :, use %3A to replace it
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ssZ"});
				return oDateFormat.format(new Date(value),"UTC");	
			}
			else
			{
				return value;
			}
		},
		
		
		
		toIconAdd : function(value)
		{
			var iconMap = sap.ui.ZTime_Entry.util.Formatter.iconMap;
			switch(value)
			{
				case "10" :
					return iconMap[10].src;
				case "20" :
					return iconMap[20].src;
				case "30" :
					return iconMap[30].src;
				default :
					return value;
			}
		},
		
		toIconText : function(value)
		{
			var iconMap = sap.ui.ZTime_Entry.util.Formatter.iconMap;
			switch(value)
			{
				case "10" :
					return iconMap[10].text;
				case "20" :
					return iconMap[20].text;
				case "30" :
					return iconMap[30].text;
				default :
					return value;
			}
		},
		
		statusCb : function(value)
		{
			if( value == "10" )
				return true;
			else
				return false;
		},
		
		getWeekBegin : function(date)
		{
			if(date)
			{
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ssZ"});
				var day = date.getDay();
				return oDateFormat.format(new Date( date.getTime() - day*24*60*60*1000 ),"UTC");
			}
			else
			{
				return date;
			}
		},
		
		getWeekEnd : function(date)
		{
			if(date)
			{
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ssZ"});
				var day = 6 - date.getDay();
				return oDateFormat.format(new Date( date.getTime() + day*24*60*60*1000 ),"UTC");
			}
			else
			{
				return date;
			}
		},
		
		toApproveIcon : function(status)
		{
			if(status)
			{
				switch(status)
				{
				case "30":
					return "sap-icon://accept";
				default:
					return "";
				}			
			}	
			else
			{
				return status
			}
		},
		
		toApprovePressed : function(status)
		{
			if(status)
			{
				switch(status)
				{
				case "30":
					return true;
				default:
					return false;
				}			
			}	
			else
			{
				return status;
			}
		},
		
		toRejectPressed : function(status)
		{
			if(status)
			{
				switch(status)
				{
				case "40":
					return true;
				default:
					return false;
				}			
			}	
			else
			{
				return status;
			}
		},
		
		toRejectIcon : function(status)
		{
			if(status)
			{
				switch(status)
				{
				case "40":
					return "sap-icon://decline";
				default:
					return "";
				}			
			}	
			else
			{
				return status
			}
		},
		
		toSelectEnabled : function(status)
		{
			if(status)
			{
				switch(status)
				{
				case "30":
					return false;
				case "40":
					return true;
				default:
					return false;
				}
			}
			else
			{
				return status;
			}	
		},
};