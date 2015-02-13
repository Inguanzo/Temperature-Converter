var whiteSkin = new Skin({fill:"white"});

var titleStyle = new Style({font:"bold 40px", color:"black"});
var resultStyle = new Style({font:"25px", color:"black"});
//var myData = JSON.parse("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1c3e423fa49c61f7a76964f5f667da97&user_id=pizza&per_page=1&format=json&nojsoncallback=1");

var serviceURL = "https://api.flickr.com/services/feeds/photos_public.gne?";
	var tags = "happiness";
	var url = serviceURL + serializeQuery({
		format: "json",
		nojsoncallback: 1,
		tags: tags});
var myPic = "";

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	contents:[
		//new Label({left: 0, right: 0, top:20, height: 20, string: "Your IP:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"numLabel"}),
		new Label({left: 0, right: 0, height: 20, string: "Time:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"imageLabel"}),
		new Picture({left:10, right:0, height: 200,  url: "http://imgs.xkcd.com/comics/staceys_dad.jpg"}),
	]
});

Handler.bind("/getNum", {
	
	onInvoke: function(handler, message){ //.invoke then jumps to oncomplete
		handler.invoke(new Message( url ), Message.TEXT);
	},
	onComplete: function(handler, message, json){ 
		//var temp = JSON.parse(json);
		//mainColumn.numLabel.string = json.photo;
		json = json.split('"media"');
		json = json[1];
		json = json.split(':"');
		json = json[1];
		json = json.split('"');
		json = json[0];
		
		//json = json.replace( "_m.jpg", "_b.jpg" );
		trace("Num is: " + json + "\n");
	
		myPic =	new Picture({left:10, right:0, height: 200,  url: json}),
		mainColumn.add(myPic);
		
	}
});




/*Handler.bind("/getTitle", {
	onInvoke: function(handler, message){
		handler.invoke(new Message("http://xkcd.com/61/info.0.json"), Message.JSON); //http path
	},
	onComplete: function(handler, message, json){
		mainColumn.titleLabel.string = json.safe_title;
		trace("Title is: " + json.safe_title + "\n"); //json.time (time) how json returns
	}
});*/




application.behavior = Object.create(Behavior.prototype, {	
	onLaunch: { value: function(application, data){
		application.add(mainColumn);
		application.invoke(new Message("/getNum"));
	}}
});
