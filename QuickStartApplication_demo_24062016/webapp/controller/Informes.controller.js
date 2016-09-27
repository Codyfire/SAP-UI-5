sap.ui.define([
    "QuickStartApplication/controller/BaseController",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/TablePersoController",
	"./TablePersoService",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem"
], function (BaseController, Filter, FilterOperator, TablePersoController, TablePersoService, Button, Dialog, List, StandardListItem) {
	"use strict";
	return BaseController.extend("QuickStartApplication.controller.Informes", {
		
		_bFirstPressFilter : false,

		onInit: function () {
			
			// 1. Creo combo con los servicios
			var oController = this;
			var comboServicios = new sap.m.ComboBox({
				width : "80%",
				items : [
					new sap.ui.core.ListItem({ key : "ES4|Product", text : "ES4/Product"}),
					new sap.ui.core.ListItem({ key : "ES4|BusinessPartner", text : "ES4/BusinessPartner"}),
					new sap.ui.core.ListItem({ key : "ES4|SalesOrder", text : "ES4/SalesOrder"}),
					new sap.ui.core.ListItem({ key : "ES4|Contact", text : "ES4/Contact"}),
					new sap.ui.core.ListItem({ key : "ONE_ERP_SRV|ZCA_T_REPORTS", text : "ONE_ERP_SRV/Reports"}),
					new sap.ui.core.ListItem({ key : "ONE_ERP_DEMO|ADRP", text : "ONE_ERP_DEMO/ADRP"}),
					new sap.ui.core.ListItem({ key : "ONE_ERP_DEMO|T005T", text : "ONE_ERP_DEMO/T005T"})
				],
				selectionChange : function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					oController.cargarVista(oSelectedItem);
				}
			});
			
			// 2. Creo el panel que contiene el combo
			this._oPanelServicios = new sap.m.Panel("panelServicios", {
                headerText: "Report Selection",
                backgroundDesign : "Solid",
				expandable : true,
				expanded : true,
                content: [comboServicios]  
            });
            // 3. Creo el layout que contendra el contenido dinamico (filtros y tabla)
            this._oLayout = new sap.ui.layout.VerticalLayout();
            
            // 4. Anyado panel y layout a la pagina
            var page = this.byId("pageInformes");
            page.addContent(this._oPanelServicios);
            page.addContent(this._oLayout);
	
		},
		
		cargarVista : function(oServicio) {
			var sOData = oServicio.getKey().split("|")[0];
			var sServicio = oServicio.getKey().split("|")[1];
			this._oPanelServicios.setExpanded(false);
			this._oLayout.destroyContent();
			this._bFirstPressFilter = false;
			var context = this;
			
			var model =	this.getOwnerComponent().getModel(sOData);
			var metaModel = model.getServiceMetadata();
			//var myEntityTypeDefinition = metaModel.getODataEntityType("/IWBEP/GWSAMPLE_BASIC.BusinessPartner");
			
			// Obtengo de los metadatos el objeto OData del informe
			var entityType;
			jQuery.each(metaModel.dataServices.schema[0].entityType, function () {
				if(this.name === sServicio) {
					entityType = this;
				}
			});
			
			// Obtengo los campos de entrada (filtros) y los de salida (columnas de la tabla de resultados)
			this._allFilters = [];
			this._allColumns = []; 
			this._sUrl = sOData+">/"+sServicio+"Set";
			jQuery.each(entityType.property, function () {
				context._allColumns.push(this.name);
				
				// Si alguna de las 'extensions' tiene filterable a false se devuelve
				var isFilter = true;
				if (this.extensions) {
		   			isFilter = jQuery.grep(this.extensions, function(e){
		   				return e.name === "filterable" && e.value === "false";
		   			}).length === 0;
				}
	   			
	   			if(isFilter){
	   				context._allFilters.push(this.name);
	   			}
	   			
			});
			debugger;
	   		
	   		// Establezco solo los 5 primeros campos como filtros
	   		var num = (this._allFilters.length > 5) ? 5 : this._allFilters.length;
	   		var entrada = [];
	   		var salida = [];
	   		for(var i=0; i<num; i++) {
	   			entrada.push(this._allFilters[i]);
	   			salida.push(this._allColumns[i]);
	   		}
			 
        	// B. Relleno arrays de columnas e items para la tabla
            this._cellsListItem = [];
        	var columnas = [];
            jQuery.each(this._allColumns, function (iNum, sColumn) {
                columnas.push(new sap.m.Column({
                	id : sColumn+"Col",
                    header : new sap.m.Label({
                        text : sColumn
                    })
                }));
                context._cellsListItem.push(new sap.m.Text({
                    text : "{"+sOData+">"+ sColumn +"}"
                }));
            });
			
			// 1 Contruccion de la tabla de resultados
			// 1.1 Creo el form para los filtros
			this._oFormFilter = new sap.ui.layout.form.SimpleForm({
				layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
				editable: true
			});
			// Pinto los filtros
			this._crearFiltros(entrada);
			
			
			// 1.2 Creo el boton de filtrado
            var oButtons = new sap.m.FlexBox({
            	alignItems : "Start",
				justifyContent : "End",
            	items : [
				new Button({
	            	text: "Clean",
	            	width : "80px",
	            	press: function() {
	            		jQuery.each(context._entrada, function(){
	            			this.filter.setValue("");
	            		});
	            	}
            	}).addStyleClass("sapUiTinyMarginBeginEnd"),
            		new Button({
	            	text: "Find",
	            	width : "80px",
	            	press: function() {
	            		context.onFilter();
	            	}
            	})]
            });

            
            // 1.3 Introduzco el form y el boton en un panel
			var panelFiltros = new sap.m.Panel({
            	headerToolbar : new sap.m.OverflowToolbar({
		            content : [ 
		            	new sap.m.Title({ text : oServicio.getText(), level : "H2" }), 
		            	new sap.m.ToolbarSpacer({}),
		            	new Button({
		                	icon : "sap-icon://action-settings", 
		                	press : function () {
		                		context.onFilterPerso();
		                	},
		                	layoutData : [
		                		new sap.m.OverflowToolbarLayoutData({ 
		                			priority : sap.m.OverflowToolbarPriority.NeverOverflow 
		                		})	
		                	]
		            	})
		            ]
		        }),
                backgroundDesign : "Solid",
				expandable : true,
				expanded : true,
                content: [this._oFormFilter, oButtons]  
            });

            // 2 Contruccion de la tabla de resultados
            // 2.1 Creo la tabla y le paso las columnas
            this._oTable = new sap.m.Table("tablaInformes", {
            	id : "tablaInformes",
		        headerToolbar : new sap.m.OverflowToolbar({
		            content : [ 
		            	new sap.m.Title({ text : "Results", level : "H2" }), 
		            	new sap.m.ToolbarSpacer({}),
		            	new sap.m.CheckBox({
		            		text : "Enable Personalization Grouping", 
		            		select : function () { 
		            			context.onTableGrouping(); 
		            		}}),
		            	new Button({
		                	icon : "sap-icon://action-settings", 
		                	press : function () {
		                		context.onPersoButtonPressed();
		                	},
		                	layoutData : [
		                		new sap.m.OverflowToolbarLayoutData({ 
		                			priority : sap.m.OverflowToolbarPriority.NeverOverflow 
		                		})	
		                	]
		            	})
		            ]
		        }),
		        noDataText : "No data",
                columns : columnas
            });
            
            // 2.2 Le paso a la tabla el binding del servicio oData y los items
            //this._oTable.bindItems(url, new sap.m.ColumnListItem({
            //    cells : this._cellsListItem
            //}));
			
			// 3. Anyado panel y tabla al layout
        	this._oLayout.addContent(panelFiltros);
        	this._oLayout.addContent(this._oTable);
        
            // 4. creo el Dialog de personalizacion de la tabla
            //TablePersoService.loadDataService(sServicio, this._allColumns, salida);
            var configColumns = [];
			jQuery.each(this._allColumns, function (iNum, sColumn) {
		        configColumns.push({ 
					id: "persoTable-tablaInformes-"+sColumn+"Col",
					order: iNum,
					text: sColumn,
					visible: (salida.indexOf(sColumn) !== -1)
		        });
			});
            TablePersoService.oData.aColumns = configColumns;                                                
            
			this._oTPC = new TablePersoController({
				table: this._oTable,
				//specify the first part of persistence ids e.g. 'persoTable-tablaInformes-Name'
				componentName: "persoTable",
				persoService: TablePersoService
			}).activate();
		},
		
		_crearFiltros : function(cFilters) {
			this._oFormFilter.destroyContent();
			var context = this;
			
			// Personalizacion de los datos para el informe
			this._entrada = [];
			var length = cFilters.length;
			var mitad = (length % 2 === 0) ? Math.floor(length/2) : Math.floor(length/2) + 1;
			
			// A. Relleno array con los label e inputs de los filtros
			this._oFormFilter.addContent(new sap.ui.core.Title());
			jQuery.each(cFilters, function (iNum, sField) {
				if(iNum === mitad && length > 3) {
					context._oFormFilter.addContent(new sap.ui.core.Title());
				}
				var input = new sap.m.Input({ width : "90%" });
				context._entrada.push({ key : sField, filter : input });
				
				context._oFormFilter.addContent(new sap.m.Label({ text: sField }));
                context._oFormFilter.addContent(input);
            });
		},
		
/*		_servicioOpen : function(sServicio) {
			for(var i=0; i<this._servOpen.length; i++) {
				if(this._servOpen[i].serv === sServicio) {
					return true;
				}
			}
			return false;
		},
*/		
		onFilter : function () {
			
			if(!this._bFirstPressFilter) {
				this._oTable.bindItems(this._sUrl, new sap.m.ColumnListItem({
	                cells : this._cellsListItem
	            }));
	            this._bFirstPressFilter = true;
			}
			
			// build filter array
			var aFilter = [];
			jQuery.each(this._entrada, function (iNum, oField) {
				if(jQuery.trim(oField.filter.getValue()) !== "") {
				    aFilter.push(new Filter(oField.key, FilterOperator.Contains, oField.filter.getValue()));
				}
            });
            
			// get binding for aggregation 'items'
			var oBinding = this._oTable.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onPersoButtonPressed: function () {
			this._oTPC.openDialog();
		},
 
		onTablePersoRefresh : function() {
			//TablePersoService.resetPersData();
			this._oTPC.refresh();
		},
 
		onTableGrouping : function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},
		
		// Crea dialogo para la personalizacion de los filtros de busqueda
		onFilterPerso: function () {
			
			if(!this._dialog){
				var items = [];
				var itemsSelect = [];
				jQuery.each(this._entrada, function(){
					itemsSelect.push(this.key);
				});
				
				for(var i=0;i<this._allFilters.length;i++){
					items.push(new StandardListItem({
						title: this._allFilters[i],
						selected : (itemsSelect.indexOf(this._allFilters[i]) !== -1)
					}));
				}
				this._filtersList = new List({
					mode: "MultiSelect",
					items: items
				});
				
				var context = this;
				this._dialog = new Dialog({
					title: "Select Filters",
					content: this._filtersList,
					beginButton: new Button({
						text: "OK",
						press: function () {
							var filters = [];
							jQuery.each(context._filtersList.getSelectedItems(), function(){
								filters.push(this.getTitle());
							});
							context._crearFiltros(filters);
							context._dialog.close();
						}
					}),
					endButton: new Button({
						text: "Close",
						press: function () {
							context._dialog.close();
						}
					})
				});
	 
				//to get access to the global model
				this.getView().addDependent(this._dialog);
			}
			this._dialog.open();
		}

	});
});