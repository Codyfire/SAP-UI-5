sap.ui.define([
		"sap/m/ComboBox"
	],
	function(ComboBox) {
	"use strict";

	return ComboBox.extend("Demo_ComboColumnas.control.ComboColumns", {

		metadata : {
                associations: {
                     grid : { type : "sap.ui.layout.Grid", multiple : false, singularName: "grid" }
                } 
		},
		
      renderer: {
          // note that NO render() function is given here! The TextField's render() function is used. 
          // But one function is overwritten:
      }

	});
	
});