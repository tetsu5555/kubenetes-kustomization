Ingress
  - L7ロードバランシング

Kubernetesの仕組み
  - マニフェストで定義したリソースをKubernetesに登録
  - リソースに対応するコントローラーが処理を行うことでシステムが動作する

Ingressの種類
  - クラスタ外のロードバランサを利用したIngress
    - GKE Ingress
      - GCLBがトラフィックを受信
      - GCLBでHTTPS終端やパスベースルーティングなどを行う
      - NodePortへトラフィックを転送する
      - Podまで到達する
  - クラスタ内にIngress用のPodをデプロイするIngress
    - Nginx Ingress
      - L7相当のロードバランサ処理を行わせるためにIngress用のPodをクラスタ内に作成する必要がある
      - 作成したIngress用のPod宛にLoadBalancer Serviceを作成するなど準備が必要
      - Ingress用のPodがHTTPSの終端やパスベースのルーティングなどL7相当の処理を行うため、負荷に応じてPodのレプリカ数のオートスケールも考量する必要がある
      - ルールに一致しない場合のデフォルト転送用のDeploymentも作成しておく必要がある

Service
- L4ロードバランシング
- クラスタ内DNSにようる名前解決
- ラベルを利用したPodのサービスディスカバリ
Ingress
- L7ロードバランシング
- HTTPS終端
- パスベースルーティング
