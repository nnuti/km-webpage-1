def globalVariable(envName){
    //! Change config //
    env.project_group       = "do67010-eai" // edit # projectID
    env.project_name        = "fe-ptt-abdul" // edit # serviceID
    env.project_version     = "1.0"

    env.application_language    = [ "python": false, "nodejs": true, "golang": false, "dotnet_core": false, "java": false, "php": false, "dotnet_fw": false ]
    env.deploy_type             = [ "oc": false, "aks": false, "aws": false, "azure_function": false, "appservice_srccode": false, "appservice_container": true ] // aks , aws , azure_function, oc
    env.unit_test_base_image    = "node:18" // Base image for unit test
    env.automate_test           = [ "api_test" : false, "ui_test" : false ]
    env.allow_failure           = [ "trivy" : true, "sonarqube" : true, "blackduck" : true, "owasp" : true, "owasp_zap"  : true , "coverity" : true , "performance_test" : true, "api_test" : true, "ui_test" : true ]
    env.build_cmd               = "" // build source code before scanning example. "dotnet build", "go build ./cmd/web"
    env.coverityID              = "cov-xxxx" //"cov-user0"
    env.blkduckID               = "blkduck-xxxx" //"blkduck-user0"
    env.skip_stage              = [ "unit_test": false, "quality_analysis": true, "sca_black_duck": true, "sast_coverity": true, "image_scan_trivy": true, "dast_owasp_zap": true, "performance_test": true, "health_check_dev": true, "automate_test_dev": true, "health_check_sit": true, "automate_test_sit": true, "health_check_uat": true, "automate_test_uat": true, "health_check_prd": true ]
    env.image_regitry_server    = [ "acr": true, "nexus": false, "ecr": false, "gar": false, "gcr": false ]
    env.container_os_platform   = [ "windows": false, "linux": true ]
    env.is_scan_src_code_only   = false
    env.is_build_with_internal_net = false

    // Url env must be equals to host in .helmValues
    url_env_1 = "azapp-entcoreaife-dev-001.azurewebsites.net" // edit # Hostname dev
    url_env_2 = "azapp-entcoreaife-sit-001.azurewebsites.net" // edit # Hostname sit
    url_env_3 = "" // edit # Hostname uat
    url_env_4 = "" // edit # Hostname prd
    url_path_env_1 = "/" // edit # Path for health check dev
    url_path_env_2 = "/" // edit # Path for health check sit
    url_path_env_3 = "/" // edit # Path for health check uat
    url_path_env_4 = "/" // edit # Path for health check prd

     //! Azure Container Registry //
    acr_credentials_cicd      = "${project_group}-asp"
    // DEV
    acr_server_env_1          = "acrentcoreaidev.azurecr.io"    // edit # name of 'Login server' in container registry
    // SIT
    acr_server_env_2          = "acrentcoreaisit.azurecr.io"    // edit # name of 'Login server' in container registry
    // UAT
    acr_server_env_3          = "xxxx"    // edit # name of 'Login server' in container registry
    // PRD
    acr_server_env_4          = "xxxx"    // edit # name of 'Login server' in container registry
    //! End Azure Container Registry //
    

    // Azure Config //
    //! App Service Config //
    app_service_credentials_cicd      = "${project_group}-asp"
    // DEV
    app_service_name_env_1    = "azapp-entcoreaife-dev-001"      // edit # App Service Name
    app_service_rg_env_1      = "rg-dsd-entcoreai-dev-001"      // edit # Resource Group Name of App Service
    // SIT
    app_service_name_env_2    = "azapp-entcoreaife-sit-001"      // edit # App Service Name
    app_service_rg_env_2      = "rg-dsd-entcoreai-sit-001"      // edit # Resource Group Name of App Service
    // UAT
    app_service_name_env_3    = "xxxx"      // edit # App Service Name
    app_service_rg_env_3      = "xxxx"      // edit # Resource Group Name of App Service
    // PRD
    app_service_name_env_4    = "xxxx"      // edit # App Service Production Name
    app_service_rg_env_4      = "xxxx"      // edit # Resource Group Name of App Service
    // COMMON
    env.app_container_port    = 0    // edit # App Service Port
    //! End App Service Config //

    //! Azure key vault Config // 
    env.keyVault_url        = "https://kv-devsecops-prd-001.vault.azure.net/"
    env.keyVault_credential = "vault-creds-for-jenkins-ptt"
    //! End Azure key vault Config //

    env.cicd_env_1 = "dev"
    env.cicd_env_2 = "sit"
    env.cicd_env_3 = "uat"
    env.cicd_env_4 = "prd"

    switch (env.BRANCH_NAME) {

        case "develop":
        case "hotfix":
            switch (envName) {
                case cicd_env_1 :
                    env.envName                   = cicd_env_1
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_1
                    env.app_service_rg            = app_service_rg_env_1
                    // IMAGE
                    env.image_repo_server         = acr_server_env_1
                    env.image_credentials         = "${acr_credentials_cicd}-${cicd_env_1}"
                    env.image_name                = "${env.image_repo_server}/${project_group}-${project_name}"
                    // APP
                    env.url_application           = url_env_1
                    env.url_path                  = url_path_env_1
                    break
                case cicd_env_2:
                    env.envName = cicd_env_2
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_2
                    env.app_service_rg            = app_service_rg_env_2
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_1
                    env.image_prev_credentials    = "${acr_credentials_cicd}-${cicd_env_1}"
                    env.image_repo_server         = acr_server_env_2
                    env.image_credentials         = "${acr_credentials_cicd}-${cicd_env_2}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}-${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}-${project_name}"
                    // APP
                    env.url_application           = url_env_2
                    env.url_path                  = url_path_env_2
                    break
            }
        case "hotfix":
        case "hotfix-deploy":
        case "master":
        case "main":
            switch (envName) {
                case cicd_env_3:
                    env.envName = cicd_env_3
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name          = app_service_name_env_3
                    env.app_service_rg            = app_service_rg_env_3
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_2
                    env.image_prev_credentials    = "${acr_credentials_cicd}-${cicd_env_2}"
                    env.image_repo_server         = acr_server_env_3
                    env.image_credentials         = "${acr_credentials_cicd}-${cicd_env_3}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}-${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}-${project_name}"
                    // APP
                    env.url_application           = url_env_3
                    env.url_path                  = url_path_env_3
                    break
                case cicd_env_4:
                    env.envName = cicd_env_4
                    // App Service
                    env.app_service_credentials    = "${app_service_credentials_cicd}-${envName}"
                    env.app_service_name        = app_service_name_env_4
                    env.app_service_rg            = app_service_rg_env_4
                    // IMAGE
                    env.image_prev_repo_server    = acr_server_env_3
                    env.image_prev_credentials    = "${acr_credentials_cicd}-${cicd_env_3}"
                    env.image_repo_server         = acr_server_env_4
                    env.image_credentials         = "${acr_credentials_cicd}-${cicd_env_4}"
                    env.image_prev_name           = "${env.image_prev_repo_server}/${project_group}-${project_name}"
                    env.image_name                = "${env.image_repo_server}/${project_group}-${project_name}"
                    // APP
                    env.url_application           = url_env_4
                    env.url_path                  = url_path_env_4
                    break
            }
    }
}

return this