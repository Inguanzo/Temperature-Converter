var whiteSkin = new Skin({fill:"white"});

var titleStyle = new Style({font:"bold 40px", color:"black"});
var resultStyle = new Style({font:"25px", color:"black"});

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0,
	skin: whiteSkin,
	contents:[
		new Label({left: 0, right: 0, top:20, height: 20, string: "Your IP:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"numLabel"}),
		new Label({left: 0, right: 0, height: 20, string: "Time:", style: titleStyle}),
		new Label({left: 0, right: 0, height: 40, string: "Loading...", style: resultStyle, name:"imageLabel"}),
		new Picture({left:10, right:0, height: 300,  url: "http://imgs.xkcd.com/comics/staceys_dad.jpg"}),
	]
});

Handler.bind("/getNum", {
	onInvoke: function(handler, message){ //.invoke then jumps to oncomplete
		handler.invoke(new Message("http://xkcd.com/61/info.0.json"), Message.JSON);
	},
	onComplete: function(handler, message, json){
		mainColumn.numLabel.string = json.num;
		trace("Num is: " + json.num + "\n");
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

Handler.bind("/getImg", {
	onInvoke: function(handler, message){
		handler.invoke(new Message("http://xkcd.com/61/info.0.json"), Message.JSON); //http path
	},
	onComplete: function(handler, message, json){
		mainColumn.imageLabel.string = json.img;
		trace("Image is: " + json.img + "\n"); //json.time (time) how json returns
	}
});


application.behavior = Object.create(Behavior.prototype, {	
	onLaunch: { value: function(application, data){
		application.add(mainColumn);
		application.invoke(new Message("/getNum"));
		application.invoke(new Message("/getImg"));
	}}
});
