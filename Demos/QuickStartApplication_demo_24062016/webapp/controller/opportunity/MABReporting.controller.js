sap.ui.define([
	"QuickStartApplication/controller/BaseController", 
	"QuickStartApplication/js/format/CustomerFormat",
	"sap/m/MessageBox"
], function (BaseController, CustomerFormat, MessageBox) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.opportunity.MABReporting", {
		
		onInit : function() {
			this.initCustomFormat();
        	var reportingModel = sap.ui.getCore().getModel("Opportunitys");
        	this.getView().setModel(reportingModel);
        	
        	//---------------------------
  	        
	        // 1.Get the id of the VizFrame		
            var oVizFrame = this._vizFrame = this.getView().byId("idVizFrame");
            //var panelGrafico = this.getView().byId("panelGrafico");
            		
            // 2.Create a JSON Model and set the data
            //var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
            //var oModel = new sap.ui.model.json.JSONModel(rootPath + "/model/projects.json");
        	//var data = oModel.getData();
        	var mGroupInfo = this._mGroupInfo = ["Waiting for Response", "Proposal in Progress", "Identified", "Target"];
        	
        	var opportunitys = reportingModel.getData().Opportunitys;
        	var valores = [0,0,0,0];
        	
        	// for para sumar todos las estimaciones de ingresos de un mismo estado
        	for(var i in opportunitys) {
        		var index = mGroupInfo.indexOf(opportunitys[i].Status);
        		valores[index] = valores[index] + opportunitys[i].OpportunityValue;                         
        	}
        	
        	// for para crear modelo que pasaremos al grafico
        	var dataGrafico = { valores : []};
        	for(var j in mGroupInfo) {
        		dataGrafico.valores.push({
        			OpportunityValue : valores[j],
        			Status : mGroupInfo[j]
        		});
        	}
        	
        	
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(dataGrafico);
            		
            // 3. Create Viz dataset to feed to the data to the graph
    		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
    			dimensions : [{
    				name : 'Status',
    				value : "{Status}"}],
    			measures : [{
    				name : 'Estimate',
    				value : '{OpportunityValue}'
    			}],
    			data : {
    				path : "/valores"
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
                    text: "Opportunities"
                }
    		});
    		
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
    		
    		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
    		      'uid': "valueAxis",
    		      'type': "Measure",
    		      'values': ["Estimate"]
    		    }), 
    		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
    		      'uid': "categoryAxis",
    		      'type': "Dimension",
    		      'values': ["Status"]
    		    });
    		oVizFrame.addFeed(feedValueAxis);
    		oVizFrame.addFeed(feedCategoryAxis);
        	//-----------
        	
		},
		
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        },
        
        // ---- FUNCIONES TAB GAP REPORT
        onFinderOpportunity : function() {
        	MessageBox.confirm("Do you want to save this file?", {
				    title: "Download Excel",
				    styleClass : "sapMDialogTextoCentro",
				    onClose: function(sResult) {
					    if (sResult === MessageBox.Action.OK) {
					    	var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
							var encodeUrl = encodeURI(rootPath + "/docs/Monthly_WMAB_GAP_Report.xlsx");
					    	sap.m.URLHelper.redirect(encodeUrl, true);
					    }
				    }
            	});
        }

	});
});