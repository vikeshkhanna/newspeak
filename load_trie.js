var root;

//for reading trie
function request(url) {
	console.log("<newspeak> ajax request received for " + url);
	
    var xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function(){
            if (xhr.readyState != 4)
                {
					console.log("<newspeak> ignoring xhr readystate = " + xhr.readyState);
					return;
				}

            if (xhr.responseText) {
                console.log("<newspeak> responseText received");
				root = xhr.responseText;
				root = eval('(' + root + ')');
			}
			else
			{
				console.debug("<newspeak> respnseText was empty");
			}
        }

        xhr.onerror = function(error) {
            console.debug(error);
        }

        xhr.open("GET", url, true);
        xhr.send(null);
    } catch(e) {
        console.error(e);
    }
}

	  
