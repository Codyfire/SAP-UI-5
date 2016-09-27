sap.ui.define(["QuickStartApplication/controller/BaseController"], function (BaseController) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.hojaDeGastos", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 **/
		onInit : function () {

    		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
    			// when detail navigation occurs, update the binding context
    			if (oEvent.getParameter("name") === "hojaDeGastos") {
    			    var project = oEvent.getParameter("arguments").project;
        		    var task = oEvent.getParameter("arguments").task;

        	        // creo un nuevo model con la informacion del item seleccionado
        	        var data = this.getView().getModel("projects").getData();
        	        var datosTarea = {
        	            codigoTarea : data.Projects[project].Tareas[task].Codigo,
        	            nombreTarea : data.Projects[project].Tareas[task].Nombre
        	        };
        	        var datosCombinados = $.extend(datosTarea, data.Projects[project]); // esta linea clona los datos
        	        var mReceiptAux =  new sap.ui.model.json.JSONModel({"Project" : datosCombinados});
        	        var gridDetalle = this.getView().byId("gridDetalle");
            		gridDetalle.setModel(mReceiptAux);
            		gridDetalle.bindElement("/Project");
    			}
    		}, this);

            // carga el modelo de recibos
			var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
        	var oModel = new sap.ui.model.json.JSONModel(rootPath + "/model/receipts.json");
        	this.getView().setModel(oModel, "receipts");
        	
        	// carga valores para el combo Expensive Type
        	var dataExp = {expensiveType : 
					[ {id: 1, name:"Taxi"},
					{id: 2, name:"Dinner"},
					{id: 3, name:"Breakfast"},
					{id: 4, name:"Lunch"},
					{id: 5, name:"Transport"}
					]};
			var modelExp = new sap.ui.model.json.JSONModel(dataExp);
			this.getView().setModel(modelExp, "modelExpensiveType");
        	
        	// Register the view with the message manager (carga validaciones)
    		sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
		},
		
		// muestra el formulario para la creacion de un recibo
		onShowPanelAddReceipt : function() {

			var receiptAux = {
				"receiptAux" : {
				  "Justification": "",
				  "ReceiptAmount": null,
				  "ExpensiveType": "",
				  "Date": "",
				  "CurrencyCode" : "EUR" 
				}
			};
			var mReceiptAux = new sap.ui.model.json.JSONModel(receiptAux);
			this.getView().setModel(mReceiptAux);
			
			// paso el modelo al panel
			var panel = this.getView().byId("receipt_panel");
			panel.bindElement("/receiptAux");
			
			this.getView().byId("receipt_panel").setVisible(true);
			this.getView().byId("receipt_add_button").setVisible(false);
			
			var botonSave = this.getView().byId("receipt_save_button");
			botonSave.setText("Add");
			//botonSave.attachPress(function () { controller.onSaveReceipt();});
		},
		
		// cancela la creación o modificación de un recibo
		onCancelReceipt : function() {
			var panel = this.getView().byId("receipt_panel");
			panel.unbindElement("/receiptAux");
			
			this.getView().byId("receipt_panel").setVisible(false);
			this.getView().byId("receipt_add_button").setVisible(true);
		},
		
		// guarda o modifica el recibo
		onSaveReceipt : function() {
		    var panel = this.getView().byId("receipt_panel");
		    var dataReceipt = panel.getBindingContext().getModel().getData();
		    
		    var model = this.getView().getModel("receipts");
			var data = model.getData();

            if(this.index == null) {
		        // guarda el nuevo recibo
				data.receipt.push(dataReceipt.receiptAux);
            } else {
                // modifica el recibo existente
				data.receipt.splice(this.index, 1, dataReceipt.receiptAux);
				this.index = null;
            }
            
            model.setData(data);
			panel.unbindElement("/receiptAux");
			
			this.getView().byId("receipt_panel").setVisible(false);
			this.getView().byId("receipt_add_button").setVisible(true);

			var page = this.getView().byId("principal");
			page.getScrollDelegate().getScrollTop();
		},
		
		// carga el recibo seleccionado para que pueda ser modificado
		pressFila : function () {
			var tabla = this.getView().byId("receipt_table");
			
			if (tabla.getMode() === sap.m.ListMode.SingleSelectMaster) {
				// obtengo el contexto (el item seleccionado) de la fila
				var item = tabla.getSelectedItem();
				var contexto = item.getBindingContext("receipts");
	        	this.index = contexto.getPath().split('/')[2];
	        	
	        	// creo un nuevo model con la informacion del item seleccionado
	        	var data = this.getView().getModel("receipts").getData();
	        	//var aDataCopy = JSON.parse(JSON.stringify(data.receipt[this.index])); // esta linea clona los datos
	        	var aDataCopy = $.extend({}, data.receipt[this.index]); // esta linea clona los datos
	        	var mReceiptAux =  new sap.ui.model.json.JSONModel({"receiptAux" : aDataCopy});  
    			this.getView().setModel(mReceiptAux);
    			
				// paso el modelo al panel
				var panel = this.getView().byId("receipt_panel");
				panel.bindElement("/receiptAux");
				
				// paso el modelo del item seleccionado al panel
				//var panel = this.getView().byId("receipt_panel");
				//panel.bindElement({path : contexto.getPath(), model : "receipts"});
	        	
	        	// muestro el panel y los botones correspondientes
	        	this.getView().byId("receipt_panel").setVisible(true);
				this.getView().byId("receipt_add_button").setVisible(false);
				
				var botonSave = this.getView().byId("receipt_save_button");
				botonSave.setText("Update");
			}
		},
		
		// borra los recibos seleccionados
		onDeleteSlc : function() {
			var tabla = this.getView().byId("receipt_table");
			var items = tabla.getSelectedItems();
			if(items.length === 0) {
				sap.m.MessageToast.show("Select at least one element", {
					my : "center center",
					at : "center center"
				});
				return;
			}
			var model = this.getView().getModel("receipts");
			var data = model.getData();
			
			var itemsDelete = new Array(items.length);
			for(var i=0;i<items.length;i++) {
				var context = items[i].getBindingContext("receipts");
				itemsDelete[i] = parseInt(context.getPath().split('/')[2]);
			}
			var dataAux = { "receipt": []};
			for(i=0;i<data.receipt.length;i++) {
				if(itemsDelete.indexOf(i) === -1) {
					dataAux.receipt.push(data.receipt[i]);
				}
			}

			model.setData({"receipt": null}, "receipts");
			model.setData(dataAux, "receipts");
			
			tabla.removeSelections(true);
		},
		
		// abre o cierra la multiseleccion
		handleMultiSelect : function() {
			var tabla = this.getView().byId("receipt_table");
			var deleteBtn = this.getView().byId("receipt_delete_button");
			var mode = tabla.getMode();
			if (mode === sap.m.ListMode.MultiSelect) {
				tabla.setMode(sap.m.ListMode.SingleSelectMaster);
				deleteBtn.setVisible(false);
				this.getView().byId("receipt_add_button").setVisible(true);
			} else {
				tabla.setMode(sap.m.ListMode.MultiSelect);
				deleteBtn.setVisible(true);
				this.getView().byId("receipt_panel").setVisible(false);
				this.getView().byId("receipt_add_button").setVisible(false);
				tabla.removeSelections(true);
			}
		},
		
		handleUploadComplete: function(oEvent) {
			var sResponse = oEvent.getParameter("response");
			if (sResponse) {
				var sMsg = "";
				var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
				if (m[1] === "200") {
					sMsg = "Return Code: " + m[1] + "\n" + m[2], "SUCCESS", "Upload Success";
					oEvent.getSource().setValue("");
				} else {
					sMsg = "Return Code: " + m[1] + "\n" + m[2], "ERROR", "Upload Error";
				}
				sap.m.MessageToast.show(sMsg);
			}
		},
 
		handleUploadPress: function() {
			var oFileUploader = this.getView().byId("fileUploader");
			var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
			oFileUploader.setUploadUrl(rootPath + "/upload");
			oFileUploader.upload();
		},
	
/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf QuickStartApplication.view.view.hojaDeGastos
		 *///	onBeforeRendering: function() {
//
//	},
/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf QuickStartApplication.view.view.hojaDeGastos
		 *///	onAfterRendering: function() {
//
//	},
/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf QuickStartApplication.view.view.hojaDeGastos
		 *///	onExit: function() {
//
//	}
		/**
    	*@memberOf QuickStartApplication.view.controller.hojaDeGastos
    	*/
		getSplitAppObj : function() {
			var inicioHojaDeGastos = sap.ui.xmlview("QuickStartApplication.view.hojaDeGastos.inicioHojaDeGastos");
			var result = inicioHojaDeGastos.byId("SplitAppDemo");
			if (!result) {
				console.log("SplitApp object can't be found");
			}
			return result;
		},
    	volver: function () {
    	    console.log("volver masterProjects");
	        //This code was generated by the layout editor.
	        this.getSplitAppObj().toMaster(this.createId("masterProjects"));
	    }
	});
});