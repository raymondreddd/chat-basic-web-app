const socket = io();
//getting element from dom (form)
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');

//getting username & roo,
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

console.log(username, room);
console.log("username isnt changing");

//joining chatroom
socket.emit('joinRoom',{username,room})

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
    e.target.elements.msg.focus;
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