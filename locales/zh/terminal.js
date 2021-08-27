module.exports = {
  'Launch kubectl': '启动 kubectl',
  'Copy Successfully': '复制成功',
  Copy: '复制',
  Disconnect: '断开连接',
  connected: '已连接',
  disconnected: '未连接',
  'Kubeconfig File': 'Kubeconfig 文件',
  'Put this into': '把它加入到',
  'KubeSphere Terminal': 'KubeSphere 终端',
  'Download File': '下载文件',

  KUBECONFIG_TIP: `
    <h2><a id="KubeConfig__0"></a>kubeconfig 配置方法</h2>
    <p>查阅更多命令请参照 <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/" target="_blank">官方文档</a></p>
  `,

  KUBECTL_TIP: `
    <h2><a id="KubeCtl__0"></a>kubectl 常用命令</h2>
    <p>查阅更多命令请参照 <a href="https://kubernetes.io/docs/reference/kubectl/overview/" target="_blank">官方文档</a></p>
    <h3><a id="kubectl__3"></a>kubectl 输出格式</h3>
    <ul>
    <li>显示 Pod 的更多信息</li>
    </ul>
    <p><code>kubectl get pod &lt;pod-name&gt; -o wide</code></p>
    <ul>
    <li>以 yaml 格式显示 Pod 的详细信息</li>
    </ul>
    <p><code>kubectl get pod &lt;pod-name&gt; -o yaml</code></p>
    <h3><a id="kubectl__13"></a>kubectl 操作</h3>
    <h4><a id="1__15"></a>1. 创建资源对象</h4>
    <ul>
    <li>根据 yaml 配置文件一次性创建 service 和 rc</li>
    </ul>
    <p><code>kubectl create -f my-service.yaml -f my-rc.yaml</code></p>
    <ul>
    <li>对目录下所有 .yaml、.yml、.json 文件进行创建操作</li>
    </ul>
    <p><code>kubectl create -f &lt;directory&gt;</code></p>
    <h4><a id="2__25"></a>2. 查看资源对象</h4>
    <ul>
    <li>查看所有 Pod 列表</li>
    </ul>
    <p><code>kubectl get pods</code></p>
    <ul>
    <li>查看 rc 和 service 列表</li>
    </ul>
    <p><code>kubectl get rc,service</code></p>
    <h4><a id="3__35"></a>3. 查看资源详情</h4>
    <ul>
    <li>显示 Node 的详细信息</li>
    </ul>
    <p><code>kubectl describe nodes &lt;node-name&gt;</code></p>
    <ul>
    <li>显示 Pod 的详细信息</li>
    </ul>
    <p><code>kubectl describe pods/&lt;pod-name&gt;</code></p>
  `,
}
