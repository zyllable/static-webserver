"USE STRICT";
//generic error code pages
const page404 = "404 NOT FOUND";
const page500 = "500 INTERNAL SERVER ERROR";

Deno.serve({port: 51660, hostname: "localhost"},async (request) => {
	console.log(request.url + "||" + request.headers.get("user-agent"));
	const url = stripUrl(request.url);
	let resource = null;
	let status = 500;
	let contentType = "text/plain";
	try {
		const file = await Deno.open(url, { read: true });
		resource = file.readable;
		status = 200;
		contentType = mimeLookup(url);
	} catch (e) {
		if (e instanceof Deno.errors.NotFound) {
			status = 404
			resource = page404
		} else {
		console.error(e);
		status = 500;
		resource = page500
			}
		}
	return new Response(resource, { status: status, headers: {"Content-Type": contentType }});
});

const stripUrl = (url) => {
	const splitUrl = url.split("/");
	let endUrl = ""
	for (let i=3; i < splitUrl.length; i++) {
		endUrl += "/" + splitUrl[i];
	}
	endUrl = endUrl.substring(1)
	console.log(endUrl);
	return endUrl;
}
const mimeLookup = (url) => { //remember to update this anytime theres a new file type, shouldnt be but yeah, and yes i know this is very inconvenient and probably not the best way to do it thank you for pointing that out random source code reader
	if (url.endsWith(".html")) {return "text/html"}
	else if (url.endsWith(".css")) {return "text/css"}
	else if (url.endsWith(".js")) {return "text/javascript"}
	else if (url.endsWith(".png")) {return "image/png"}
	else if (url.endsWith(".jpg")) {return "image/jpeg"}
	else if (url.endsWith(".gif")) {return "image/gif"}
	else if (url.endsWith(".ico")) {return "image/vnd.microsoft.icon"}
	else if (url.endsWith(".ttf")) {return "font/ttf"} //god this is getting boring
	else if (url.endsWith(".svg")) {return "image/svg+xml"}
	else if (url.endsWith(".mp3")) {return "audio/mpeg"}
	else if (url.endsWith(".mp4")) {return "audio/mp4"}
	else if (url.endsWith(".zip")) {return "application/zip"}
	else {return "text/plain; charset=utf-8"} //will work as intended at best, return mash or download embed at worst
}
