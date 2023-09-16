#Requires -Version 5.1

Import-Module "$PSScriptRoot/build-helpers.psm1" -Force -DisableNameChecking

try {
    execute { Start-Process cmd -Argument "/d /k nest start --debug --watch" } (Resolve-Path ./apps/api)
    execute { Start-Process cmd -Argument "/d /k ng serve" } (Resolve-Path ./apps/web)
}
catch [Exception] {
    write-host
    write-host $_.Exception.Message -fore RED
    write-host
    write-host "Build Failed" -fore RED
    exit 1
}