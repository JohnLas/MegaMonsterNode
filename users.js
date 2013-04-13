usersArray = [];


exports.addUser = function(user) {
//   usersArray[user.id] = user;
  usersArray.push(user);

}
 
exports.countUsers = function() {
    var count = 0;
    for (var k in usersArray) {
        if (usersArray.hasOwnProperty(k)) {
           ++count;
        }
    }
    return count;
}

exports.deleteUser = function (id) {
    for (var i = 0; i < usersArray.length; i++) 
        if (usersArray[i].socket.id == id) 
           usersArray.splice(i,1);
}


exports.getUser = function (id) {
   return usersArray[id]; 
}


exports.notifyNewUser = function(newUser) {
    for (var i = 0; i < this.array.length; i++) {
        newUser.socket.send('{"action" : "newPlayer",'
                        +' "userId" : "'+this.array[i].id+'",'
                        +' "X" : "'+this.array[i].X+'",'
                        +' "Y" : "'+this.array[i].Y+'" }');

        this.array[i].socket.send('{"action" : "newPlayer",'
                                  +' "userId" : "'+newUser.id+'",'
                                  +' "X" : "'+30+'",'
                                  +' "Y" : "'+30+'" }');
    }
}




exports.array = usersArray;
