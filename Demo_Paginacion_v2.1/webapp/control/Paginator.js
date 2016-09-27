sap.ui.define([
		'sap/ui/core/Control',
		"sap/m/Button",
		"sap/m/Text",
		"sap/m/MessageToast"
	],
	function(Control, Button, Text, MessageToast) {

	"use strict";

	return Control.extend("Demo_Paginacion.control.Paginator", {

		metadata : {
			properties : {
				table : { type : "sap.m.ListBase" },
				model : { type : "sap.ui.model.odata.ODataModel" },
				data : { type : "string" },
				size : { type : "int", defaultValue : 10 }
			},
			aggregations : {
				_buttonFirst : { type : "sap.m.Button", multiple : false, visibility: "public"},
				_button1 : { type : "sap.m.Button", multiple : false, visibility: "public"},
				_button2 : { type : "sap.m.Button", multiple : false, visibility: "public"},
				_button3 : { type : "sap.m.Button", multiple : false, visibility: "public"},
				_buttonLast : { type : "sap.m.Button", multiple : false, visibility: "public"}
			}
		},

		init : function() {
			var that = this;
			this.setAggregation("_buttonFirst", new Button({
				icon : "sap-icon://close-command-field",
				press : that.onFirst.bind(that),
				visible : true
			}));
			
			this.setAggregation("_button1", new Button({ 
				text : "1",
				press : that.onPageNumber.bind(that)
			}));
			this.setAggregation("_button2", new Button({ 
				text : "2",
				press : that.onPageNumber.bind(that)
			}));
			this.setAggregation("_button3", new Button({ 
				text : "3",
				press : that.onPageNumber.bind(that)
			}));
			
			this.setAggregation("_buttonLast", new Button({
				iconFirst : false,
				icon : "sap-icon://open-command-field",
				press : that.onLast.bind(that)
			}));
			
		},

		renderer : function(oRm, oControl) {
			var that = oControl;

			that._tablaProducts = oControl.getTable();
			that._oModel = oControl.getModel();
			that._sData = oControl.getData();
			
			that._btnFirst = oControl.getAggregation("_buttonFirst");
			that._btn1 = oControl.getAggregation("_button1");	// previous
			that._btn2 = oControl.getAggregation("_button2");	// page number
			that._btn3 = oControl.getAggregation("_button3");	// next
			that._btnLast = oControl.getAggregation("_buttonLast");
			
			that._top = oControl.getSize();
			that._skip = 0;
			
			that._oModel.read("/ProductSet/$count", {
				async : false,
				success: function (iCount) {
					that._drawNumericButtons(that._skip, that._top, iCount);
				},
				error: that._paginationError
			});
			
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");
			
			oRm.renderControl(oControl.getAggregation("_buttonFirst"));
			oRm.renderControl(oControl.getAggregation("_button1"));
			oRm.renderControl(oControl.getAggregation("_button2"));
			oRm.renderControl(oControl.getAggregation("_button3"));
			oRm.renderControl(oControl.getAggregation("_buttonLast"));

			oRm.write("</div>");
		},
		
/*		onPrevious : function(){
			this._skip = (this._skip < this._top) ? 0 : this._skip - this._top;
			this._paginate(this._skip, this._top);
		},
		
		onNext : function(){
			this._skip += this._top;
			this._paginate(this._skip, this._top);
		},*/
		
		onFirst : function() {
			this._skip = 0;
			this._paginate(this._skip, this._top);
		},
		
		onLast : function() {
			this._skip = (this._pagTotal - 1) * this._top;
			this._paginate(this._skip, this._top);
		},
		
		onPageNumber : function(oEvent) {
			var numPag = parseInt(oEvent.getSource().getText(), 10) - 1;
			this._paginate(numPag * this._top, this._top);
		},
		
		_drawNumericButtons : function(skip, top, total) {
			this._total = parseInt(total, 10);
			this._pagTotal = (this._total % top) === 0 ? Math.floor(this._total / top) : Math.floor(this._total / top) + 1;
			//console.log("_total: "+this._total+", _pagTotal: " + this._pagTotal);
			 
			if(top > total) {
				this._btn2.setVisible(false);
				this._btn3.setVisible(false);
				
			} else if((top * 2) > total) {
				this._btn3.setVisible(false);
			}
			this._paginate(skip, top);
		},
		
	
    	_paginate : function (skip, top) {
			var that = this;
			var numPag = skip >= top ? (Math.floor(skip / top) + 1) : 1;
			this._btn1.setType(sap.m.ButtonType.Default);
			this._btn2.setType(sap.m.ButtonType.Default);
			this._btn3.setType(sap.m.ButtonType.Default);
			this._btnFirst.setEnabled(true);
			this._btnLast.setEnabled(true);
			//console.log("skip "+skip+" + top "+top+", numPag: " + numPag);
			
			if(this._pagTotal === 1) {
					this._btn1.setType(sap.m.ButtonType.Emphasized);
					this._btn1.setText(numPag);
					this._btnFirst.setEnabled(false);
					this._btnLast.setEnabled(false);
				
			} else if(this._pagTotal === 2) {
				if(numPag === 1) {
					this._btn1.setType(sap.m.ButtonType.Emphasized);
					this._btn1.setText(numPag);
					this._btn2.setText(numPag + 1);
					this._btnFirst.setEnabled(false);
				
				} else if(numPag === 2) {
					this._btn1.setText(numPag - 1);
					this._btn2.setText(numPag);
					this._btn2.setType(sap.m.ButtonType.Emphasized);
					this._btnLast.setEnabled(false);
				} 
			} else {
				// entrara aqui siempre que tenga 3 paginas o mas
				if(numPag === 1) {
					this._btn1.setType(sap.m.ButtonType.Emphasized);
					this._btn1.setText(numPag);
					this._btn2.setText(numPag + 1);
					this._btn3.setText(numPag + 2);
					this._btnFirst.setEnabled(false);
				
				} else if(numPag > 1 && numPag < this._pagTotal) {
					this._btn1.setText(numPag - 1);
					this._btn2.setText(numPag);
					this._btn2.setType(sap.m.ButtonType.Emphasized);
					this._btn3.setText(numPag + 1);
					
				} else if(numPag === this._pagTotal) {
					this._btn1.setText(numPag - 2);
					this._btn2.setText(numPag - 1);
					this._btn3.setText(numPag);
					this._btn3.setType(sap.m.ButtonType.Emphasized);
					this._btnLast.setEnabled(false);
				}
			}
			
			var oUrlParams = "$skip=" + skip + "&$top=" + top;
			this._oModel.read(this._sData, {
				urlParameters : oUrlParams,
				success: function (oData) {
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData);
					that._tablaProducts.setModel(oModel);
				},
				error: this._paginationError
			});
			//var max = ((skip + top) > this._total) ? this._total : (skip + top);
			//this._txtPaginator.setText("Showing " + (skip + 1) + " - " + max + " of " + this._total);
			
			// muestro o oculto boton de previous o next
			//this._btnPrevious.setVisible(skip >= top);
			//this._btnNext.setVisible((skip + top) < this._total);
       },
		
		_paginationError : function(oError) {
			MessageToast.show("Pagination error");
		}
	});
	
	
});