
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    imageElem = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=%data%">';

    var $street = $('#street').val();
    var $city = $('#city').val();
    var $address = $street+', '+$city;
    $greeting.text('So, you want to live at '+ $address + '?');
    
    var formattedImgElem = imageElem.replace("%data%",$address);
    $body.append(formattedImgElem);
    //console.log(formattedImgElem);
    // YOUR CODE GOES HERE!

    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var nytapikey = "7eaac48c125b474f8024fe98da4b46a2"
    var url = nyturl + '?' + $.param({ 'api-key':nytapikey , 'q':$address });
    var $link;
    var $linkdata;
    var $para;

    //console.log(url);
    $nytHeaderElem.text("New York Times Articles About : "+ $address);
    
    $.getJSON(url , function( data ) {
          var articles = data.response.docs;

          $.each( articles, function( i,val) {
            $link = val.web_url;
            $linkdata = val.headline.main;
            $para = val.snippet;
            var $nytElemItem = '<li class="article">\
                                <a target ="_blank" href="'+$link+ '">' +$linkdata+ '</a>'+'<p>'+ $para +'</p>'+'</li>';
            $nytElem.append($nytElemItem);
          });          
          
    }).done(function() {
        console.log( "second success" );
      }).fail(function() {
        $nytHeaderElem.text("New York Times Articles About Could Not Be Loaded");
        console.log( "error" );
      }).always(function() {
        console.log( "complete" );
      });    

    
    var wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+$address + '&format=json&callback=wikiCallback';
        //? action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json";
    //console.log(wikiurl);
    var $wikilink;
    var $wikilinkdata;
    //Adding a Timer and executing an annonymous fallback function to set the failed wiki text element 
    //if the response is not received
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources");
    },8000);
        

    $.ajax({
      url: wikiurl,
      dataType: "jsonp",      
      //jsonp : 
      //jsonpCallback :
      success: function(response){
                //console.log(response);
                var addresswikilist = response[1];
                
                for (var i=0;i<addresswikilist.length;i++)    {
                    $wikilinkdata = addresswikilist[i];
                    $wikilink  = 'http://en.wikipedia.org/wiki/'+ $wikilinkdata ;
                    var $wikiElemItem = '<li><a target ="_blank" href="'+$wikilink+ '">' +$wikilinkdata+ '</a>'+'</li>';
                    $wikiElem.append($wikiElemItem);  

                }
                //clearing the timer once wiki responce is received and element is added in the section
                clearTimeout(wikiRequestTimeout);
            }
    }).done(function(response) {
    console.log( "wiki second success" )
    });

    return false;
};

$('#form-container').submit(loadData);
