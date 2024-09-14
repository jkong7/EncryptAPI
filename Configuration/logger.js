const winston = require('winston');

//Create a logger instance using Winston
const logger = winston.createLogger({
    level: 'info', //Default log level, capturing 'info' and above
    format: winston.format.json(), //Log messages in JSON format
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }), //Logs errors to 'error.log'
        new winston.transports.File({ filename: 'combined.log' }) //Logs all levels to 'combined.log'
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple() //Logs to the console in a simple format for non-production environments
    }));
}

module.exports = logger;
