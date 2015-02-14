/*
Features and Settings
*/
var THEME = require('themes/flat/theme');
var whiteSkin = new Skin({fill:"white"});
var titleStyle = new Style({font:"bold 40px", color:"black"});
var resultStyle = new Style({font:"25px", color:"black"});
var SCROLLER = require('mobile/scroller');
var BUTTONS = require('controls/buttons');
var comicNumber = 1;
var xImage = "";

var scroller = SCROLLER.VerticalScroller.template(function($){ return{
    contents: $.contents,
    name: $.name
}});

var bigText = new Style({font:"bold 55px", color:"#333333"});

var buttonBehavior = function(content, data){
	BUTTONS.ButtonBehavior.call(this, content, data);
}
buttonBehavior.prototype = Object.create(BUTTONS.ButtonBehavior.prototype, {
	onTap: { value:  function(button){
		comicNumber += 1;
		trace("Button was tapped.\n");
		trace("comic number has increased to: " + comicNumber + "\n");
		xUrl = "http://xkcd.com/" + comicNumber + "/info.0.json";
		application.invoke(new Message("/getTitle"));
		application.invoke(new Message("/getImage"));
		
	}}
});

var myButtonTemplate = BUTTONS.Button.template(function($){ return{
	top:50, bottom:50, left:50, right:50,
	contents:[
		new Label({left:0, right:0, height:50, string:$.textForLabel, style:bigText})
	],
	behavior: new buttonBehavior
}});

var button = new myButtonTemplate({textForLabel:"Click Me!"});




/*
FLICKR
*/
var serviceURL = "https://api.flickr.com/services/feeds/photos_public.gne?";
	var tags = "happiness";
	var url = serviceURL + serializeQuery({
		format: "json",
		nojsoncallback: 1,
		tags: tags});
var myPic = "";
var SCROLLER = require('mobile/scroller');

/*
XKCD
*/


Handler.bind("/getNum", {
	
	onInvoke: function(handler, message){ //.invoke then jumps to oncomplete
		handler.invoke(new Message( url ), Message.TEXT);
	},
	onComplete: function(handler, message, json){ 
		json = json.split('"media"');
		json = json[1];
		json = json.split(':"');
		json = json[1];
		json = json.split('"');
		json = json[0];
		
		//json = json.replace( "_m.jpg", "_b.jpg" );
		trace("Num is: " + json + "\n");
	
		myPic =	new Picture({left:10, right:0, height: 200,  url: json}),
		//mainColumn.add(myPic);
		
	}
});

var xImage = "";
var xUrl = "http://xkcd.com/1/info.0.json";

Handler.bind("/getTitle", {
	onInvoke: function(handler, message){
		handler.invoke(new Message(xUrl), Message.JSON); //http path
		trace("commic num: " + comicNumber + "\n");
	},
	onComplete: function(handler, message, json){
		//mainColumn.titleLabel.string = json.safe_title;
		trace("Title is: " + json.safe_title + "\n"); //json.time (time) how json returns
	}
});

Handler.bind("/getImage", {
	onInvoke: function(handler, message){
		handler.invoke(new Message(xUrl), Message.JSON); //http path
	},
	onComplete: function(handler, message, json){
		//mainColumn.titleLabel.string = json.safe_title;
		trace("Image String is: " + json.img + "\n"); //json.time (time) how json returns
		xkImg.url = json.img;
	}
});



/*
Main
*/
var xkImg;
var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	contents:[
		new scroller({ name: "comicScroller", left: 0, right: 0, 
	contents:[
		/*new Label({left: 0, right: 0, top:20, height: 20, string: "Your IP:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"numLabel"}),
		new Label({left: 0, right: 0, height: 20, string: "Time:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"imageLabel"}),*/
		xkImg = new Picture({left:10, right:0, height: 200,  url: "http://imgs.xkcd.com/comics/barrel_cropped_(1).jpg"}),
	]
	}), ]
});





application.behavior = Object.create(Behavior.prototype, {	
	onLaunch: { value: function(application, data){
		application.add(mainColumn);
		application.invoke(new Message("/getNum"));
		application.invoke(new Message("/getTitle"));
		application.invoke(new Message("/getImage"));
		mainColumn.add(button);

	}}
});
