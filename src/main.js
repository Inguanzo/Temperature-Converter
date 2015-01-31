var THEME = require('themes/flat/theme');
var SLIDERS = require('controls/sliders');
var tempVal = "";
var convertedVal = "";
var BUTTONS = require('controls/buttons');
var startMeasurementVal = "";
var endMeasurementVal = "";
var started = "False"
var lastSelected = ""


//skins and styles
var whiteS = new Skin({fill:"white"});
var lightBlueS = new Skin({fill:"#89CFF0"});
var labelStyle = new Style( { font: "bold 40px", color:"#E52B50" } );

var labelFromStyle = new Style( { font: "bold 40px", color:"gray" } );
var labelToStyle = new Style( { font: "bold 40px", color:"#3B444B" } );

var smallLabelStyle = new Style( { font: "bold 20px", color:"#E52B50" } );

var bigText = new Style({font:"bold 20px", color:"#333333"});

//constant labels
var myFromLabel = new Label({left:0, right:250, height: 20, top: 10, string: "From:", style: smallLabelStyle})
var myToLabel = new Label({left:0, right:250, height: 20, bottom: 160, string: "To:", style: smallLabelStyle})


//slider info
var myLabel = new Label({left:0, right:0, height: 20, top: 30, string: "start", style: labelStyle})
var myConvertedLabel = new Label({left:0, right:0, height: 20, bottom: 130, string: "", style: labelStyle})

var mySlider = SLIDERS.HorizontalSlider.template(function($){ return{
	height:50, left:50, right:50,
	behavior: Object.create(SLIDERS.HorizontalSliderBehavior.prototype, {
		onValueChanged: { value: function(container){
			SLIDERS.HorizontalSliderBehavior.prototype.onValueChanged.call(this, container);
			if(started == "False"){
				myLabel.style = smallLabelStyle;
				myLabel.string = "Select Value";
			} else {
				myLabel.style = labelStyle;
				myLabel.string = tempVal;		
			}
			started = "True";
			tempVal = Math.round(this.data.value);
			
			fromOneToOther();
					
	}}})
}});


//conversion Function
function convertFunction(measure) {
	convertedVal = tempVal;
	myConvertedLabel.string = measure;
};


///from Fahrenheit,Celsius,Kelvin to all
function fromOneToOther(){
			if (startMeasurementVal == "Fahrenheit") {
				if (endMeasurementVal == "Fahrenheit") {
					convertedVal = Math.round(tempVal);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Celsius") {
					convertedVal = Math.round((tempVal - 32)/1.8);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Kelvin") {
					convertedVal = Math.round((((tempVal - 32) * 5)/9) + 273.15);
					convertFunction(convertedVal);
				}
			}		
			
			//from Celsius to all
			if (startMeasurementVal == "Celsius") {
				if (endMeasurementVal == "Fahrenheit") {
					convertedVal = Math.round((tempVal*1.8)+32);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Celsius") {
					convertedVal = Math.round(tempVal);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Kelvin") {
					convertedVal = Math.round(tempVal + 273.15);
					convertFunction(convertedVal);
				}
			}
			
			//from Kelvin to all
			if (startMeasurementVal == "Kelvin") {
				if (endMeasurementVal == "Fahrenheit") {
					convertedVal = Math.round(((tempVal - 273.15) * 1.8) + 32);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Celsius") {
					convertedVal = Math.round(tempVal - 273.15);
					convertFunction(convertedVal);
				}
				else if (endMeasurementVal == "Kelvin") {
					convertedVal = Math.round(tempVal);
					convertFunction(convertedVal);
				}
			}
};


//measurement
var myStartMeasurement = BUTTONS.RadioGroup.template(function($){ return{
	top:60, left:50, right:50,
	behavior: Object.create(BUTTONS.RadioGroupBehavior.prototype, {
		onRadioButtonSelected: { value: function(buttonName){
			startMeasurementVal = buttonName;
			if(lastSelected == "bottom") {
				myLabel.style = smallLabelStyle;
				myLabel.string = "Select Value";
				myConvertedLabel.string = "";
				lastSelected = "top";
			}
	}}})
}});


var myEndMeasurement = BUTTONS.RadioGroup.template(function($){ return{
	bottom:30, left:50, right:50,
	behavior: Object.create(BUTTONS.RadioGroupBehavior.prototype, {
		onRadioButtonSelected: { value: function(buttonName){
			endMeasurementVal = buttonName;
			if(tempVal != "" && startMeasurementVal !=  "" && endMeasurementVal != ""){
			fromOneToOther();	
			lastSelected = "bottom"
			if(myLabel.string == "Select Value") {
				myConvertedLabel.string = "";
			}			
		}
	}}})
}});


// calls
var slider = new mySlider({ min:-50, max:115, value:33,  });
var startMeasurement = new myStartMeasurement({ buttonNames: "Fahrenheit,Celsius,Kelvin" });
var endMeasurement = new myEndMeasurement({ buttonNames: "Fahrenheit,Celsius,Kelvin" });


//main
var redS = new Skin({fill:"#F4C2C2"});
var blueS = new Skin({fill:"#D19FE8"});
var whiteSS = new Skin({
	fill:"89CFF0", 
	borders:{left:0, right:0, top:15, bottom:15}, 
	stroke:"gray"
});
var mainCon = new Container({left:0, right:0, top:0, bottom:0, skin: lightBlueS});
var col = new Column({
	left:0, right:0, top:0, bottom:0,
	contents:[
		new Line({left:0, right:0, top:0, bottom:0,height: 80, skin: redS}),
		new Line({left:0, right:0, top:0, bottom:0, skin: whiteSS,
			contents:[
				new Content({left:0, right:0, top:0, bottom:0, skin: whiteSS}),
			]
		}),
		new Line({left:0, right:0, top:0, bottom:0, height: 80, skin: blueS})
	]
});
	 
application.add(mainCon);
mainCon.add(col);
mainCon.add(myLabel);
mainCon.add(myFromLabel);
mainCon.add(myToLabel);
mainCon.add(myConvertedLabel);
mainCon.add(startMeasurement);
mainCon.add(endMeasurement);
mainCon.add(slider);