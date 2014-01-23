function statusController($scope) {
  var socket = io.connect();

  $scope.name = '';
  $scope.color = 'ffffff';

  socket.on('connect', function () {
    console.log("Client connected.")
  });

  socket.on('message', function (msg) {
    $scope.color = msg.text;
    console.log("Received: " + $scope.color);
    $("body").css("background-color", $scope.color);
    $scope.$apply();
  });

  $scope.suitup = function send() {
    console.log('Suit-Up');
    socket.emit('message', '#000000');
  };

  $scope.party = function send() {
    // TODO: Calculate color based on name, maybe
    var color = 'rgb(241, 51, 218)';
    console.log('Party: ', color);
    socket.emit('message', color);
  };
  
}