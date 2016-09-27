sap.ui.define(["QuickStartApplication/controller/BaseController", "QuickStartApplication/js/format/CustomerFormat"], function (BaseController, CustomerFormat) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.reporting.detailProject", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 **/
		onInit : function () {
		    
    		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
    		    this.initCustomFormat();
    		    
    			// when detail navigation occurs, update the binding context
    			if (oEvent.getParameter("name") === "detailProject") {
    			    var project = oEvent.getParameter("arguments").project;
        	        
        	        // 1.Get the id of the VizFrame		
                    var oVizFrame = this._vizFrame = this.getView().byId("idVizFrame");
                    var oPage = this.getView().byId("pageVizFrame");
                    		
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
                                "GrossRevenuePTD": 623560,
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
                                "GrossRevenuePTD": 1183000,
                                "TotalCostPTD": 2200000,
                                "ContractMargin": "30%",
                                "TargetMargin": "45%",
                                "Margin GAP": "15%" 
                            },
                            { 
                                "Month": "Julio",
                                "GrossRevenuePTD": 783000,
                                "TotalCostPTD": 2200000,
                                "ContractMargin": "30%",
                                "TargetMargin": "45%",
                                "Margin GAP": "15%" 
                            },
                            { 
                                "Month": "Agosto",
                                "GrossRevenuePTD": 280000,
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
                                "GrossRevenuePTD": 83900,
                                "TotalCostPTD": 2200000,
                                "ContractMargin": "30%",
                                "TargetMargin": "45%",
                                "Margin GAP": "15%" 
                            },
                            { 
                                "Month": "Noviembre",
                                "GrossRevenuePTD": 590000,
                                "TotalCostPTD": 2200000,
                                "ContractMargin": "30%",
                                "TargetMargin": "45%",
                                "Margin GAP": "15%" 
                            },
                            { 
                                "Month": "Diciembre",
                                "GrossRevenuePTD": 383000,
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
                    
                    var reporting = data.Projects[0].Reporting;
                    for(var i in reporting) {
                        reporting[i].TotalCostPTD = reporting[i].TotalCostPTD - reporting[i].GrossRevenuePTD;
                    }
                	
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(data.Projects[parseInt(project)]);
                    oPage.setTitle(data.Projects[parseInt(project)].Nombre);
                    //oVizFrame.setTitle(oPage.getTitle());
                    		
                    // 3. Create Viz dataset to feed to the data to the graph
            		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            			dimensions : [{
            				name : 'Mes',
            				value : "{Month}"}],
            			measures : [{
            				name : 'Gross Revenue PTD',
            				value : '{GrossRevenuePTD}'
            			},
            			{
            				name : 'Total Cost PTD',
            				value : '{TotalCostPTD}'}],
            			data : {
            				path : "/Reporting"
            			}
            		});	
            		oVizFrame.setDataset(oDataset);
            		oVizFrame.setModel(oModel);	
            		oVizFrame.setVizType('column');
                    		
                    // 4.Set Viz properties
            		oVizFrame.setVizProperties({
                        plotArea: {
                        	colorPalette : d3.scale.category20().range(),
                            dataLabel: {
                                visible: true,
                                formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
                            },
                            title: {
                                visible: true
                            }
                        },
                        categoryAxis: {
                            title: {
                                visible: true
                            }
                        },
                        uiConfig: {
                            applicationSet: "fiori"
                        },
                        title: {
                            visible: true,
                            text: 'Ejercicio 2015'
                        }
            		});
            		
                    var oPopOver = this.getView().byId("idPopOver");
                    oPopOver.connect(oVizFrame.getVizUid());
                    oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
            		
            		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            		      'uid': "valueAxis",
            		      'type': "Measure",
            		      'values': ["Gross Revenue PTD", "Total Cost PTD"]
            		    }), 
            		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            		      'uid': "categoryAxis",
            		      'type': "Dimension",
            		      'values': ["Mes"]
            		    });
            		oVizFrame.addFeed(feedValueAxis);
            		oVizFrame.addFeed(feedCategoryAxis);
    			}
    		}, this);
		},
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('tipoGraficoRadioGroup');
            datasetRadioGroup.setSelectedIndex(0);
        },
		
        onTipoGraficoSelected : function(oEvent){
            var tipoGrafico = oEvent.getSource();
            if(tipoGrafico.getSelected()){
                var text = tipoGrafico.getText();
                
                if(text === "Columnas") {
                    this._vizFrame.setVizType('column');
                } else if (text === "Barras") {
                    this._vizFrame.setVizType('bar');
                }
            }
        },
		
		
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
	});
});