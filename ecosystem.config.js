module.exports = {
  apps: [{
    name: "weibo",
    script: 'dist/main.js',
    watch: [],
    ignore_watch: ["node_modules", "logs", "dist","data"],
    cwd:"./",
    env: {
      "PORT": 3001,
    }
  }],

  deploy: {
    weibo_01: {
      user: 'root',
      host: 'weibo_01',
      ref: 'origin/main',
      repo: 'https://github.com/hookray/weibo.git',
      path: '/root/weibo',
      'pre-deploy-local': '',
      'post-deploy': 'yarn && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    weibo_02: {
      user: 'root',
      host: 'weibo_02',
      ref: 'origin/main',
      repo: 'https://github.com/hookray/weibo.git',
      path: '/root/weibo',
      'pre-deploy-local': '',
      'post-deploy': 'yarn && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    weibo_03: {
      user: 'root',
      host: 'weibo_03',
      ref: 'origin/main',
      repo: 'https://github.com/hookray/weibo.git',
      path: '/root/weibo',
      'pre-deploy-local': '',
      'post-deploy': 'yarn && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    weibo_04: {
      user: 'root',
      host: 'weibo_04',
      ref: 'origin/main',
      repo: 'https://github.com/hookray/weibo.git',
      path: '/root/weibo',
      'pre-deploy-local': '',
      'post-deploy': 'yarn && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    weibo_05: {
      user: 'root',
      host: 'weibo_05',
      ref: 'origin/main',
      repo: 'https://github.com/hookray/weibo.git',
      path: '/root/weibo',
      'pre-deploy-local': '',
      'post-deploy': 'yarn && tsc && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
