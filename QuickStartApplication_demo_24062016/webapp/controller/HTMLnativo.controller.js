sap.ui.define(["QuickStartApplication/controller/BaseController", "QuickStartApplication/js/format/CustomerFormat"], function (BaseController, CustomerFormat) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.HTMLnativo", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 **/
		onInit : function () {

		    this.initCustomFormat();
    	        
	        // 1.Get the id of the VizFrame		
            var oVizFrame = this.getView().byId("idVizFrame");
            var oPage = this.getView().byId("paginaHTML");
            		
            // 2.Create a JSON Model and set the data
            //var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
            //var oModel = new sap.ui.model.json.JSONModel(rootPath + "/model/projects.json");
        	//var data = oModel.getData();
        	
        	var data = {
              "Projects": [
            	{
            	    "Codigo": "INT-001000-05699",
            	    "Nombre": "Proyecto ONE ERP",
                    "Reporting": [ { 
                        "Month": "Enero",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Febrero",
                        "GrossRevenuePTD": 153000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Marzo",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Abril",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Mayo",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Junio",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Julio",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Agosto",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Septiembre",
                        "GrossRevenuePTD": 283000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Octubre",
                        "GrossRevenuePTD": 583000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Noviembre",
                        "GrossRevenuePTD": 183000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    },
                    { 
                        "Month": "Diciembre",
                        "GrossRevenuePTD": 83000,
                        "TotalCostPTD": 2200000,
                        "ContractMargin": "30%",
                        "TargetMargin": "45%",
                        "Margin GAP": "15%" 
                    }
            	  	]
            	},
            	{
            	    "Codigo": "INT-001000-05700",
            	    "Nombre": "Proyecto TWO ERP"
            	}, {
            	    "Codigo": "INT-001000-05702",
                    "Nombre": "Metro de Madrid, S.A."
            	}
              ]
            };
        	
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data.Projects[parseInt(0)]);
            oPage.setTitle(data.Projects[parseInt(0)].Nombre);
            		
            // 3. Create Viz dataset to feed to the data to the graph
    		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    			dimensions : [{
    				name : 'Mes',
    				value : "{Month}"}],
    			measures : [{
    				name : 'Gross Revenue PTD',
    				value : '{GrossRevenuePTD}'
    			}],
    			data : {
    				path : "/Reporting"
    			}
    		});	
    		oVizFrame.setDataset(oDataset);
    		oVizFrame.setModel(oModel);	
    		oVizFrame.setVizType("pie");
            		
            // 4.Set Viz properties
    		oVizFrame.setVizProperties({
    			title:{
    				text : "Ejercicio 2015"
    			},
                plotArea: {
                	colorPalette : d3.scale.category20().range(),
                	drawingEffect: "glossy",
                    dataLabel:{
                        visible: false
                    }
                },
                uiConfig: {
                    applicationSet: "fiori"
                }
    		});
    		
    		var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
    		      'uid': "size",
    		      'type': "Measure",
    		      'values': ["Gross Revenue PTD"]
    		    }), 
    		    feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
    		      'uid': "color",
    		      'type': "Dimension",
    		      'values': ["Mes"]
    		    });
    		oVizFrame.addFeed(feedSize);
    		oVizFrame.addFeed(feedColor);
		},
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
	});
});