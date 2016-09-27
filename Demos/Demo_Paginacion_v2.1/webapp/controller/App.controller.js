sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"Demo_Paginacion/control/Paginator"
], function(Controller, Paginator) {
	"use strict";

	return Controller.extend("Demo_Paginacion.controller.App", {
		
		onInit : function() {
			var tablaProducts = this.getView().byId("tablaProducts");
			var modelProducts = this.getOwnerComponent().getModel("ES4");
			
			var hbox = this.getView().byId("hboxPagination");
			hbox.addItem(new Paginator({
				table : tablaProducts,	// obligatorio
				model : modelProducts,	// obligatorio
				data : "/ProductSet",	// obligatorio
				size : 5				// opcional (por defecto 10)
			}));

		}

	});

});