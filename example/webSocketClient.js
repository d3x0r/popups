

const l = {
    ws : null,

    loginForm : null

}
const AsyncFunction = Object.getPrototypeOf( async function() {} ).constructor;


function processMessage( msg ) {
	if( msg.op === "addMethod" ) {
		try {
                    	// why is this not in a module?
			var f = new AsyncFunction( "JSON", "Import", msg.code );
			const p = f.call( l.ws, JSON, (i)=>import(i) );
                        l.connected = true;
                        if( l.loginForm )
	                        l.loginForm.connect();
		} catch( err ) {
			console.log( "Function compilation error:", err,"\n", msg.code );
		}
	}
	if( msg.op === "login" ) {
        	if( msg.success ) {
	        	alert(" Login Success" );

                        //localStorage.setItem( "clientId", msg.clientId );
                        //localStorage.setItem( "deviceId", msg.deviceId );
                        //localStorage.setItem( "loginKey", msg.loginKey );
                }
                
        }
	if( msg.op === "create" ) {
        	if( msg.success ) {
	        	alert("success" );
                        localStorage.setItem( "clientId", msg.clientId );
                        localStorage.setItem( "deviceId", msg.deviceId );
        	}        
        }
        if( msg.op === "set" ) {
            	localStorage.setItem( msg.value, msg.key );
        }
}

function openSocket(  ) {

	const  proto = location.protocol==="http:"?"ws:":"wss:";
  var ws = new WebSocket(proto+"//"+location.host+"/", "login");
                	console.log( "websocket:", ws, proto+"//"+location.host+"/" );
  ws.onopen = function() {
    // Web Socket is connected. You can send data by send() method.
    //ws.send("message to send"); 
	l.ws = ws;
	ws.send( '{ op: "hello" }' );
        console.log( "Success on socket open." );
  };
  ws.onmessage = function (evt) { 
  	const msg_ = JSON.parse( evt.data );
	processMessage( msg_ );
  };
  ws.onclose = function() { 
	l.ws = null;
        if( l.loginForm )
	       l.loginForm.disconnect();
	setTimeout( openSocket, 5000 ); // 5 second delay.
  	// websocket is closed. 
  };

}



export {l as connection,openSocket};
