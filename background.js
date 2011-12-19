function handleSelection(words)
{
	//alert(words);
	new_words = [];
	
	console.log("<newspeak> following words were discovered : " + words);
	
	for(var i = 0; i < words.length; ++i)
	{
		var word = words[i].toLowerCase();
		
		console.log("<newspeak> Testing for word " + word);
		
		var node = root;
		var j; 
		
		try{
			//explore trie to find conversion
			for(j = 0; j < word.length; ++j)
			{
				var index;
				
				if(word.charCodeAt(j) >= "a".charCodeAt(0) && word.charCodeAt(j) <= "z".charCodeAt(0))
					index = word.charCodeAt(j) - "a".charCodeAt(0);
				else
					index = 26 + word.charCodeAt(j) - "0".charCodeAt(0);
					
				//node.ptr is defined - edge detected
				if(node.ptr[index].ptr)  //this check is required to check if node.ptr[index] is an empty object. All non-empty nodes must have ptr  
					node = node.ptr[index];
				else
					break;
			}
		}
		catch(err)
		{
			console.error(err);
		}
		
		if(j == word.length && node.eng_str)
		{
			new_words.push(node.eng_str);
			console.debug("<newspeak> converting word to : " + node.eng_str);
		}
		else
		{
			new_words.push(word);
			console.debug("<newspeak> conversion not found for " + word);
		}
	}
	
	console.log("<newspeak> converted words: " + new_words);
	return {"words": words, "new_words" : new_words };
}

function init()
{
	 chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) 
	  {
			console.log("<newspeak> message received in background.js");
			if (request['handleSelection'] != undefined) 
			{
				console.log("<newspeak> handleSelection detected in background.js");
				sendResponse(handleSelection(request['handleSelection'])); //send converted words to content script for showing on the page
			}
      });
	  
	  request("https://sites.google.com/site/sixpackappsinc/home/trie.json");
	  
	  chrome.browserAction.onClicked.addListener(
      function(tab) {
	     console.log('<newspeak> browserAction called');
        chrome.tabs.sendRequest(
            tab.id,
            {'sendSelection': true});
      });
	  
	  console.log("<newspeak> init background success");
}

init();