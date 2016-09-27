sap.ui.define([
	"QuickStartApplication/controller/BaseController",
	"sap/m/MessageBox",
	"QuickStartApplication/js/format/Formatter"],
function (BaseController, MessageBox, Formatter) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.opportunity.MABManagement", {
		
		formatter : Formatter,
		
		onInit : function() {
			
        	var reportingModel = sap.ui.getCore().getModel("Opportunitys");
        	this.getView().setModel(reportingModel);
		},
		
		/*getGroupHeader: function (oGroup){
			return new sap.m.GroupHeaderListItem({
				title: oGroup.title,
				upperCase: false
			});
		},*/
		
		onDetail : function(oEvent) {
			var context = oEvent.getSource().getBindingContext();
            var index = this._index = context.getPath().split("/")[2];
            
			this.getRouter().navTo("detailMAB", {
				id : index
			});
		},
		
		/*
		// se comenta porque de momento con el estado Cancelled es suficiente
		onDelete : function(event) {
			var path = event.getParameter("listItem").getBindingContext().getPath();
            var idx = parseInt(path.substring(path.lastIndexOf("/") +1));
            var m = this.getView().getModel();
            var d = m.getData();
            d.Opportunitys.splice(idx, 1);
            m.setData(d);
		},
		*/
		
		onAdvance : function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if(oSelectedItem.getText() === "") {
				return;
			}
			var context = oEvent.getSource().getBindingContext();
            var index = this._index = context.getPath().split("/")[2];
            
            var model = this.getView().getModel();
            var data = model.getData();
            this._newStatus = oSelectedItem.getText();
            this._currentStatus = data.Opportunitys[index].Status;
            
            if(this._newStatus === "Cancelled" || this._newStatus === "Rejected") {
            	var texto = this._newStatus === "Cancelled" ? "cancel" : "reject";
            	MessageBox.confirm("Are you sure you want to "+ texto +" the opportunity?", {
				    title: "Confirm",
				    styleClass : "sapMDialogTextoCentro",
				    onClose: function(sResult) {
					    if (sResult === MessageBox.Action.OK) {
					    	data.Opportunitys[index].Status = this._newStatus;
							model.setData(data);
							model.refresh(true);
					    }
				    }
            	});
            	return;
            }
				
			switch(this._currentStatus) {
			    case "Waiting for Response":
			    	if(this._newStatus === "Won") {
						// se va a avanzar de Waiting for Response a Won
						if (!this._oDialogWaiting) {
							this._oDialogWaiting = sap.ui.xmlfragment("QuickStartApplication.view.opportunity.advanceMABwaitingforresponse", this);
						}
						var dataAux3 = {
							"WinningDate": ""
						};
						var modelAux3 = new sap.ui.model.json.JSONModel(dataAux3);
						this._oDialogWaiting.setModel(modelAux3);
						this._oDialogWaiting.open();
			    	} else {
				    	// cualquier otro estado se actualiza
				    	data.Opportunitys[index].Status = this._newStatus;
						model.setData(data);
						model.refresh(true);
						
						this._destacaFila();
			    	}
			        break;
			        
			    case "Identified":
			    	if(this._newStatus === "Proposal in Progress") {
						// se va a avanzar de Identified a Proposal in Progress
						if (!this._oDialogIdentified) {
							this._oDialogIdentified = sap.ui.xmlfragment("QuickStartApplication.view.opportunity.advanceMABidentified", this);
						}
						var dataAux2 = {
							"WinningChance": "",
							"MarginObjective": "",
							"DecisionDate": "",
							"TypeofService": "",
							"BeginingDate": "",
							"EndingDate": ""
						};
						
						var modelAux2 = new sap.ui.model.json.JSONModel(dataAux2);
						this._oDialogIdentified.setModel(modelAux2);
						
						var rootPath = jQuery.sap.getModulePath("QuickStartApplication");
			        	var maestrosModel = new sap.ui.model.json.JSONModel(rootPath + "/model/Maestros.json");
			        	this._oDialogIdentified.setModel(maestrosModel, "maestros");
						
						this._oDialogIdentified.open();
			    	} else {
				    	// cualquier otro estado se actualiza
				    	data.Opportunitys[index].Status = this._newStatus;
						model.setData(data);
						model.refresh(true);
						
						this._destacaFila();
			    	}
			        break;
			        
			    case "Target":
			    	if(this._newStatus === "Identified") {
						// se va a avanzar de Target a Identified
						if (!this._oDialogTarget) {
							this._oDialogTarget = sap.ui.xmlfragment("QuickStartApplication.view.opportunity.advanceMABtarget", this);
						}
						var dataAux1 = {
						  "BuyingProcessChance": "",
						  "WinningChance": ""
						};
						var modelAux1 = new sap.ui.model.json.JSONModel(dataAux1);
						this._oDialogTarget.setModel(modelAux1);
						this._oDialogTarget.open();
			    	} else {
				    	// cualquier otro estado se actualiza
				    	data.Opportunitys[index].Status = this._newStatus;
						model.setData(data);
						model.refresh(true);
						
						this._destacaFila();
			    	}
			        break;
			    default:
			    	// cualquier otro estado se actualiza
			    	data.Opportunitys[index].Status = this._newStatus;
					model.setData(data);
					model.refresh(true);
					
					this._destacaFila();
					break;
			}
		},
		
		onSaveDialog : function() {
			var model = this.getView().getModel();
            var data = model.getData();
			data.Opportunitys[this._index].Status = this._newStatus;
            
			switch(this._currentStatus) {
			    case "Target":
	            	// se va a avanzar de Target a Identified
	            	var dataAux1 = this._oDialogTarget.getModel().getData();
					data.Opportunitys[this._index].BuyingProcessChance = dataAux1.BuyingProcessChance;
					data.Opportunitys[this._index].WinningChance = dataAux1.WinningChance.split(" - ")[0];
					data.Opportunitys[this._index].DemandType = dataAux1.WinningChance.split(" - ")[1];
					this._oDialogTarget.close();
					break;
            	case "Identified":
            		// se va a avanzar de Identified a Proposal in Progress
	            	var dataAux2 = this._oDialogIdentified.getModel().getData();
					data.Opportunitys[this._index].WinningChance = dataAux2.WinningChance.split(" - ")[0];
					data.Opportunitys[this._index].DemandType = dataAux2.WinningChance.split(" - ")[1];
					data.Opportunitys[this._index].MarginObjective = dataAux2.MarginObjective;
					data.Opportunitys[this._index].DecisionDate = dataAux2.DecisionDate;
					data.Opportunitys[this._index].TypeofService = dataAux2.TypeofService;
					data.Opportunitys[this._index].BeginingDate = dataAux2.BeginingDate;
					data.Opportunitys[this._index].EndingDate = dataAux2.EndingDate;
					this._oDialogIdentified.close();
					break;
				case "Waiting for Response":
	            	// se va a avanzar de Waiting for Response a Won
	            	var dataAux3 = this._oDialogWaiting.getModel().getData();
					data.Opportunitys[this._index].WinningDate = dataAux3.WinningDate;
					this._oDialogWaiting.close();
					break;
					
            }
			model.setData(data);
			model.refresh(true);
			
			this._destacaFila();
		},
		
		_destacaFila : function() {
			var tabla;
			switch(this._newStatus) {
			    case "Waiting for Response": 
			    	tabla = this.byId("tablaWaiting"); break;
			    case "Proposal in Progress":
			    	tabla = this.byId("tablaProposal"); break;
			    case "Identified":
			        tabla = this.byId("tablaIdentified"); break;
			    case "Target":
			        tabla = this.byId("tablaTarget"); break;
			    case "Delayed":
			        tabla = this.byId("tablaDelayed"); break;
			    default:
					break;
			}
			var _index = this._index;
			jQuery.each(tabla.getItems(), function (iNum, oItem) {
				var index = oItem.getBindingContext().getPath().split("/")[2];
				if(index === _index) {
					oItem.addStyleClass("animDestacaFila");
				} else {
					oItem.removeStyleClass("animDestacaFila");
				}
            });
			
		},
		
		onCancelDialog : function() {
			if(typeof this._oDialogTarget !== "undefined" ) { 
				this._oDialogTarget.close();
			}
			if(typeof this._oDialogIdentified !== "undefined" ) { 
				this._oDialogIdentified.close();
			}
			if(typeof this._oDialogWaiting !== "undefined" ) { 
				this._oDialogWaiting.close();
			}
		}
	});
});