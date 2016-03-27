var EpicStates = EpicStates || {};

EpicStates.LoadingState = function(game) {
};

EpicStates.LoadingState.prototype = {
  preload: function() {
    this.loadScripts();
    this.loadImages();

    var loadingBar = game.add.sprite(game.world.centerX, 400, 'loading');

    this.load.setPreloadSprite(loadingBar);
  },

  loadScripts: function() {
  },

  loadImages: function() {
    game.load.image('rectangle', 'assets/images/rectangle.png');
    game.load.image('spawner', 'assets/images/enemy_spawner.png');
    game.load.image('tile_grass', 'assets/images/grass_tile.png');
  },

};
