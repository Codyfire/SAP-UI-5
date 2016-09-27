sap.ui.define(function() {
	"use strict";
 
	var Formatter = {
 
		weightState :  function (fValue) {
			try {
				fValue = parseFloat(fValue);
				if (fValue < 0) {
					return "None";
				} else if (fValue < 1000) {
					return "Success";
				} else if (fValue < 2000) {
					return "Warning";
				} else {
					return "Error";
				}
			} catch (err) {
				return "None";
			}
		},
		
		percent :  function(value) {
			var percentage = sap.ui.core.format.NumberFormat.getPercentInstance({
        		style: 'precent',
        		maxFractionDigits: 2
            });
            return percentage.format(value);
        }
	};
 
	return Formatter;
 
}, /* bExport= */ true);