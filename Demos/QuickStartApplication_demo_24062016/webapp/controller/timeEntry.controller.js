sap.ui.define([
    "QuickStartApplication/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.timeEntry", {

		onInit: function () {
		    var oView = this.getView();
		    
			// carga buscador proyectos
			this.oModel = new JSONModel(jQuery.sap.getModulePath("QuickStartApplication", "/model/projects.json"));
			this.oSF = oView.byId("searchField");
			this.oSF.setModel(this.oModel);
			
			// carga combo semanas
			var semanas = { semanas : [
			    { id : "2", fecha : "Lunes 2 Feb 2016 - Domingo 8 Feb 2016"},
			    { id : "9", fecha : "Lunes 9 Feb 2016 - Domingo 15 Feb 2016"},
			    { id : "16", fecha : "Lunes 16 Feb 2016 - Domingo 22 Feb 2016"}
			    ]};
			this.oComboSemanas = oView.byId("comboSemanas");
			this.oComboSemanas.setModel(new JSONModel(semanas));
			this.oComboSemanas.attachChange(function(){
			    oView.byId("bloqueTemplate").setVisible(true);
			});
			
		},
		
		selectSemana: function (oEvent) {
		    var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");
 
			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}
 
			sap.m.MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},
 
		onSearch: function (event) {
			var item = event.getParameter("suggestionItem");
			if (item) {
				sap.m.MessageToast.show("search for: " + item.getText());
			}
		},
 
		onSuggest: function (event) {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [new sap.ui.model.Filter([
		              new sap.ui.model.Filter("Codigo", function(sText) {
			             return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
			         }),
			         new sap.ui.model.Filter("Nombre", function(sDes) {
				          return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
				     })
		             ], false)];
			}
			this.oSF.getBinding("suggestionItems").filter(filters);
			this.oSF.suggest();
		},
		
		newRow: function() {
		    if(this.TL === undefined) {
		        sap.m.MessageToast.show("Se crea la tabla");
		        this._crearTabla();
		    } else {
		        sap.m.MessageToast.show("Ya existe la tabla");
		        this.TL.TL.push({
                  project : this.oSF.getValue(),
                  template: this.getView().byId("comboTemplates").getSelectedItem().getText(),
                  dia1 : 8,
                  dia2 : 8,
                  dia3 : 8,
                  dia4 : 8,
                  dia5 : 8,
                  dia6 : 8,
                  dia7 : 8
                });
                this.oTable.getModel().setData(this.TL);
		    }
		},
		
		_crearTabla: function() {
		    var dia = parseInt(this.oComboSemanas.getSelectedKey());
		    var columnas = {
		            noDataText : "Drop column list items here and columns in the area above",
                    columns : [ new sap.m.Column({
                        width : "25%",
                        header : new sap.m.Label({
                            text : "Project"
                        })
                    }), new sap.m.Column({
                        width : "20%",
                        header : new sap.m.Label({
                            text : "Type"
                        })
                    }) ]
                };
            for(var i=0;i<7;i++) {
                columnas.columns.push(new sap.m.Column({
                        width : "4%",
                        header : new sap.m.Label({
                            text : dia + i
                        })
                }));
            }
            columnas.columns.push(new sap.m.Column({
                        header : new sap.m.Label({
                            text : "Total"
                        })
            }));
            columnas.columns.push(new sap.m.Column({
                        header : new sap.m.Label({
                            text : "Acciones"
                        })
            }));
            
            this.TL = { TL : [{
                  project : this.oSF.getValue(),
                  template: this.getView().byId("comboTemplates").getSelectedItem().getText(),
                  dia1 : 8,
                  dia2 : 8,
                  dia3 : 8,
                  dia4 : 8,
                  dia5 : 8,
                  dia6 : 8,
                  dia7 : 8
                }
            ]};
		  
		    var tempTL = this.TL;
		    var model = new JSONModel(this.TL);
            this.oTable = new sap.m.Table("tablaTL", columnas);
            this.oTable.bindItems("/TL", new sap.m.ColumnListItem({
                cells : [ new sap.m.Text({
                    text : "{project}"
                }), new sap.m.Text({
                    text : "{template}"
                }), new sap.m.Input({
                    value : "{dia1}"
                }), new sap.m.Input({
                    value : "{dia2}"
                }), new sap.m.Input({
                    value : "{dia3}"
                }), new sap.m.Input({
                    value : "{dia4}"
                }), new sap.m.Input({
                    value : "{dia5}"
                }), new sap.m.Input({
                    value : "{dia6}"
                }), new sap.m.Input({
                    value : "{dia7}"
                }), new sap.m.Text({
                    text : "{dia1+dia2+dia3+dia4+dia5+dia6+dia7}"
                }), new sap.m.Button({
                    text: "Delete",
                    icon : "sap-icon://sys-cancel",
                    press : function(oEvent) { 
                        var context = oEvent.getSource().getBindingContext();
                        var index = context.getPath().split('/')[2];
                        tempTL.TL.splice(index, 1);
                        model.setData(tempTL);
                    }
                })]
            }));
            
            this.oTable.setModel(model);
		    this.getView().byId("bloqueTabla").addContent(this.oTable);
		}
/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf QuickStartApplication.view.view.timeLabor
		 *///	onBeforeRendering: function() {
//
//	},
/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf QuickStartApplication.view.view.timeLabor
		 *///	onAfterRendering: function() {
//
//	},
/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf QuickStartApplication.view.view.timeLabor
		 *///	onExit: function() {
//
//	}
		/**
	*@memberOf QuickStartApplication.view.controller.timeLabor
	*/
	});
});