/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const QRCode = require ( "qrcode-svg" ) ;
export default {
	async fetch ( request , env ) {
		const url = new URL ( request . url )
		// console . log ( 'path=' , url . pathname )
		if ( url . pathname == "/app.json" ) {
			return app_json ( request , env )
		} else if ( url . pathname == "/qr.png" ) {
			return genQr ( request , env , url . search )
		}
		// Passes the incoming request through to the assets binding.
		// No asset matched this request, so this will evaluate `not_found_handling` behavior.
		return env . ASSETS . fetch ( request )
	} ,
}
async function genQr ( request , env , sr0 ) {
	let sr = new URLSearchParams ( sr0 )
	var k = sr . get ( 'k' )
	console . log ( 'k=' + k )
	if ( k == '' ) { k = "empty" }
	const qr = new QRCode ( { content : k , width : 128 , height : 128 } )
	return new Response ( qr . svg ( ) , { headers : { "Content-Type" : "image/svg+xml" } } )
}
async function app_json ( request , env ) {
	let fd = await request . formData ( )
	let act = fd . get ( 'act' )
	switch ( act ) {
		case 'row' :
		return Response . json ( { html : await genOneRow ( fd . get ( 'comm' ) ,
					fd . get ( 'cont' ) , fd . get ( 'lastCls' ) ) } )
		default : //ver
		return Response . json ( { ver : 1 } )
	}
}
async function genOneRow ( comm , cont , lastCls ) {
	var m = { 'comm' : comm , 'cont' : cont }
	var qrImg = `<img src="qr.png?k=${encodeURIComponent(cont)}" alt="${cont}" />`
	if ( lastCls == '0' ) {
		m . qr0 = qrImg
		m . qr1 = ''
		m . cls = 'alignL'
	} else {
		m . qr0 = ''
		m . qr1 = qrImg
		m . cls = 'alignR'
	}
	let h = `<div class = '${m.cls}' >
	<a href = # onclick = 'removeMeRow(this)' > X </a >
	${ m.qr0 } <i class = comm > ${ m.comm } </i > ${ m.cont } ${ m.qr1 }
</div > `
	// console . log ( 'h=' , h )
	return h
}
