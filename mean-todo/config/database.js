module.exports = {
    database: process.env.MONGODB_URI || 'mongodb://localhost:27017/mean-todo',
    secret: process.env.JWT_SECRET || 'balls'
}
