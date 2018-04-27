//Written By: Rakesh Yadav
//Created on: March 23rd, 2018


var API_KEY="AIzaSyDHv8CK-HQD7j9tf7AMfkAtDYNqOKF7s4U";


window.onload = function() {


document.getElementById("hide-btn").style.display = "none";

var api;
var tab;






function create_search_api(){
	var search_query=document.getElementById('query').value;
	api="https://www.googleapis.com/youtube/v3/search?q="+search_query+"&part=snippet&key="+API_KEY+"&maxResults=17";
	// fn. to get api data and create html anchor tags
	get_api_data();
}





//get tabs containinf utube url
chrome.tabs.query({ "url": "https://www.youtube.com/*" }, function (tabs) {

	// if no utube url, return
	if(tabs.length==0)
		return;

	tab=tabs[0];

	document.getElementById("hide-btn").style.display = "block";

	document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z");
	

	//get 1st utube url
	var url=tabs[0].url;
		
	  //if (url.includes("campaign") && (url.includes("www.youtube.com"))){
	  if (url.includes("www.youtube.com")){  

	     // if already playing vds, find related vidoes else find popular vds
	     if( url.includes("watch?v=")){ 
		//get video Id by splitting url
		var vidoeId= url.split("=")[1].split("&")[0];
		
		api="https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId="+vidoeId+"&type=video&key="+API_KEY+"&maxResults=17";
	      }

	      // find most popular vds
	      else
		api="https://www.googleapis.com/youtube/v3/search?part=snippet&chart=mostPopular&key="+API_KEY+"&maxResults=17";

		// cal fn, once "api" is ready
		get_api_data();

        } // if end

	//tabs.forEach(function(tab){
		//alert("tab :"+tab.url);


// next btn title
	chrome.tabs.executeScript(tab.id, {
            		code: ` var attr_value = new Array();
				attr_value.push(document.getElementsByClassName("ytp-next-button ytp-button")[0].getAttribute("data-tooltip-text"));
				attr_value.push(document.getElementsByClassName("ytp-play-button ytp-button")[0].getAttribute("aria-label")); // pause / play status in the begining
				attr_value.push(document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[4].innerHTML);
				attr_value;
				`
	},function (attr_value) { // Execute your code
			document.getElementsByClassName("ytp-next-button ytp-button")[0].setAttribute("title", attr_value[0][0]);
			if(attr_value[0][1] == "Play"){
				document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z");
			}else{
				document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z");
			}
			document.getElementsByClassName("ytp-play-button ytp-button")[0].setAttribute("title", attr_value[0][2]);

	}); // end of chrome executescript for next btn title and play/pause btn attribute



});  // tabs query end







// fm definition to call jQuery $.get(url) fn.
	function get_api_data(callback){
	
	    // don't call if api is null
	    if(api!=null)
		$.get(api, function(data) {

			var video_list="";
			var i=0;
			//iterate over each items or vidoes
			data.items.forEach(function(vd) {
			   video_id=vd.id.videoId;
			   title=vd.snippet.title;
			   img_url=vd.snippet.thumbnails.medium.url;

			   //description=vd.snippet.description;
			   channelTitle=vd.snippet.channelTitle;

			   // create a html element for each vds, Note +=
			   video_list+=' 	\
			   <!-- <a id="thumbnail"  href="https://www.youtube.com/watch?v='+video_id+'" onclick="javascript:openWindow(this.href);return false;" > --> \
			    <div class="panel panel-default"> \
				<div class="panel-body">\
				  <div class="row">\
					<div class="col-md-8">\
					  <div class="stats">\
							<div class="media">\
							 <a name="thumbnail'+video_id+'"  href="https://www.youtube.com/watch?v='+video_id+'">  \
							  <img class="mr-3" src="'+img_url+'" alt="Generic placeholder image">\
								<h5 class="mt-0">'+title+'</h5>\
								</a> '+channelTitle+'\
							</div>\
					  </div>\
					</div>\
				  </div>\
				</div>\
			  </div>	\ '
			});  // end of forEach loop

				//video_list+='<h2>Results:</h2>'+video_list;
			//assigning the created elements to innerHTML
			document.getElementById("demo").innerHTML =video_list;
	
		//end of get
		}).then(function() {
			
			var a = document.anchors;
			//console.log(document.anchors.length);
			var i;
			for (i = 0; i < a.length; i++) {
				a[i].addEventListener("click", function() {
				if(tab!=null){
					chrome.tabs.executeScript(tab.id,{
            					code: "window.location.assign('"+this.href+"');"
       					});
				} 
				else{
					chrome.tabs.create({url: this.href}); 
		            		return(false);
				}  // end of else
	        		}); //end of event listener

			} // end of for
		});  // end of then fn.

	

	} // end of get_api_data

	// call create_search_api fn on button click
	document.getElementById('srch_btn').onclick = create_search_api;

	// link input text field with "Enter" button
	document.getElementById("query")
		.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			document.getElementById("srch_btn").click();
		}
	});  // end of linking Enter btn

  // calling on window load
  get_api_data();









	// pause/play vds
	document.getElementById("play-btn").onclick = function(){
    		chrome.tabs.executeScript(tab.id, {
            		code: ` var attr_value = document.getElementsByClassName("ytp-play-button ytp-button")[0].getAttribute("aria-label"); // pause / play status in the begining
				document.getElementsByClassName("ytp-play-button ytp-button")[0].click(); // pause/play vds
				attr_value;  // return "Play or Pause statue in the begining
				`
       		},function (attr_value) { // Execute your code
			if(attr_value[0] == "Pause"){
				//document.getElementById("play-btn").innerHTML="Play";
				document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z");
			}
			else{
				//document.getElementById("play-btn").innerHTML="Pause";
				document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z");
			}
        	});
	}


	// Next vd
	document.getElementById("next-btn").onclick = function(){
    		chrome.tabs.executeScript(tab.id, {
            		code: ` var attr_value=document.getElementsByClassName("ytp-next-button ytp-button")[0].getAttribute("data-tooltip-text");
				document.getElementsByClassName("ytp-next-button ytp-button")[0].click(); // next vd
				attr_value;
				`
       		},function (attr_value) { // Execute your code
			if(attr_value[0] != null){
				//document.getElementById("next-btn").innerHTML="Play";
				//document.getElementsByClassName("ytp-next-button ytp-button")[0].setAttribute("title", attr_value[0]);
			}
			else{
				console.log("Null");
				//document.getElementsByClassName("ytp-svg-fill")[0].setAttribute("d", "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z");
			}
        	});
	}






	//document.anchors.addEventListener("click", handler);
	
	function handler() {
 		//var link = document.getElementById('thumbnail');
		// onClick's logic below:
		
		console.log("erdf");
	}	


}  //window load end

//window.onclick = function(e) { alert(e.target);};

