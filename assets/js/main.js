(function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const socket = io(location.origin + '/box');

    init();

    function init() {
       $("#userdisplay").text(user.username);
       $("#useronlinetime").text(getTotalOnlineTime());
       socketStart();

    }

    function socketStart() {
       socket.emit('user:connected', user);

       socket.on('new:connected', function(user) {
          addNewConnectedUser(user)

       });

       socket.on('user:newtime', function(user) {
          $("ul#onlineTime li." + user.uid).html(user.totalOnlineTime);
       })

       socket.on('previous:connected', function(users) {
          //  console.log("lleal");
          users.forEach(function(userConnected) {
             userConnected.uid !== user.uid && addNewConnectedUser(userConnected);
          })
       })

       socket.on('user:disconnected', function(uid) {
           console.log("wfwe");
          $('li.' + uid).remove();
       })

    }

    function addNewConnectedUser(user) {
       var newUser = $('<li>', {
          class: user.uid,
          text: user.username
       });
       var totalOnlineTime = $('<li>', {
          class: user.uid,
          text: '00:00:00'
       });

       $("ul#usersConnected").append(newUser);
       $("ul#onlineTime").append(totalOnlineTime);
    }

    setInterval(function() {

       var totalOnlineTime = getTotalOnlineTime();
       $("#useronlinetime").text(totalOnlineTime);
       user.totalOnlineTime = totalOnlineTime;
       socket.emit('updated:time', user)

    }, 1000)

    function getTotalOnlineTime() {
        return moment.utc(moment(new Date()).diff(moment(user.connectedTime))).format('HH:mm:ss');
    }

})();
