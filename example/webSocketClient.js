
import {AlertForm} from "../popups.mjs"

let isGuestLogin = false;
let createMode = false;

// loginForm = {
//     connect() {
//     },
//     disconnect() {
//     },
//     login() {
//     }


const l = {
    ws : null,

    loginForm : null,

	bindControls( popup ) {
    		const f = popup.divFrame;

    		const form1 = f.querySelector( "#loginForm" );

    		const form2 = f.querySelector( "#createForm" );
    		const form3 = f.querySelector( "#guestForm" );

		form3.style.display = "none";
		form2.style.display = "none";
		//form3.style.display = "none";

		const userField =form1.querySelector( "#user" );
		const passField =form1.querySelector( "#password" );
		
		const nameField2 =form2.querySelector( "#name" );
		const userField2 =form2.querySelector( "#user" );
		const emailField2 =form2.querySelector( "#email" );
		const passField2 =form2.querySelector( "#password" );
		const passField22 =form2.querySelector( "#password2" );

		const userField3 =form3.querySelector( "#user" );

		const userLogin = f.querySelector( "#doLogin" );
		
		const createAccount = f.querySelector( "#createAccount" );
		const createAccountInner = f.querySelector( "#createAccountInner" );
		const guestLogin = f.querySelector( "#guestLogin" );

		guestLogin.addEventListener( "click", ()=>{
			if( isGuestLogin) {
		       		form3.style.display = "none";
				if( createMode ) {
			       		form2.style.display = "";
		       			form1.style.display = "none";
				}else{
			       		form2.style.display = "none";
		       			form1.style.display = "";
				}
				isGuestLogin = true;
			}  else {
		       		form3.style.display = "";
		       		form2.style.display = "none";
	       			form1.style.display = "none";
				isGuestLogin = true;
			}
			popup.center();
	       	} );
		createAccount.addEventListener( "click", ()=>{
		      	if( createMode ) {
		       		form3.style.display = "none";
		       		form2.style.display = "none";
		       		form1.style.display = "";

				createAccountInner.innerText = "Create Account";
				popup.center();
		       }else {
		       		form3.style.display = "none";
		       		form2.style.display = "";
		       		form1.style.display = "none";

				createAccountInner.innerText = "Use Account";
				popup.center();
		       }
			isGuestLogin = false;
			createMode = !createMode;
	       	} );


		userLogin.addEventListener( "click", ()=>{
			if( !l.ws ) {
				if( !alertForm ) alertForm = new AlertForm();
				alertForm.caption = "Waiting for connect...";
				alertForm.show();
				return
			}
			if( isGuestLogin ) {
				if( userField.innerText.length < 3 ) {
					if( !alertForm ) alertForm = new AlertForm();
					alertForm.caption = "Please use a longer display name...";
					alertForm.show();
				} else {
					l.ws.doGuest( userField3.innerText );
				}
			}
			else {
			    	if(createMode ) {
					if( passField2.value === passField22.value )
						l.ws.doCreate( nameField2.value, userField2.value, passField2.value, emailField2.value );
					else {
						if( !alertForm ) alertForm = new AlertForm();
						alertForm.caption = "Please reconfirm your password...";
						alertForm.show();
					}
						
				   } else {
					l.ws.doLogin( userField.value, passField.value );
				}
			}
		} );

		popup.center();
		popup.show();
	}
}
const AsyncFunction = Object.getPrototypeOf( async function() {} ).constructor;

let alertForm = null ;

function Alert( s ) {
	if( !alertForm ) alertForm = new AlertForm();
	alertForm.caption = s;
	alertForm.show();
} 


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
	else if( msg.op === "login" ) {
		if( msg.success ) {
			Alert(" Login Success" );
			if( l.loginForm && l.loginForm.login )
				l.loginForm.login();
		} else if( msg.ban ) {
			Alert( "Bannable Offense" );
		} else if( msg.device ) {
			//temporary failure, this device was unidentified, or someone elses
			const newId = l.ws.SaltyRNG.Id();
			localStorage.setItem( "deviceId", newId );
			l.ws.send( JSON.stringify( {op:"device", deviceId:newId } ) );
		} else
			Alert( "Login Failed..." );		
		
	}
	else if( msg.op === "create" ) {
		if( msg.success ) {
			if( l.loginForm && l.loginForm.login )
				l.loginForm.login();
			else
				Alert(" Login Success" );			
		} else if( msg.ban )  {
			Alert( "Bannable Offense" );
		} else
			Alert( "Login Failed..." );		
		
	}
	else if( msg.op === "set" ) {
	    	localStorage.setItem( msg.value, msg.key );
	}
}

function openSocket( addr ) {
	addr = addr || location.host

	const  proto = location.protocol==="http:"?"ws:":"wss:";

  var ws = new WebSocket(proto+"//"+addr+"/", "login");
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
	if( !ws.processMessage || !ws.processMessage( ws, msg_ ) )
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


