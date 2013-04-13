var users   = require('./users');
var rooms   = require('./rooms.js'); 
var id      = require('./id.js');
var pokemon = require('./pokemon.js');
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 1337});
var date = new Date();

//var io = require ('socket.io').listen(wss);

wss.on('connection', function(socket){

    // Create USer
    user = {};
    user.id = id.makeId();
    socket.id = user.id;
    user.socket = socket;
    user.X = 0;
    user.Y = 0;
    users.addUser(user);
    socket.send('{"action" : "connected", "userId": "'+user.id+'"}');
    //    console.log(socket.upgradeReq.headers.sec-websocket-key);
    console.log(users.countUsers() + " sont connectes");
    
    //Perte de la connection
    socket.on('close', function() { 
        users.deleteUser(socket.id);
        console.log(users.countUsers() + " sont connectes");        
    });

    //Reception d'un message
    socket.on('message', function(string) {
        isMessageValid = true;
        try {
             message = JSON.parse(string);
        } catch (e) {
             isMessageValid = false;
        }
        if (isMessageValid) {
             console.log(message.action);
             console.log(message);

/******************************************************************************
*****                                                                     *****
*****                             ACTIONS                                 *****
*****                                                                     *****
******************************************************************************/

            // Creation d'une salle
            if(message.action == 'createRoom') {
                rooms.createRoom(users.getUser(socket.id),socket);
             }
   
            //rejoindre une salle
             if(message.action == 'joinRoom') {
                 try {
                     rooms.getRoom(message['roomId']).join(users.getUser(socket.id),socket);
                 } catch (e) {
                     console.log(e);
                     rooms.deleteRoom(message['roomId']);    
                 }
             }
             
             //choix du pokemon
             if(message.action == 'choosePokemon') {
                  users.getUser(socket.id).pokemon = new pokemon.create(message['pokemonId']);
             }
 
             //Lister les pokemons d'une room
             if(message.action == 'getPokemons') {
                  rooms.getRoom(message['roomId']).getPokemons(users.getUser(socket.id));
             }

             //Attacuer
             if(message.action == 'attack') {
                 rooms.getRoom(message['roomId']).addAttackToBuffer(users.getUser(socket.id), message['attackId']);
             }

             if (message.action == 'heal') {
	          users.getUser(socket.id).pokemon = new pokemon.create(users.getUser(socket.id).pokemon.ID); 
             }


             //Nouveau joueur sur la map
             if(message.action == 'newPlayer') {
                  users.notifyNewUser(user); 
             }
             //Position des autres joueurs sur la map
             if(message.action == 'sendPosition') {
                 for (var i = 0; i < users.array.length; i++){
                         users.array[i].socket.send('{"action" : "setPosition",'
                                                   +' "userId": "'+message['userId']+'",'
                                                   +' "X" : "'+message['X']+'",'
                                                   +' "Y" : "'+message['Y']+'" }');
                 }
             }





/******************************************************************************
*****                                                                     *****
*****                           FIN ACTIONS                               *****
*****                                                                     *****
******************************************************************************/

            
         }
    });

});

