const socket = io();
//getting element from dom (form)
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//getting username & roo,
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

console.log(username, room);
console.log("username isnt changing");

//joining chatroom
socket.emit('joinRoom',{username,room})

//get room & users
socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})
//this msg we get from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down when we get
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

//message submit
//geeting text from form
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //msg is chat id in form
    const msg=e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage',msg);

    //clearing input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
})


//using vanillajs to p=output msg

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

//traversy media outoput msg
// function outputMessage(message) {
//     const div = document.createElement('div');
//     div.classList.add('message');
//     const p = document.createElement('p');
//     p.classList.add('meta');
//     p.innerText = message.username;
//     p.innerHTML += `<span>${message.time}</span>`;
//     div.appendChild(p);
//     const para = document.createElement('p');
//     para.classList.add('text');
//     para.innerText = message.text;
//     div.appendChild(para);
//     document.querySelector('.chat-messages').appendChild(div);
//   }

//add room name to DOM???
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
 // Add users to DOM
  function outputUsers(users) {
      userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}`;
    // userList.innerHTML = '';
    // users.forEach((user) => {
    //   const li = document.createElement('li');
    //   li.innerText = user.username;
    //   userList.appendChild(li);
    // });
  }

  //leaving btn
  //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });