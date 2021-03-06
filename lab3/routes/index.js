const homeRoutes = require('./tvmaze');

const constructorMethod = (app) => {
  app.use('/', homeRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;