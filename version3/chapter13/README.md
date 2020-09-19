Kubernetesにはユーザーに似たコンセプトとして以下二つがある
- UserAccount
  - GKEではGoogleアカウントとリンクしていたり
  - EKSではIAMとリンクしていたりするようになっている
  - Kubernetesの管理対象ではない
  - クラスタレベルの存在となり、Namespaceの影響を受けない
- ServiceAccount
  - Namespaceに紐づくリソース
  - Pod起動時には必ずServiceAccountを一つ割り当てる必要がある
    - → ServiceAccountベースで認証を行なっている
  - 指定しない場合にはdefault ServiceAccountが割り当てられる

RBAC(Role Based Access Control)
- どういった操作を許可するのかを定めたRoleを作成し
- RoleBinding（ServiceAccountなどのUserに対してRoleを紐付ける）することでその権限を付与する
- AggregationRuleを作成することで複数のRoleを元に集約したRoleを作成できるため、Roleの管理性を高めることもできる

