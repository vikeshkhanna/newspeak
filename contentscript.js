function sendSelection()
{
	console.log("<newspeak> sendSelection called");
	var focused = document.activeElement;
	
	var selectedText;
	if (focused) 
	{
		try 
		{
		  selectedText = focused.value.substring(
			  focused.selectionStart, focused.selectionEnd);
		} catch (err) 
		{
			//
		}
	}
  if (selectedText == undefined) 
  {
    var sel = window.getSelection();
    selectedText = sel.toString();
  }
  
  var words = selectedText.split(/(?:,|\?|\.|!| )+/);
  
  //This will raise an OnRequest event in all extension pages
  chrome.extension.sendRequest({'handleSelection': words }, function(response){
		
		var new_words = response["new_words"];
		console.log("<newspeak> sendSelection received response with new words : " + new_words);
		
		try
		{
			var range = window.getSelection().getRangeAt(0);
			range.extractContents();
			
			var div = document.createElement('div');
			div.style.background = "#E8E8E8";
			
			div.innerHTML = "";
			
			//for each word, check if it is converted
			for(var i = 0; i < words.length; ++i)
			{
				//conversion found - replace original word
				if(words[i].toLowerCase() != new_words[i])
				{
						div.innerHTML += "<i><strike>" + words[i] + "</strike></i></span> " + "<span style='background-color:yellow'>" + new_words[i] + "</span> ";
				}
				else
				{
						div.innerHTML += words[i] + " ";
				}
			}
			
			range.insertNode(div);
		}
		catch(err)
		{
			console.error(err);
		}
  });
  
  console.log("<newspeak> sendSelection finished");
}

//handle conversion - replace the relevant text in the DOM
function handleConversion(words, new_words)
{
	try
	{
		window.getSelection();
	}
	catch(err)
	{
		console.error(err);
	}

}

//common event handler
function onExtensionMessage(request)
{
	console.log("<newspeak> onExtensionMessage called with request: " + request.toString());

	if(request["sendSelection"] != undefined)
	{
		console.log("<newspeak> sendSelection detected");
		if (!document.hasFocus()) 
		{
			return;
		}
		sendSelection();
	}
	
	console.log("onExtensionMessage success");
}
//Initialize event handlers
function initScript()
{
	console.log("<newspeak> init content script started");
	chrome.extension.onRequest.addListener(onExtensionMessage);
	console.log("<newspeak> init content script complete");
}

initScript();

