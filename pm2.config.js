module.exports = {
  apps: [{
    name: 'mongoGrafan',
    script: './index.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
