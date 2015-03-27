/**
 * chatModule 
 * Contains everything there is to 
 * know about a "chat".
 * maintains a list of users in the room
 * and info about them
 * Follows revealing module pattern :)
 */
var ChatModule = (function() {    
    var myId;
    var cache = aek.cache()
    //holds the date of the last message in the screen
    var lastMessageID;
    //url of the connection
    var connectionUrl = "https://gerrard.lancs.ac.uk/ilancasterapidev/signalr"
    //The name of the chatroom - taken from the url. Defaults to lobby.
    var chatroomName = getParam('room'); //The get param function is in the ombile screen
    //An array of all the users in the room
    var users = [];
    //Debug - 1 yes. Decides if we should log.
    var debug = 1;
    //Me as a user.
    var me = search(myId, users);
    //Returns me
    var getMe = function() {
        return me;
    }
    //Gets a list of all the blocked users
    var getBlockedUsers = function() {
        if (cache.get('blockedUsers')) {
            return cache.get('blockedUsers')
        } else {
            return [];
        }
    }
    //Block a user
    var blockUser = function(id) {
        if (cache.get('blockedUsers')) {
            var blockedUsers = cache.get('blockedUsers')
            blockedUsers.push(id)
            cache.set('blockedUsers', blockedUsers)
        } else {
            var blockedUsers = []
            blockedUsers.push(id)
            cache.set('blockedUsers', blockedUsers)
        }
    }
    var getMyId = function() {
        return myId;
    }
    var setMyId = function(id) {
        myId = id
    }
    var getLastMessageID = function() {
        return lastMessageID;
    }
    var setLastMessageID = function(date) {
        lastMessageID = date;
    }
    var getDebug = function() {
        return debug;
    }
    var getConnectionURL = function() {
        return connectionUrl;
    }
    var getUsersInRoom = function() {
        return users;
    }
    var addUserToRoom = function(user) {
        if (!containsObject(user, users)) {
            users.push(user)
        }
        document.getElementById('usersInRoom').innerHTML = users.length;
        return users;
    }
    var getChatName = function() {
        if (chatroomName == "" || chatroomName == null || chatroomName == undefined) {
            return "Lobby";
        }
        return chatroomName;
    }
    return {
        getBlockedUsers: getBlockedUsers,
        blockUser: blockUser,
        getMe: getMe,
        getMyId: getMyId,
        setMyId: setMyId,
        getLastMessageID: getLastMessageID,
        setLastMessageID: setLastMessageID,
        getDebug: getDebug,
        getConnectionURL: getConnectionURL,
        getUsersInRoom: getUsersInRoom,
        getChatName: getChatName,
        addUserToRoom: addUserToRoom,
    }
})();