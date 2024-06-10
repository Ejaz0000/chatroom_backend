const users = []

function userJoin(id, user, room){
    const u = {id, user, room};
    users.push(u);
   return u;
}

function getCurrentUser(id){
    return users.find(user => user.id === id)
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    
    return users.splice(index,1)[0]
    
}

function getRoomUsers(room){
    return users.filter(user=> user.room === room)
}

module.exports = {userJoin, getCurrentUser,userLeave,getRoomUsers};