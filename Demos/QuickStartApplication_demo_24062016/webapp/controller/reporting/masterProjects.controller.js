sap.ui.define(["QuickStartApplication/controller/BaseController"], function (BaseController) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.reporting.masterProjects", {

		onInit: function(){
			sap.ui.core.UIComponent.getRouterFor(this);
			
			var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
        	var oModel = new sap.ui.model.json.JSONModel(rootPath + "/model/projects.json");
        	this.getView().setModel(oModel, "projects");
		},
		
		onPressProject : function(oEvent) {
		    // establezco el nombre del proyecto seleccionado a la pagina
	        var context = oEvent.oSource.getBindingContext("projects");
		    var path = context.getPath().split("/");
		    
		    // se ejecuta el detalle del proyecto
			this.getRouter().navTo("detailProject", {
				project : path[2]
			});
		},

 /*
		onPressNavToDetailSinRouting : function(oEvent) {
		    var context = oEvent.getSource().getBindingContext();
		    var path = context.getPath().split('/');
		    
		    var vistaHojaGastos = this.getSplitAppObj().getDetailPage("vistaHojaGastos");
		    if(vistaHojaGastos === null) {
    		    vistaHojaGastos = new sap.ui.core.mvc.XMLView("vistaHojaGastos", {
    		      viewName : "QuickStartApplication.view.hojaDeGastos"
    		    });
		        this.getSplitAppObj().addDetailPage(vistaHojaGastos);
		    }
		    var modelProjects = this.getView().getModel("projects");
		    var gridDetalle = vistaHojaGastos.byId("gridDetalle");
	        	
	        // creo un nuevo model con la informacion del item seleccionado
	        var data = modelProjects.getData();
	        var datosTarea = {
	            codigoTarea : data.Projects[path[2]].Tareas[path[4]].Codigo,
	            nombreTarea : data.Projects[path[2]].Tareas[path[4]].Nombre
	        };
	        var datosCombinados = $.extend(datosTarea, data.Projects[path[2]]); // esta linea clona los datos
	        var mReceiptAux =  new sap.ui.model.json.JSONModel({"Project" : datosCombinados});  
    		gridDetalle.setModel(mReceiptAux);
    		gridDetalle.bindElement("/Project");
		    
		    this.getSplitAppObj().toDetail("vistaHojaGastos");
		    
		    // si el dispositivo es un escritorio se vuelve al anterior master (los proyectos)
		    if(sap.ui.Device.system.desktop) {
		        this.getSplitAppObj().backMaster();
		    }
		},
*/
 
		onPressNavToDetail : function(oEvent) {
		    var context = oEvent.getSource().getBindingContext();
		    var path = context.getPath().split('/');
		    
		    // si el dispositivo es un escritorio se vuelve al anterior master (los proyectos)
		    if(sap.ui.Device.system.desktop) {
		        this.getSplitAppObj().backMaster();
		    }
		    // se ejecuta el detalle de hoja de gastos
			this.getRouter().navTo("hojaDeGastos", {
				project : path[2],
				task : path[4]
			});
		    
		},
		
        onSearch : function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery));
				aFilters.push(new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery));
			}
    			
    		// update list binding
    		var list = this.getView().byId("listProjects");
    		var binding = list.getBinding("items");
    		//binding.filter(aFilters); // esto ejecuta un AND entre filtros
    		binding.filter(!sQuery ? [] : [new sap.ui.model.Filter(aFilters, false)]); // esto ejecuta un OR entre filtros
		},
 
        // -------- metodos que todavia no se si sirven para algo -----------
		onPressDetailBack : function() {
			this.getSplitAppObj().backDetail();
		},
 
		onPressMasterBack : function() {
			this.getSplitAppObj().backMaster();
		},
 
 
		onListItemPress : function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
 
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
 
		onPressModeBtn : function(oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();
 
			this.getSplitAppObj().setMode(sSplitAppMode);
			sap.m.MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, {duration: 5000});
		},
 
		getSplitAppObj : function() {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				console.log("SplitApp object can't be found");
			}
			return result;
		}
	});
});