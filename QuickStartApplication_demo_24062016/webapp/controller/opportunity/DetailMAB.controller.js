sap.ui.define([
	"QuickStartApplication/controller/BaseController",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"jquery.sap.global"
    ], function (BaseController, JSONModel, Filter, FilterOperator, jQuery) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.opportunity.DetailMAB", {
		
		onInit : function () {

            // carga el modelo de recibos
        	this._OpportunitysModel = sap.ui.getCore().getModel("Opportunitys");
        	this.getView().setModel(this._OpportunitysModel);
        	
        	// Register the view with the message manager
    		sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);

    		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
    			
    			this._index = oEvent.getParameter("arguments").id;
    			
    			// DATOS PARA TAB MAIN
    			var panel = this.getView().byId("panelInfo");
		        panel.bindElement("/Opportunitys/"+this._index);
		        
		        // DATOS PARA TAB ACCESS AND CONTROL
		        var tablaUsers = this.byId("tableUsersOppor");
		        //tablaUsers.bindAggregation("rows", "/Opportunitys/"+index+"/Users");
	            tablaUsers.bindItems("/Opportunitys/"+this._index+"/Users", new sap.m.ColumnListItem({
	                cells : [ new sap.m.Text({
	                    text : "{Name}"
	                }), new sap.m.Text({
	                    text : "{EmployeeID}"
	                })]
	            }));

    		}, this);
		},
		
		onAddRow : function () {
			if (!this._formRow) {
				this._cbxTypeService = new sap.m.ComboBox("cbxTypeService", {
		                	width : "95%",
		                    items: {
								path: "maestros>/ServiceTypes",
								template: new sap.ui.core.ListItem({
									text: "{maestros>name}"
								})
							}
		                });
				this._cbxCategory = new sap.m.ComboBox("cbxCategory", {
		                	width : "95%",
		                    items: {
								path: "maestros>/Categorys",
								template: new sap.ui.core.ListItem({
									text: "{maestros>name}"
								})
							}
		                });
		         this._inputPercent = new sap.m.Input("inputPercent", {
		                	width: "50%",
		                	description:"%",
		                	type: "Number",
		                	maxLength : 3
		                });
		         this._formRow = new sap.m.ColumnListItem("formRow",{
		                cells : [ 
		                	this._cbxTypeService, 
		                	this._cbxCategory, 
		                	this._inputPercent]
				});
				this._cbxTypeService.attachSelectionChange(this._rowComplete, this);
				this._cbxCategory.attachSelectionChange(this._rowComplete, this);
			}
			var tabla = this.byId("tableClassificationFields");
			tabla.addItem(this._formRow);
			this.byId("addRowButton").setVisible(false);
		},
		
		_rowComplete : function() {
			if(this._inputPercent.getValue() && this._cbxTypeService.getSelectedItem() && this._cbxCategory.getSelectedItem()) {

				var tabla = this.byId("tableClassificationFields");
				tabla.removeItem(this._formRow);
				tabla.addItem(new sap.m.ColumnListItem({
	                cells : [ new sap.m.Text({
	                    text : this._cbxTypeService.getSelectedItem().getText()
	                }), new sap.m.Text({
	                    text : this._cbxCategory.getSelectedItem().getText()
	                }),  new sap.m.Text({
	                    text : this._inputPercent.getValue() + " %"
	                })]
	            }));
				this._cbxTypeService.setSelectedItem(null);
				this._cbxCategory.setSelectedItem(null);
				this._inputPercent.setValue("");
	            this.byId("addRowButton").setVisible(true);
			}
		},
		
		onDeleteField : function(oEvent) {
			var item = oEvent.getParameter("listItem");
			var tabla = this.byId("tableClassificationFields");
			tabla.removeItem(item);
			
			// por si el usuario borra la linea formRow
			this.byId("addRowButton").setVisible(true);
		},
		
		// ---- INICIO : FUNCIONALIDAD PARA TAB ACCESS AND CONTROL
		onShowFinderUsers : function() {
			if (!this._oDialogFinderUsers) {
				this._oDialogFinderUsers = sap.ui.xmlfragment("QuickStartApplication.view.opportunity.FinderUsers", this);
			}
			var oModel = new JSONModel(jQuery.sap.getModulePath("QuickStartApplication", "/model/Users.json"));
			this._oDialogFinderUsers.setModel(oModel);
			this._oDialogFinderUsers.open();
		},
		
		onFilterUsers : function () {

			// build filter array
			var aFilter = [], 
			// filters
			name = sap.ui.getCore().byId("inputName").getValue(),
			employeeID = sap.ui.getCore().byId("inputEmployeeID").getValue(),
			nif = sap.ui.getCore().byId("inputNIF").getValue(),
			// retrieve list control
			oTable = sap.ui.getCore().byId("usersTable"),
			// get binding for aggregation 'items'
			oBinding = oTable.getBinding("items");

			if (name) {
				aFilter.push(new Filter("Name", FilterOperator.Contains, name));
			}
			if (employeeID) {
				aFilter.push(new Filter("EmployeeID", FilterOperator.Contains, employeeID));
			}
			if (nif) {
				aFilter.push(new Filter("NIF", FilterOperator.Contains, nif));
			}
			// apply filter. an empty filter array simply removes the filter
			// which will make all entries visible again
			oBinding.filter(aFilter);
		},
		
		onSaveDialog : function() {
			var oTable = sap.ui.getCore().byId("usersTable");
			var items = oTable.getSelectedItems();
			if(items.length === 0) {
				sap.m.MessageToast.show("Select at least one element", {
					my : "center center",
					at : "center center"
				});
				return;
			}
			var dataUsers = this._oDialogFinderUsers.getModel().getData();
			var dataOpportunitys = this._OpportunitysModel.getData();
			// si la opportunity no tenia listado Users se crea
			if(!dataOpportunitys.Opportunitys[this._index].Users) {
				dataOpportunitys.Opportunitys[this._index].Users = [];
			}
			for(var i=0;i<items.length;i++) {
				var context = items[i].getBindingContext();
				var iUser = parseInt(context.getPath().split('/')[2]);
				dataOpportunitys.Opportunitys[this._index].Users.push(dataUsers.Users[iUser]);
			}
			this._OpportunitysModel.setData(dataOpportunitys);
			this._OpportunitysModel.refresh(true);
			this._oDialogFinderUsers.close();
		},
		
		onCancelDialog : function() {
			this._oDialogFinderUsers.close();
		},
		
		onDeleteUser : function(oEvent) {
			var path = oEvent.getParameter("listItem").getBindingContext().getPath();
            var idx = parseInt(path.substring(path.lastIndexOf("/") +1));
            var m = this.getView().getModel();
            var d = m.getData();
            d.Opportunitys[this._index].Users.splice(idx, 1);
            m.setData(d);
		}
		// ---- FIN : FUNCIONALIDAD PARA TAB ACCESS AND CONTROL

	});
});