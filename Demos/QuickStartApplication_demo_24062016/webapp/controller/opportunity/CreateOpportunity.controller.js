sap.ui.define([
	"QuickStartApplication/controller/BaseController", 
	"sap/m/MessageBox"
	], function (BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.opportunity.CreateOpportunity", {
		
				/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 **/
		onInit : function () {
			var oppottunity = {"opportunity" : {
			  "OpportunityID": "MKT-010815-11111",
			  "Sector" : "Industry",
			  "Subsector": "Transport & Logistics",
			  "CustomerName": "",
			  "OpportunityName": "",
			  "TypeofService": "",
			  "DecisionDate": "",
			  "OpportunityValue": null,
			  "MarginObjective": "",
			  "BU": "",
			  "Office": "",
			  "Status": "Target"
			}};
			var mOpportunity = new sap.ui.model.json.JSONModel(oppottunity);
			
			this._formReport = this.byId("formOpportunity");
			this._formReport.setModel(mOpportunity);
			this._formReport.bindElement("/opportunity");
			
			this.byId("inputOffice").setFilterFunction(function(sTerm, oItem) {
				return oItem.getText().match(new RegExp(sTerm, "i"));
			});
		},
		
		onSave: function() {
			var reportingModel = sap.ui.getCore().getModel("Opportunitys");
			var modelNewReport = this._formReport.getBindingContext().getModel();
        	var dataNewReport = modelNewReport.getData();
        	dataNewReport.opportunity.OpportunityValue = parseInt(dataNewReport.opportunity.OpportunityValue);
        	
        	var reportingData = reportingModel.getData();
        	reportingData.Opportunitys.push(dataNewReport.opportunity);
        	reportingModel.setData(reportingData);
        	sap.ui.getCore().setModel(reportingModel, "Opportunitys");
        	this._formReport.unbindElement("/opportunity");
        	
        	MessageBox.show("You have successfully created the opportunity "+dataNewReport.opportunity.OpportunityID, {
        		icon: sap.m.MessageBox.Icon.SUCCESS,
        		title: "Opportunity Created!",
        		onClose : this.onNavBack
        	});
        	this.onInit();
		}

		
	});
});