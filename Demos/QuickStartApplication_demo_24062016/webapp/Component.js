sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
], function(UIComponent, Device) {
	"use strict";

	return UIComponent.extend("QuickStartApplication.Component", {

	//	metadata: {
	//		manifest: "json"
	//	},
		
		metadata:{
			manifest: "json",	
		
			"routing": {
        		"config": {
		            "routerClass": "sap.m.routing.Router",
		            "viewType": "XML",
		            "viewPath": "QuickStartApplication.view",
		            "targetControl": "appBase",
		            "targetAggregation": "pages",
		            "clearTarget": true,
		            "transition": "slide"
		         },
		         "routes": [{
			        "pattern": "View1",
			        "name": "View1",
			        "view": "View1",
			        "targetControl": "idAppControl",
			        subroutes:[
	            		{
				            "pattern": "dashboard",
				            "name": "dashboard",
				            "view": "dashboardTiles",
				            "targetControl": "dashboardPage",
		                    "targetAggregation": "content",
				            "viewLevel": 1
	            		},{
				            "pattern": "baseApps",
				            "name": "baseApps",
				            "view": "baseApps",
		                    "targetControl": "dashboardPage",
		                    "targetAggregation": "content",
				            "viewLevel": 1,
				             subroutes:[
                                {
        				            "pattern": "timeLabor",
        				            "name": "timeLabor",
        				            "view": "timeLabor.timeLabor",
        				            "viewLevel": 2
        				         },
        				         {
        				            "pattern": "inicioHojaDeGastos",
        				            "name": "inicioHojaDeGastos",
        				            "view": "hojaDeGastos.inicioHojaDeGastos",
        				            "viewLevel": 2,
        				            subroutes: [{
            				            "pattern": "hojaDeGastos/{project}/{task}",
            				            "name": "hojaDeGastos",
            				            "view": "hojaDeGastos.hojaDeGastos",
            				            "targetControl": "SplitAppDemo",
            				            "targetAggregation": "detailPages",
            				            "viewLevel": 3
        				            }]
        				         },
        				          {
        				            "pattern": "gestionProyectos",
        				            "name": "gestionProyectos",
        				            "view": "gestionProyectos",
        				            "viewLevel": 2
        				         },
        				         {
        				         	"pattern": "detalleProyecto",
        				            "name": "detalleProyecto",
        				            "view": "detalleProyecto",
        				            "viewLevel": 2
        				         },
        				         {
        				         	"pattern": "workflowDetail",
        				            "name": "workflowDetail",
        				            "view": "workflowDetail",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "graficos",
        				            "name": "graficos",
        				            "view": "graficos",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "listadoOData",
        				            "name": "listadoOData",
        				            "view": "listadoOData",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "flujo",
        				            "name": "flujo",
        				            "view": "flujo",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "HTMLnativo",
        				            "name": "HTMLnativo",
        				            "view": "HTMLnativo",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "createOpportunity",
        				            "name": "createOpportunity",
        				            "view": "opportunity.createOpportunity",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "MABReporting",
        				            "name": "MABReporting",
        				            "view": "opportunity.MABReporting",
        				            "viewLevel": 2
        				         },
        				          {
        				         	"pattern": "MABManagement",
        				            "name": "MABManagement",
        				            "view": "opportunity.MABManagement",
        				            "viewLevel": 2
        				         },
        				         {
        				         	"pattern": "detailMAB/{id}",
        				            "name": "detailMAB",
        				            "view": "opportunity.detailMAB",
        				            "viewLevel": 3
        				         },
        				         {
        				         	"pattern": "dinamycTable",
        				            "name": "dinamycTable",
        				            "view": "DinamycTable",
        				            "viewLevel": 3
        				         },
        				         {
        				         	"pattern": "informes",
        				            "name": "informes",
        				            "view": "Informes",
        				            "viewLevel": 3
        				         },
        				          {
        				         	"pattern": "reporting",
        				            "name": "reporting",
        				            "view": "reporting.masterProjects",
        				            "viewLevel": 2,
        				            subroutes: [{
            				            "pattern": "reporting/{project}",
            				            "name": "detailProject",
            				            "view": "reporting.detailProject",
            				            "targetControl": "SplitAppDemo",
            				            "targetAggregation": "detailPages",
            				            "viewLevel": 3
        				            }]
        				         }
				             ]
	            		}
		             ]
		         }]
    		}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
			
			this.getModel().setUseBatch(false);
			
		    // this component should automatically initialize the router
			this.getRouter().initialize();

           // set device model
            var deviceModel = new sap.ui.model.json.JSONModel({
                isTouch : Device.support.touch,
                isNoTouch : !Device.support.touch,
                isPhone : Device.system.phone,
                isNoPhone : !Device.system.phone,
                listMode : Device.system.phone ? "None" : "SingleSelectMaster",
                listItemType : Device.system.phone ? "Active" : "Inactive"
            });
            deviceModel.setDefaultBindingMode("OneWay");
            this.setModel(deviceModel, "device");
            
            var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
        	var reportingModel = new sap.ui.model.json.JSONModel(rootPath + "/model/Opportunitys.json");
        	sap.ui.getCore().setModel(reportingModel, "Opportunitys");
    	}
	});
	

});