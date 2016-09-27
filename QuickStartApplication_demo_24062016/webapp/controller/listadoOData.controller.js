sap.ui.define(["QuickStartApplication/controller/BaseController"], function (BaseController) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.listadoOData", {

		onInit: function(){
		    var oModel = new sap.ui.model.odata.ODataModel("https://services.odata.org/V2/Northwind/Northwind.svc");   
            sap.ui.getCore().setModel(oModel);  
            var oText = this.getView().byId("textoData");
            oText.bindElement("/Customers('ALFKI')");  
		}
		
	});
});