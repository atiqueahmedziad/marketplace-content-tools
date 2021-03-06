import os

import fabdeploytools.envs
from fabric.api import env, lcd, local, task
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(settings.CLUSTER)

ROOT, PROJECT_NAME = helpers.get_app_dirs(__file__)

if settings.ZAMBONI_DIR:
    helpers.scl_enable('python27')
    ZAMBONI = '%s/zamboni' % settings.ZAMBONI_DIR
    ZAMBONI_PYTHON = '%s/venv/bin/python' % settings.ZAMBONI_DIR

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings_local_mkt'


@task
def pre_update(ref):
    with lcd(PROJECT_NAME):
        local('git fetch')
        local('git fetch -t')
        local('git reset --hard %s' % ref)


@task
def build():
    with lcd(PROJECT_NAME):
        local('npm install')
        local('NODE_ENV=production MKT_ENV=%s npm run build' % (settings.ENV))


@task
def deploy_jenkins():
    r = helpers.build_rpm(name=settings.PROJECT_NAME,
                          app_dir='marketplace-content-tools',
                          env=settings.ENV,
                          cluster=settings.CLUSTER,
                          domain=settings.DOMAIN,
                          root=ROOT)

    r.remote_install(['web'])

    # disable deploy_build_id
    # deploy_build_id(settings.PROJECT_NAME)


@task
def deploy_build_id(app):
    with lcd(ZAMBONI):
        local('%s manage.py deploy_build_id %s' %
              (ZAMBONI_PYTHON, app))
