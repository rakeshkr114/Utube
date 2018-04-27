



var API_KEY="AIzaSyDHv8CK-HQD7j9tf7AMfkAtDYNqOKF7s4U";

window.onload = function() {



	function newwin(url) {
		alert(url);
 		myWindow=window.open(url);
	}

	//function create_tab(var goto_url){
	//	alert(goto_url);
	//	chrome.tabs.create({
        //	url: goto_url
	//	});
	//} // end of create_tab

		
	function get_list(){
	var search_query=document.getElementById('query').value;
	//console.log(search_query);

	//console.log("fn called");
	$.get("https://www.googleapis.com/youtube/v3/search?q="+search_query+"&part=snippet&key="+API_KEY, function(data) {

			var video_list="";
			var i=0;
			data.items.forEach(function(vd) {
			   video_id=vd.id.videoId;
			   title=vd.snippet.title;
			   img_url=vd.snippet.thumbnails.medium.url;
			   //description=vd.snippet.description;
			   channelTitle=vd.snippet.channelTitle;
			   video_list+=' 	<center>\
			   <!-- <a id="thumbnail"  href="https://www.youtube.com/watch?v='+video_id+'" onclick="javascript:openWindow(this.href);return false;" > --> \
			    <div class="panel panel-default"> \
				<div class="panel-body">\
				  <div class="row">\
					<div class="col-md-8">\
					  <div class="stats">\
							<div class="media">\
							 <a id="thumbnail"  href="https://www.youtube.com/watch?v='+video_id+'" >  \
							  <img class="mr-3" src="'+img_url+'" alt="Generic placeholder image">\
								<h5 class="mt-0">'+title+'</h5>\
								</a> '+channelTitle+'\
							</div>\
					  </div>\
					</div>\
				  </div>\
				</div>\
			  </div>	</center>\ '
			});  // end of forEach loop

				//video_list+='<h2>Results:</h2>'+video_list;
			document.getElementById("demo").innerHTML =video_list;
	}).then(function() {    // end of get  AND call following fn, after get fn.
		//alert("1st success");
    		//$('a').each(function (index, value){
			//console.log('href');
 	 		//console.log($(this).attr('href'));
			//chrome.tabs.create({
        		//	url: $(this).attr('href')
			//});
		//});
		$('[id^=thumbnail]').each(function() {
    			console.log(this.href);
			//newwin(this.href);
		});

	});   //end of later fn


	//document.getElementsByTagName("html")[0].style.width="400px";

	}  // end of get_list

	document.getElementById('srch_btn').onclick = get_list;
	//document.getElementById('thumbnail').onclick = newwin(this.href);


	document.getElementById("query")
		.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			document.getElementById("srch_btn").click();
		}
	});  // end of linking Enter btn

}