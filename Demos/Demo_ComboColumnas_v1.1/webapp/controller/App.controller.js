sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/Grid",
	"sap/m/HBox",
	"sap/m/VBox",
	"Demo_ComboColumnas/control/ComboColumns"
], function(Controller, Grid, HBox, VBox, ComboColumns) {
	"use strict";

	return Controller.extend("Demo_ComboColumnas.controller.App", {
		
		onInit : function() {
			this._inputExpenses = this.byId("inputExpenses");

			this._oModel = new sap.ui.model.json.JSONModel(
{
	"expenseType": [
		{
			"type" : "Acomodation",
			"values" : [
				{ "name" : "Apartment 1st Install" },
				{ "name" : "Apartment maintenance" },
				{ "name" : "Apartment move" },
				{ "name" : "Apartment rent" },
				{ "name" : "Hotel" }
			]
		},
		{
			"type" : "Transport", 
			"values" : [
				{ "name" : "Car renting" },
				{ "name" : "Fly-back" },
				{ "name" : "Fuel" },
				{ "name" : "mileage renting" },
				{ "name" : "mileage standard" },
				{ "name" : "parking / toll" },
				{ "name" : "Plane ticket" },
				{ "name" : "Rates and taxes" },
				{ "name" : "Taxi" },
				{ "name" : "transport" }
			]
		},
		{
			"type" : "Meals",
			"values" : [
				{ "name" : "Business travel breakfast" },
				{ "name" : "Business travel lunch" },
				{ "name" : "Business travel dinner" },
				{ "name" : "Client Breakfast" },
				{ "name" : "Client lunch" },
				{ "name" : "Client dinner" },
				{ "name" : "Friday's lunch or intesive working day" },
				{ "name" : "Internal dinner" },
				{ "name" : "Internal lunch" }
			]
		},
		{
			"type" : "Per diem",
			"values" : [
				{ "name" : "Apartment per diem" },
				{ "name" : "Apartment per diem project start/end" },
				{ "name" : "Availability and guard" },
				{ "name" : "Hotel per diem" },
				{ "name" : "Hotel per diem project start/end" }
			]
		},
		{
			"type" : "Others",
			"values" : [
				{ "name" : "Events and conferences" },
				{ "name" : "IT accesories" },
				{ "name" : "Languages" },
				{ "name" : "Languages depdendent persons" },
				{ "name" : "Library" },
				{ "name" : "Line/data connection" },
				{ "name" : "Office materials" },
				{ "name" : "Other travel expenses" },
				{ "name" : "Scholarship" },
				{ "name" : "Third party gift" },
				{ "name" : "Training" }
			]
		}
	]
}
				);
			//this._oModel = sap.ui.getCore().getModel("ZTM_F_EXPENSETYPE");
			var expenseTypes = this._oModel.getProperty("/expenseType");
			this._columnas = [];
			for(var i = 0; i < expenseTypes.length; i++) {
				
				// el primer elemento es el titulo
				var celdas = [];
				celdas.push(new sap.m.Title({
					text : expenseTypes[i].type,
					titleStyle : sap.ui.core.TitleLevel.H3
				}));
				
				// todos los siguientes son link de expenses
				var expenses = expenseTypes[i].values;
				for(var j = 0; j < expenses.length; j++) {
					celdas.push(new sap.m.Link({
						text : expenses[j].name,
						press : this.onSelectExpense.bind(this)
					}));
				}
				
				this._columnas.push(new VBox({
					items : celdas
					/*layoutData : new sap.m.FlexItemData({ growFactor : 1 })*/
				}).addStyleClass("sapUiTinyMarginBeginEnd"));
			}
			this._noData = new sap.m.Text({ text : "No Data", visible : false });
			
			var hbox = new HBox({
				visible : true,
				backgroundDesign : sap.m.BackgroundDesign.Solid,
				items : [this._noData, this._columnas]
			});
			
			this._oPopover = new sap.m.Popover({
				showHeader : false,
				/*showArrow : false,*/
				placement : sap.m.PlacementType.Bottom
			}).addStyleClass("sapUiContentPadding");
			this._oPopover.addContent(hbox);
			
		},
		
		onDeploy : function(oEvent) {
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oInput = oEvent.getSource();
			this._oPopover.setContentMinWidth(oInput.getWidth());
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.openBy(oInput);
			});
			
		},
		
		onSelectExpense : function(oEvent) {
			var oSource = oEvent.getSource();
			var text = oSource.mProperties.text;
			this._inputExpenses.setValue(text);
			this._oPopover.close();
		},
		
		onFind : function(oEvent) {
			var str = oEvent.getParameter("value");
			
			var contColumn = 0;
			jQuery.each(this._columnas, function () {
				var items = this.getItems();
				var contItems = 0;
				jQuery.each(items, function (iNum, oItem) {
					if(iNum > 0) {
						if(oItem.getText().toLowerCase().includes(str.toLowerCase())) {
							oItem.setVisible(true);
						} else {
							oItem.setVisible(false);
							contItems++;
						}
					}
				});
				if(items.length === contItems + 1) {
					this.setVisible(false);
					contColumn++;
				} else {
					this.setVisible(true);
				}
			});
			
			this._noData.setVisible(contColumn === this._columnas.length);
		}

	});

});