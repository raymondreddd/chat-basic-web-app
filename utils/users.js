const users = [];

//join user to chat and specify the details in form of an obj
function userJoin(id, username, room) {
    const user = { id, username, room}

    users.push(user)

    return user;
    
}

//get current user by id
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

//when user leaves
function userLeave(id) {
    const index= users.findIndex(user => user.id === id)

    if(index !== -1){
        //return users array without user
        return users.splice(index,1)[0];
    }
}

//get room users
function getRoomUsers(room) {
    return users.filter( user => user.room===room)
}


module.exports={userJoin,getCurrentUser,userLeave,getRoomUsers}