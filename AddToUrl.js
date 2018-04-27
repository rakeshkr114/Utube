//Written By: Rakesh Yadav
//Created on: July 23rd, 2017

$(()=>{
      var currentURL = window.location.href;
//console.log("content");
      $.ajax(currentURL,
      {
         statusCode: {
         403: ()=> {
            if (!currentURL.includes("?campaign")){
                                var newURL = currentURL.concat("?campaign");
                                window.location.assign(newURL);
            }
         }
      }
   });   
});
                
