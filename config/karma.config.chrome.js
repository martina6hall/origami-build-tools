const karmaBaseConfig = require('./karma.config');

module.exports = function (config) {

	const karmaConfig = Object.assign(
		{},
		karmaBaseConfig,
		{
			browsers: ['ChromeHeadless'],
			logLevel: config.LOG_DISABLE
		}
	);

	config.set(karmaConfig);
};
