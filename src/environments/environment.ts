// BUILD_ID is overwritten in CI (CodeBuild) with the short git SHA.
export const environment = {
  appName: 'CICD Mobile',
  buildId: 'local',
};
