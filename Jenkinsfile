node{
    // 全局获取最新代码
    stage("获取最新代码") {
        // 限制15分钟内完成。
        timeout(time: 15, unit: 'MINUTES') {
            coCode()
        }
    }

    stage("docker构建"){
        // 将vue-require工程下的src目录拷贝到nginx中
        buildAndPushImage("/src")
    }

    stage("清理工程") {
        // 删除目录
        deleteDir()
        // 查看当前目录
        sh 'ls -lah'
    }
}

def coCode() {
    checkout scm
}

def buildAndPushImage(moduleHome) {
    def curPath = pwd()
    println "current path: " + curPath
    def workPath = curPath + moduleHome
    println "build docker workspace:" + workPath

    //生成生成镜像的目录
    def buildPath = curPath + "/build";
    // 创建构建目录，并拷贝文件。
    sh "mkdir -p ${buildPath} && cp ${curPath}/docker/Dockerfile ${buildPath}/ && cp ${curPath}/docker/template.conf ${buildPath} && cp ${curPath}/docker/run.sh ${buildPath} && mv ${workPath} ${buildPath}/"

    // 声明凭证，该凭证来自jenkins
    def docker_cer = 'docker-hub-10-1-245-53'

    // 读取版本号码
    def versionDate = new Date().format('yyyyMMddHHmmss');
    buildVersion = "master." + versionDate;
    println("buildVersion:" + buildVersion)

    docker.withServer('tcp://10.1.245.53:2375', docker_cer) {
        def app = docker.build("vue-require:" + buildVersion, buildPath)

        docker.withRegistry('http://10.1.236.209:18082', docker_cer) {
            // 推送最新版本
            //app.push("latest")
            // 推送当前版本
            app.push(buildVersion)

        }
    }
}
