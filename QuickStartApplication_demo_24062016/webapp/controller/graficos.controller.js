sap.ui.define([
	"QuickStartApplication/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("QuickStartApplication.controller.graficos", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf QuickStartApplication.view.view.graficos
		 */
			onInit: function() {

			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf QuickStartApplication.view.view.graficos
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf QuickStartApplication.view.view.graficos
		 */
			onAfterRendering: function() {
			    $("g.x.axis").find("text").each(function(){
			        $(this).text("Proyecto "+$(this).text());
			    });
			    
			    $(".divGroupedBars").find("rect").each(function(){
			       $(this).hover(function() {
			           $(this).css("fill", "#800000");
			       });
			       $(this).mouseout(function() {
			           $(this).css("fill", "");
			       });
			    });
			}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf QuickStartApplication.view.view.graficos
		 */
		//	onExit: function() {
		//
		//	}



	});

});