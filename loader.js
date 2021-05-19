/**
 * Load the necessary configuration
 */
(function loader() {
  const { ENV = '' } = process.env;

  if (ENV && ENV === 'heroku') {
    return import('./index.js');
  }

  return import('dotenv').then(({ default: dotenv }) => {
    dotenv.config();
    return import('./index.js');
  }).catch((error) => {
    throw error;
  });
}());
