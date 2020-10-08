import { Octokit } from '@octokit/rest';
import * as semver from 'semver';

module.exports.fetchSupplantVersion = async function(base: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN must be set');
  }

  const github = new Octokit({ auth: token });
  const releases = await github.repos.listReleases({
    owner: 'aws',
    repo: 'aws-cdk',
  });

  const baseWithoutPre = base.split('-')[0];

  // this returns a list in decsending order, newest releases first
  for (const release of releases.data) {
    const version = release.name.replace('v', '');
    if (semver.lt(version, baseWithoutPre)) {
      return version;
    }
  }
  throw new Error(`Unable to find supplant version of ${base}`);

};

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('make-runnable/custom')({
  printOutputFrame: false,
});