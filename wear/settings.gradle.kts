pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "StarboundWear"
include(":app")

// kairos-wear-common lives at C:/Users/zacha/kairos-wear-common.
// From PWA Apps/starbound/wear/, that resolves three levels up.
includeBuild("../../../kairos-wear-common")
