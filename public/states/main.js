var game = new Phaser.Game(800, 600, Phaser.AUTO);

var EpicStates = EpicStates || {};

EpicStates.MainState = function(game) {
};

EpicStates.MainState.prototype = {
  preload: function() {
    game.load.image('loading', 'assets/images/loading.png');
    game.load.script('loading', 'states/loading.js');
  },

  create: function() {
    game.state.add('loading', EpicStates.LoadingState);
    game.state.start('loading');
  }
};

game.state.add('main', EpicStates.MainState);
game.state.start('main');
