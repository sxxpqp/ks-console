const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

const sshInit = async ({
  host,
  port = 22,
  username = 'root',
  password = '123456',
  privateKey,
  ...params
}) => {
  try {
    const res = await ssh.connect({
      host,
      port,
      username,
      password,
      privateKey, // privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa', 'utf8')
      ...params,
    })
    return res
  } catch (error) {
    global.logError.error(error)
  }
}

// class SSH {
//   constructor({
//     host,
//     port = 22,
//     username = 'root',
//     password,
//     privateKey,
//     ...params
//   }) {
//     this.host = host
//     this.port = port
//     this.username = username
//     this.password = password
//     this.privateKey = privateKey
//     this.params = params
//     this.client = null

//     this.init()
//   }

//   async init() {
//     try {
//       const res = await ssh.connect({
//         host: this.host,
//         port: this.port,
//         username: this.username,
//         password: this.password,
//         privateKey: this.privateKey, // privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa', 'utf8')
//         ...this.params,
//       })
//       this.client = res
//     } catch (error) {
//       global.logError.error(error)
//     }

//     return ssh
//   }
// }

// res.client.execCommand('ls -la', { cwd: '/' }).then(function(result) {
//   console.log('🚀 ~ file: ssh.js ~ line 81 ~ result', result)
// })
// setInterval(() => {
//   console.log(res.client.isConnected())
// }, 1000)

module.exports = {
  sshInit,
}
