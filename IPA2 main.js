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
var biggest = "";
var scroller = SCROLLER.VerticalScroller.template(function($){ return{
    contents: $.contents,
    name: $.name
}});

var bigText = new Style({font:"bold 25px", color:"#333333"});

var buttonBehavior = function(content, data){
	BUTTONS.ButtonBehavior.call(this, content, data);
}
buttonBehavior.prototype = Object.create(BUTTONS.ButtonBehavior.prototype, {
	onTap: { value:  function(button){
		comicNumber += 1;
		xUrl = "http://xkcd.com/" + comicNumber + "/info.0.json";
		application.invoke(new Message("/getTitle"));		
		application.invoke(new Message("/getImage"));
		mainColumn.remove(myPic);	
		
		
	}}
});

var myButtonTemplate = BUTTONS.Button.template(function($){ return{
	bottom:20, left:200, right:30,
	contents:[
		new Label({left:0, right:0, height:30, string:$.textForLabel, style:bigText})
	],
	behavior: new buttonBehavior
}});

var button = new myButtonTemplate({textForLabel:"Next"});

var comicTitle = "";
//var header = new Label({height: 40, string: "", style: resultStyle}),


var serviceURL = "https://api.flickr.com/services/feeds/photos_public.gne?";

//var tags = "pizza";
function flickrUrl() {
    var url = serviceURL + serializeQuery({
		format: "json",
		nojsoncallback: 1,
		tags: tags});
	return url;
	}
var myPic = "";
var SCROLLER = require('mobile/scroller');

/*
FLICKR
*/

Handler.bind("/getNum", {
	
	onInvoke: function(handler, message){ //.invoke then jumps to oncomplete
		handler.invoke(new Message(flickrUrl()), Message.TEXT);
	},
	onComplete: function(handler, message, json){ 
		trace("biggest word is : " + biggest + "\n"); //json.time (time) how json returns
		trace("json is: " + json + "\n");
		myJson = json.split('"media"');
		myJson = myJson[1];
		myJson = myJson.split(':"');
		myJson = myJson[1];
		myJson = myJson.split('"');
		myJson = myJson[0];
		
		//json = json.replace( "_m.jpg", "_b.jpg" );
		trace("flikr url is: " + myJson + "\n");
		myPic =	new Picture({left:10, right:0, height: 200,  url: myJson}),
		mainColumn.add(myPic);
		
	}
});

/*
XKCD
*/


var xImage = "";
var xUrl = "http://xkcd.com/1/info.0.json";
var splitTags = "";
Handler.bind("/getTitle", {
	onInvoke: function(handler, message){
		handler.invoke(new Message(xUrl), Message.JSON); //http path
	},
	onComplete: function(handler, message, json){
		//mainColumn.titleLabel.string = json.safe_title;
		var myTitle = json.safe_title;
		header.string = myTitle;
		splitTags = myTitle.split(' ');		
		
		biggest = "";
		for(var i = 0; i < splitTags.length; i++){
			if(biggest < splitTags[i].length){
				biggest = splitTags[i];
			}
		}
		tags = biggest;
		application.invoke(new Message("/getNum"));
		
	}
});

Handler.bind("/getImage", {
	onInvoke: function(handler, message){
		handler.invoke(new Message(xUrl), Message.JSON); //http path
	},
	onComplete: function(handler, message, json){
		//mainColumn.titleLabel.string = json.safe_title;
		xkImg.url = json.img;
	}
});



/*
Main
*/
var xkImg;
var flickrImg;
var header;
var myPic;
var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	//contents:[
		//new scroller({ name: "comicScroller", left: 0, right: 0, 
	contents:[
		xkImg = new Picture({left:10, right:0, height: 200,  url: ""}),
		header = new Label({top:20, height: 40, string: "loading...", style: resultStyle}),	
		//flickrImg = new Picture({left:10, right:0, height: 200,  url: ""}),
		
	//]
	//}), ]
	]
});





application.behavior = Object.create(Behavior.prototype, {	
	onLaunch: { value: function(application, data){
		application.invoke(new Message("/getTitle"));
		application.invoke(new Message("/getImage"));
		mainColumn.add(button);
		application.add(mainColumn);
		

	}}
});
