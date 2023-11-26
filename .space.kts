job("Publish frontend distribution") {
    startOn {
        gitPush {
            anyBranchMatching {
                +"refs/heads/HARMNY-T-64"
            }
        }
    }
    container(displayName = "Create local distribution", image = "node:lts-alpine") {
        shellScript {
            content = """
                npm install
                npm run production
            """
        }
        fileArtifacts {
            localPath = "dist"
            remotePath = "{{ run:number }}/dist.zip"
            archive = true
            onStatus = OnStatus.SUCCESS
        }
    }
    container(displayName = "Apply distribution", image = "registry.gitlab.com/gitlab-org/cloud-deploy/aws-base:latest") {
        env["AWS_DEFAULT_REGION"] = "us-east-1"
        env["AWS_ACCESS_KEY_ID"] = "{{ project:harmny_ui_jb_deployer_aws_access_key }}"
        env["AWS_SECRET_ACCESS_KEY"] = "{{ project:harmny_ui_jb_deployer_aws_secret_access_key }}"

        env["AWS_S3_BUCKET_NAME"] = "{{ project:harmny_ui_aws_s3_bucket_name }}"
        env["AWS_CF_DISTRIBUTION_ID"] = "{{ project:harmny_ui_web_aws_cf_distribution }}"

        fileInput {
            source = FileSource.FileArtifact(
                "{{ run:file-artifacts.default-repository }}",
                "{{ run:job.repository }}/jobs/{{ dashify('{{ run:job.name }}') }}-{{ run:job.id }}/{{ run:number }}-{{ run:id }}/{{ run:number }}/dist.zip",
                extract = true
            )
            localPath = "build/dist"
        }
        shellScript {
            content = """
                aws s3 sync --delete ./build/dist/ s3://${'$'}AWS_S3_BUCKET_NAME
                aws cloudfront create-invalidation --distribution-id ${'$'}AWS_CF_DISTRIBUTION_ID --paths "/*" > /dev/null
                echo 'Done.'
            """
        }
    }
}
