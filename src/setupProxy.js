module.exports = function(app) {
  app.use((req, res, next) => {
    res.set({
        'Document-Policy': 'js-profiling'
    });
      next();
  });
};
