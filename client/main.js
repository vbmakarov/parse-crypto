const socket = io('http://localhost:5000');

const message = document.getElementById('message');
const messages = document.getElementById('messages');

const handleSubmitNewMessage = () => {
  socket.emit('parsing', { data: message.value });
};

socket.on('parsing', ({ data }) => {
  handleNewMessage(data);
});

const handleNewMessage = (message) => {
  console.log(message, 'message');
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
