起動時と終了時に任意のコマンドを実行する
- postStart
  - spec.containers[].command(Entrypoint)とほぼ同じタイミングで実行されるため、Entrypointが実行されるよりも前にpostStartが実行される可能性がある
  - 起動に必要なファイルの配置などを行う場合にはinitContainersで行うか、Entrypointの中で行ってから起動する
- preStop

```
kubectl apply -f sample-lifecycle.yaml
kubeclt exec -it sample-lifecycle -- ls /tmp
kubeclt delete -f sample-lifycle.yaml
kubeclt exec -it sample-lifecycle -- ls /tmp
```