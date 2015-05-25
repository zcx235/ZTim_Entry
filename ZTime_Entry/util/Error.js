jQuery.sap.declare("sap.ui.ZTime_Entry.util.Error");

sap.ui.ZTime_Entry.util.Error={
	getErrorMsg : function(data)
	{
		var msg;
		if(data)
		{
			var dataObj = eval("(" + data + ")");
//			$.each(dataObj.root)
			msg = dataObj.error.message.value;
		}
		return msg;
	}
};