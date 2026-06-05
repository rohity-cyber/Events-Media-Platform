const users = {};

module.exports = (io) => {

  io.on("connection", (socket) => {

    socket.on(
      "registerUser",
      (userId) => {
        users[userId] = socket.id;
      }
    );

    socket.on(
      "sendNotification",
      (notification) => {

        const receiverSocket =
          users[
            notification.receiver
          ];

        if(receiverSocket){

          io.to(
            receiverSocket
          ).emit(
            "newNotification",
            notification
          );
        }
      }
    );

    socket.on(
      "disconnect",
      () => {

        Object.keys(users)
        .forEach((userId)=>{

          if(
            users[userId] ===
            socket.id
          ){
            delete users[userId];
          }

        });
      }
    );
  });
};