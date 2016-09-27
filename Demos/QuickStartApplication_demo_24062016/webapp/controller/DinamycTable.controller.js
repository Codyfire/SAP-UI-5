sap.ui.define([
    "QuickStartApplication/controller/BaseController",
    "sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/m/TablePersoController",
	"./DemoPersoService",
	"QuickStartApplication/js/format/Formatter"
], function (BaseController, JSONModel, jQuery, TablePersoController, DemoPersoService, Formatter) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.DinamycTable", {
		
		formatter : Formatter,

		onInit: function () {
 
			// set explored app's demo model on this sample
			var oModel = new JSONModel(jQuery.sap.getModulePath("QuickStartApplication", "/model/products.json"));
			var oGroupingModel = new JSONModel({ hasGrouping: false});
			this.getView().setModel(oModel);
			this.getView().setModel(oGroupingModel, "Grouping");
 
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.getView().byId("productsTable"),
				//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
				componentName: "demoApp",
				persoService: DemoPersoService
			}).activate();
		},
 
		onPersoButtonPressed: function () {
			this._oTPC.openDialog();
		},
 
		onTablePersoRefresh : function() {
			DemoPersoService.resetPersData();
			this._oTPC.refresh();
		},
 
		onTableGrouping : function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		}

	});
});