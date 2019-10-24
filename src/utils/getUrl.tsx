// If you are on staging or production, start the api call with
// demo.lizard.net (in front of /api/...).
// Localhost uses the proxy in package.json.
// The window.location.href does not contain localhost if you are on staging
// or production.
function addBaseUrlToApiCall () {
	var startUrl = "";
	if (window.location.href.indexOf("localhost") === -1) {
	  return("demo.lizard.net");
	} else {
	  return("");
	}
}

export default addBaseUrlToApiCall;
